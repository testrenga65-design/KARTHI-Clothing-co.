import { Router } from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import CustomerEnquiry from '../models/CustomerEnquiry.js';
import WholesaleEnquiry from '../models/WholesaleEnquiry.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';
import { escapeRegex, uniqueSlug } from '../utils/slug.js';
import { saveImage, deleteImages } from '../utils/images.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { imageUpload } from '../middleware/upload.js';
import { buildProductFilter } from './public.js';
import { categorySchema, productSchema, productListQuery, enquiryListQuery, enquiryUpdateSchema, noteSchemaZ } from './schemas.js';

const router = Router();
router.use(requireAdmin);

const imageUrls = (images = []) => images.flatMap((i) => [i.url, i.thumb]).filter(Boolean);

/* ---------- Dashboard ---------- */
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [products, activeProducts, categories, contactTotal, wholesaleTotal, newContact, newProduct, newWholesale, recentCustomer, recentWholesale] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments(),
      CustomerEnquiry.countDocuments(),
      WholesaleEnquiry.countDocuments(),
      CustomerEnquiry.countDocuments({ type: 'contact', status: 'New' }),
      CustomerEnquiry.countDocuments({ type: 'product', status: 'New' }),
      WholesaleEnquiry.countDocuments({ status: 'New' }),
      CustomerEnquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
      WholesaleEnquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);
    const recent = [
      ...recentCustomer.map((e) => ({ _id: e._id, kind: e.type, name: e.name, summary: e.type === 'product' ? e.productSnapshot?.name : e.message, status: e.status, createdAt: e.createdAt })),
      ...recentWholesale.map((e) => ({ _id: e._id, kind: 'wholesale', name: e.businessName, summary: `${e.quantity} pcs · ${e.category}`, status: e.status, createdAt: e.createdAt })),
    ]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8);
    res.json({
      products,
      activeProducts,
      categories,
      enquiries: contactTotal + wholesaleTotal,
      newEnquiries: newContact + newProduct + newWholesale,
      newByKind: { contact: newContact, product: newProduct, wholesale: newWholesale },
      recent,
    });
  })
);

/* ---------- Image upload ---------- */
router.post(
  '/uploads',
  imageUpload.array('images', 10),
  asyncHandler(async (req, res) => {
    if (!req.files?.length) throw new HttpError(400, 'No images received');
    const images = [];
    for (const file of req.files) {
      try {
        images.push(await saveImage(file.buffer));
      } catch {
        throw new HttpError(400, `"${file.originalname}" is not a valid image.`);
      }
    }
    res.status(201).json({ images });
  })
);

/* ---------- Categories ---------- */
router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    const counts = await Product.aggregate([{ $unwind: '$categories' }, { $group: { _id: '$categories', n: { $sum: 1 } } }]);
    const map = new Map(counts.map((c) => [String(c._id), c.n]));
    res.json({ categories: categories.map((c) => ({ ...c, productCount: map.get(String(c._id)) || 0 })) });
  })
);

router.post(
  '/categories',
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    const slug = await uniqueSlug(Category, req.body.name);
    const category = await Category.create({ ...req.body, image: req.body.image || undefined, slug });
    res.status(201).json({ category });
  })
);

router.put(
  '/categories/:id',
  validate(categorySchema),
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new HttpError(404, 'Category not found');
    if (req.body.name !== category.name) category.slug = await uniqueSlug(Category, req.body.name, category._id);
    const oldImage = category.image?.url;
    Object.assign(category, { ...req.body, image: req.body.image || undefined });
    await category.save();
    if (oldImage && oldImage !== category.image?.url) await deleteImages([oldImage, `${oldImage.replace('.webp', '')}-thumb.webp`]);
    res.json({ category });
  })
);

router.delete(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const inUse = await Product.countDocuments({ categories: req.params.id });
    if (inUse) throw new HttpError(409, `This category is used by ${inUse} product${inUse > 1 ? 's' : ''}. Reassign or delete them first.`);
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new HttpError(404, 'Category not found');
    if (category.image?.url) await deleteImages(imageUrls([category.image]));
    res.json({ ok: true });
  })
);

