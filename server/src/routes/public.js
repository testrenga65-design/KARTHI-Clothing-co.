import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import env from '../config/env.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import CustomerEnquiry from '../models/CustomerEnquiry.js';
import WholesaleEnquiry from '../models/WholesaleEnquiry.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';
import { escapeRegex } from '../utils/slug.js';
import { validate } from '../middleware/validate.js';
import { contactEnquirySchema, productEnquirySchema, wholesaleEnquirySchema, productListQuery } from './schemas.js';

const router = Router();

/* ---------- Business configuration (from env) ---------- */
router.get('/config', (_req, res) => res.json(env.business));

/* ---------- Categories ---------- */
router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();
    const counts = await Product.aggregate([{ $match: { isActive: true } }, { $unwind: '$categories' }, { $group: { _id: '$categories', n: { $sum: 1 } } }]);
    const map = new Map(counts.map((c) => [String(c._id), c.n]));
    res.json({ categories: categories.map((c) => ({ ...c, productCount: map.get(String(c._id)) || 0 })) });
  })
);

/* ---------- Products ---------- */
export async function buildProductFilter(q, { admin = false } = {}) {
  const filter = {};
  if (!admin) filter.isActive = true;
  else if (q.status) filter.isActive = q.status === 'active';
  if (q.featured) filter.isFeatured = q.featured === 'true';
  if (q.newArrival) filter.isNewArrival = q.newArrival === 'true';
  if (q.category) {
    const cat = await Category.findOne({ $or: [{ slug: q.category }, ...(/^[a-f0-9]{24}$/i.test(q.category) ? [{ _id: q.category }] : [])] }).select('_id');
    filter.categories = cat ? cat._id : null; // unknown category -> no results
  }
  if (q.search) {
    const rx = new RegExp(escapeRegex(q.search), 'i');
    filter.$or = [{ name: rx }, { sku: rx }, { description: rx }];
  }
  return filter;
}

export function productProjection(doc) {
  const p = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  if (!p.showPrice) {
    delete p.retailPrice;
    delete p.wholesalePrice;
    delete p.minWholesaleQty;
  }
  return p;
}

router.get(
  '/products',
  validate(productListQuery, 'query'),
  asyncHandler(async (req, res) => {
    const q = req.validatedQuery;
    const filter = await buildProductFilter(q);
    const sort = q.sort === 'name' ? { name: 1 } : { createdAt: -1 };
    const [items, total] = await Promise.all([
      Product.find(filter).populate('categories', 'name slug').sort(sort).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ items: items.map(productProjection), total, page: q.page, pages: Math.max(1, Math.ceil(total / q.limit)) });
  })
);

router.get(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('categories', 'name slug').lean();
    if (!product) throw new HttpError(404, 'Product not found');
    const related = await Product.find({ isActive: true, _id: { $ne: product._id }, categories: { $in: product.categories.map((c) => c._id) } })
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    res.json({ product: productProjection(product), related: related.map(productProjection) });
  })
);

/* ---------- Enquiries ---------- */
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this connection. Please try again later or contact us on WhatsApp.' },
});

// Honest-looking success for bots that fill the hidden field, without saving anything.
const isBot = (req) => Boolean(req.body.website);

router.post(
  '/enquiries/contact',
  enquiryLimiter,
  validate(contactEnquirySchema),
  asyncHandler(async (req, res) => {
    if (!isBot(req)) {
      const { name, phone, email, message } = req.body;
      await CustomerEnquiry.create({ type: 'contact', name, phone, email, message });
    }
    res.status(201).json({ ok: true, message: 'Thank you! We have received your message and will get back to you shortly.' });
  })
);

router.post(
  '/enquiries/product',
  enquiryLimiter,
  validate(productEnquirySchema),
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.body.productId, isActive: true }).select('name sku');
    if (!product) throw new HttpError(404, 'Product not found');
    if (!isBot(req)) {
      const { name, phone, email, message, interest } = req.body;
      await CustomerEnquiry.create({ type: 'product', name, phone, email, message, interest, product: product._id, productSnapshot: { name: product.name, sku: product.sku } });
    }
    res.status(201).json({ ok: true, message: 'Enquiry sent! Our team will contact you with details shortly.' });
  })
);

router.post(
  '/enquiries/wholesale',
  enquiryLimiter,
  validate(wholesaleEnquirySchema),
  asyncHandler(async (req, res) => {
    if (!isBot(req)) {
      const { website, ...data } = req.body;
      await WholesaleEnquiry.create(data);
    }
    res.status(201).json({ ok: true, message: 'Thank you! Your wholesale enquiry has been received. We will share pricing and details soon.' });
  })
);

export default router;
