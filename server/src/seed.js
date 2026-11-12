import env from './config/env.js';
import { connectDB } from './config/db.js';
import AdminUser from './models/AdminUser.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import CustomerEnquiry from './models/CustomerEnquiry.js';
import WholesaleEnquiry from './models/WholesaleEnquiry.js';
import { slugify } from './utils/slug.js';
import { placeholderImages } from './seedImages.js';
import mongoose from 'mongoose';

const CATEGORIES = [
  ['Men\'s Wear', 'Everyday and occasion wear for men.'],
  ['Women\'s Wear', 'Comfortable, contemporary styles for women.'],
  ['Kids Wear', 'Soft, durable clothing for children.'],
  ['T-Shirts', 'Round neck, polo and printed tees.'],
  ['Shirts', 'Formal and casual shirts.'],
  ['Casual Wear', 'Relaxed pieces for daily life.'],
  ['Nightwear', 'Soft sleepwear and loungewear.'],
];

const C = {
  white: ['White', '#f5f3ef'], black: ['Black', '#1f1f1f'], navy: ['Navy', '#22304a'], olive: ['Olive', '#6b6f4e'],
  sand: ['Sand', '#cdbba0'], grey: ['Charcoal', '#4a4a4a'], sky: ['Sky Blue', '#a9c3d9'], rose: ['Dusty Rose', '#c9a29c'],
  maroon: ['Maroon', '#6f2f35'], mustard: ['Mustard', '#c59a3a'], sage: ['Sage', '#a3b09a'],
};
const ADULT = ['S', 'M', 'L', 'XL', 'XXL'];
const KIDS = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'];

// [name, sku, cats, shape, colours, sizes, description, material, flags]
const PRODUCTS = [
  ['Essential Cotton Crew Tee', 'KCC-TS-001', ['Men\'s Wear', 'T-Shirts'], 'tee', [C.white, C.black, C.navy, C.olive], ADULT, 'A everyday crew neck tee cut from combed cotton jersey. Pre-shrunk, soft against the skin and built to keep its shape wash after wash.', '100% combed cotton, 180 GSM', { isFeatured: true, isNewArrival: true }],
  ['Classic Oxford Shirt', 'KCC-SH-002', ['Men\'s Wear', 'Shirts'], 'shirt', [C.sky, C.white, C.sand], ADULT, 'A timeless button-down in textured oxford weave. Smart enough for the office, easy enough for the weekend.', 'Cotton oxford, regular fit', { isFeatured: true }],
  ['Relaxed Linen Blend Shirt', 'KCC-SH-003', ['Men\'s Wear', 'Shirts', 'Casual Wear'], 'shirt', [C.sand, C.sage, C.white], ADULT, 'Breathable linen-cotton shirt designed for Tamil Nadu summers. Lightweight with a relaxed drape.', '55% linen, 45% cotton', { isNewArrival: true }],
  ['Daily Polo T-Shirt', 'KCC-TS-004', ['Men\'s Wear', 'T-Shirts', 'Casual Wear'], 'tee', [C.navy, C.maroon, C.grey], ADULT, 'Pique-knit polo with a clean collar and ribbed cuffs. A dependable staple for uniforms and daily wear.', 'Cotton pique, 210 GSM', { isFeatured: true }],
  ['Everyday Soft Tee for Women', 'KCC-TS-005', ['Women\'s Wear', 'T-Shirts'], 'tee', [C.rose, C.white, C.sage, C.black], ['XS', 'S', 'M', 'L', 'XL'], 'A relaxed-fit tee in ultra-soft jersey with a flattering neckline. Easy to layer, easy to love.', 'Cotton-modal blend', { isNewArrival: true, isFeatured: true }],
  ['Cotton Everyday Kurti', 'KCC-WW-006', ['Women\'s Wear', 'Casual Wear'], 'gown', [C.mustard, C.maroon, C.navy], ['S', 'M', 'L', 'XL', 'XXL'], 'A straight-cut cotton kurti with a comfortable length and clean finishing, made for all-day wear.', 'Pure cotton, mid-weight', { isFeatured: true }],
  ['Weekend Casual Shirt', 'KCC-CW-007', ['Casual Wear', 'Shirts', 'Women\'s Wear'], 'shirt', [C.white, C.sky, C.rose], ['S', 'M', 'L', 'XL'], 'A soft, slightly oversized casual shirt that works open over a tee or buttoned up.', 'Cotton poplin', { isNewArrival: true }],
  ['Kids Play Tee', 'KCC-KW-008', ['Kids Wear', 'T-Shirts'], 'kids', [C.mustard, C.sky, C.sage, C.white], KIDS, 'Gentle on young skin and tough on playground adventures. Tag-free neckline and double-stitched seams.', '100% cotton, 160 GSM', { isFeatured: true }],
  ['Kids Everyday Shirt', 'KCC-KW-009', ['Kids Wear', 'Shirts'], 'kids', [C.sky, C.white, C.navy], KIDS, 'Easy-care shirt for school and celebrations, with soft collar and smooth buttons.', 'Cotton blend', { isNewArrival: true }],
  ['Soft Cotton Night Tee', 'KCC-NW-010', ['Nightwear'], 'tee', [C.grey, C.rose, C.sand], ADULT, 'A loose, breathable sleep tee in washed cotton for a good night\'s rest.', 'Washed cotton jersey', {}],
  ['Lounge Night Gown', 'KCC-NW-011', ['Nightwear', 'Women\'s Wear'], 'gown', [C.rose, C.sage, C.navy], ['S', 'M', 'L', 'XL', 'Free Size'], 'A flowing, lightweight night gown with a soft hand-feel. Comfortable in every season.', 'Cotton voile', { isFeatured: true, isNewArrival: true }],
  ['Heavyweight Boxy Tee', 'KCC-TS-012', ['T-Shirts', 'Casual Wear', 'Men\'s Wear'], 'tee', [C.black, C.sand, C.olive], ADULT, 'A substantial 240 GSM boxy tee with a dropped shoulder. Streetwear attitude, quiet branding.', '100% cotton, 240 GSM', { isFeatured: true }],
];