/* ---------- Products ---------- */
router.get(
  '/products',
  validate(productListQuery, 'query'),
  asyncHandler(async (req, res) => {
    const q = req.validatedQuery;
    const filter = await buildProductFilter(q, { admin: true });
    const sort = q.sort === 'name' ? { name: 1 } : { createdAt: -1 };
    const [items, total] = await Promise.all([
      Product.find(filter).populate('categories', 'name slug').sort(sort).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: q.page, pages: Math.max(1, Math.ceil(total / q.limit)) });
  })
);

router.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).lean();
    if (!product) throw new HttpError(404, 'Product not found');
    res.json({ product });
  })
);

async function assertCategoriesExist(ids) {
  const n = await Category.countDocuments({ _id: { $in: ids } });
  if (n !== new Set(ids).size) throw new HttpError(400, 'One or more selected categories no longer exist', { categories: 'Invalid category selected' });
}

const dedupe = (arr) => [...new Set(arr.map((s) => s.trim()))].filter(Boolean);

router.post(
  '/products',
  validate(productSchema),
  asyncHandler(async (req, res) => {
    await assertCategoriesExist(req.body.categories);
    const slug = await uniqueSlug(Product, req.body.name);
    const product = await Product.create({ ...req.body, sizes: dedupe(req.body.sizes), slug });
    res.status(201).json({ product });
  })
);

router.put(
  '/products/:id',
  validate(productSchema),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new HttpError(404, 'Product not found');
    await assertCategoriesExist(req.body.categories);
    if (req.body.name !== product.name) product.slug = await uniqueSlug(Product, req.body.name, product._id);
    const removed = imageUrls(product.images).filter((u) => !imageUrls(req.body.images).includes(u));
    // Clear optional prices when omitted
    product.set({ retailPrice: undefined, wholesalePrice: undefined, minWholesaleQty: undefined });
    product.set({ ...req.body, sizes: dedupe(req.body.sizes) });
    await product.save();
    await deleteImages(removed);
    res.json({ product });
  })
);

router.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new HttpError(404, 'Product not found');
    await deleteImages(imageUrls(product.images));
    res.json({ ok: true });
  })
);

/* ---------- Enquiries ---------- */
const modelFor = (kind) => {
  if (kind === 'wholesale') return WholesaleEnquiry;
  if (kind === 'contact' || kind === 'product') return CustomerEnquiry;
  throw new HttpError(400, 'Unknown enquiry type');
};

router.get(
  '/enquiries',
  validate(enquiryListQuery, 'query'),
  asyncHandler(async (req, res) => {
    const q = req.validatedQuery;
    const Model = modelFor(q.kind);
    const filter = q.kind === 'wholesale' ? {} : { type: q.kind };
    if (q.status) filter.status = q.status;
    if (q.search) {
      const rx = new RegExp(escapeRegex(q.search), 'i');
      filter.$or = q.kind === 'wholesale' ? [{ businessName: rx }, { phone: rx }, { email: rx }, { location: rx }, { category: rx }] : [{ name: rx }, { phone: rx }, { email: rx }, { message: rx }, { 'productSnapshot.name': rx }, { 'productSnapshot.sku': rx }];
    }
    const [items, total] = await Promise.all([
      Model.find(filter).sort({ createdAt: -1 }).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
      Model.countDocuments(filter),
    ]);
    res.json({ items, total, page: q.page, pages: Math.max(1, Math.ceil(total / q.limit)) });
  })
);

router.patch(
  '/enquiries/:kind/:id',
  validate(enquiryUpdateSchema),
  asyncHandler(async (req, res) => {
    const enquiry = await modelFor(req.params.kind).findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!enquiry) throw new HttpError(404, 'Enquiry not found');
    res.json({ enquiry });
  })
);

router.post(
  '/enquiries/:kind/:id/notes',
  validate(noteSchemaZ),
  asyncHandler(async (req, res) => {
    const enquiry = await modelFor(req.params.kind).findById(req.params.id);
    if (!enquiry) throw new HttpError(404, 'Enquiry not found');
    enquiry.notes.push({ text: req.body.text, by: req.user.name });
    await enquiry.save();
    res.status(201).json({ enquiry });
  })
);

router.delete(
  '/enquiries/:kind/:id',
  asyncHandler(async (req, res) => {
    const enquiry = await modelFor(req.params.kind).findByIdAndDelete(req.params.id);
    if (!enquiry) throw new HttpError(404, 'Enquiry not found');
    res.json({ ok: true });
  })
);

export default router;