async function run() {
  await connectDB();
  if (process.argv.includes('--reset')) {
    await Promise.all([Category, Product, CustomerEnquiry, WholesaleEnquiry].map((m) => m.deleteMany({})));
    console.log('[seed] cleared catalogue + enquiries (admin users kept)');
  }

  // Admin
  if (env.admin.email && env.admin.password) {
    if (!(await AdminUser.exists({ email: env.admin.email.toLowerCase() }))) {
      await AdminUser.create({ name: env.admin.name, email: env.admin.email, password: env.admin.password });
      console.log(`[seed] admin created: ${env.admin.email}`);
    } else console.log('[seed] admin already exists');
  } else console.warn('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set; no admin created');

  if (await Product.exists()) {
    console.log('[seed] products already exist; skipping sample catalogue (use `npm run seed:reset` to rebuild)');
    return;
  }

  const cats = {};
  for (const [i, [name, description]] of CATEGORIES.entries()) {
    cats[name] = await Category.create({ name, slug: slugify(name), description, order: i });
  }

  const created = [];
  for (const [name, sku, catNames, shape, colours, sizes, description, material, flags] of PRODUCTS) {
    const images = await placeholderImages(shape, colours[0][1]);
    created.push(
      await Product.create({
        name, sku, slug: slugify(name), description, material, sizes, images,
        categories: catNames.map((n) => cats[n]._id),
        colours: colours.map(([n, hex]) => ({ name: n, hex })),
        ...flags,
      })
    );
  }

  await CustomerEnquiry.create([
    { type: 'product', name: 'Arun Kumar', phone: '9876543210', email: 'arun@example.com', message: 'Interested in 120 pcs of this tee in black and navy. Please share rates.', interest: 'wholesale', product: created[0]._id, productSnapshot: { name: created[0].name, sku: created[0].sku } },
    { type: 'contact', name: 'Meena S', phone: '9123456780', message: 'Do you supply school uniform fabric and shirts in bulk?', status: 'Contacted', notes: [{ text: 'Called back, sending catalogue on WhatsApp.', by: 'Admin' }] },
  ]);
  await WholesaleEnquiry.create({ businessName: 'Sri Murugan Textiles', phone: '9988776655', email: 'sm.textiles@example.com', location: 'Madurai, Tamil Nadu', category: 'Shirts', quantity: 500, requirements: 'Looking for monthly supply, mixed sizes M to XXL.' });

  console.log(`[seed] created ${CATEGORIES.length} categories, ${created.length} products, sample enquiries`);
}

run()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
