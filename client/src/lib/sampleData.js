// Realistic sample catalogue. Replace with API data when the backend is connected.
const SHAPES = {
  tee: `<path d="M290 170 L350 140 Q400 195 450 140 L510 170 L640 280 L580 350 L520 310 L520 850 L280 850 L280 310 L220 350 L160 280 Z"/>`,
  shirt: `<path d="M290 160 L350 135 L400 190 L450 135 L510 160 L650 290 L590 365 L525 320 L525 860 L275 860 L275 320 L210 365 L150 290 Z"/><path d="M350 135 L400 215 L450 135" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="5"/><path d="M400 215 L400 860" stroke="rgba(0,0,0,.22)" stroke-width="4"/><g fill="rgba(0,0,0,.3)"><circle cx="400" cy="290" r="6"/><circle cx="400" cy="400" r="6"/><circle cx="400" cy="510" r="6"/><circle cx="400" cy="620" r="6"/><circle cx="400" cy="730" r="6"/></g>`,
  gown: `<path d="M335 130 L372 130 Q400 195 428 130 L465 130 L520 340 L610 880 L190 880 L280 340 Z"/><path d="M300 560 Q400 590 500 560" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="4"/>`,
  kids: `<path d="M310 280 L360 255 Q400 300 440 255 L490 280 L600 370 L550 430 L505 400 L505 780 L295 780 L295 400 L250 430 L200 370 Z"/>`,
};

function art(shape, fill, bg, zoom) {
  const light = /^#(f|e|d)/i.test(fill);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="${bg}"/><ellipse cx="400" cy="${shape === 'gown' ? 905 : 880}" rx="230" ry="18" fill="rgba(0,0,0,.08)"/><g fill="${fill}" stroke="${light ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.12)'}" stroke-width="3" stroke-linejoin="round" ${zoom ? 'transform="translate(400 500) scale(1.18) translate(-400 -500)"' : ''}>${SHAPES[shape]}</g></svg>`;
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return { url, thumb: url };
}

export const categories = [
  ["Men's Wear", 'mens-wear', 'Everyday and occasion wear for men.'],
  ["Women's Wear", 'womens-wear', 'Comfortable, contemporary styles for women.'],
  ['Kids Wear', 'kids-wear', 'Soft, durable clothing for children.'],
  ['T-Shirts', 't-shirts', 'Round neck, polo and printed tees.'],
  ['Shirts', 'shirts', 'Formal and casual shirts.'],
  ['Casual Wear', 'casual-wear', 'Relaxed pieces for daily life.'],
  ['Nightwear', 'nightwear', 'Soft sleepwear and loungewear.'],
].map(([name, slug, description], i) => ({ _id: `c${i}`, name, slug, description }));

const cat = (...slugs) => slugs.map((s) => categories.find((c) => c.slug === s));
const C = {
  white: { name: 'White', hex: '#f5f3ef' }, black: { name: 'Black', hex: '#1f1f1f' }, navy: { name: 'Navy', hex: '#22304a' },
  olive: { name: 'Olive', hex: '#6b6f4e' }, sand: { name: 'Sand', hex: '#cdbba0' }, grey: { name: 'Charcoal', hex: '#4a4a4a' },
  sky: { name: 'Sky Blue', hex: '#a9c3d9' }, rose: { name: 'Dusty Rose', hex: '#c9a29c' }, maroon: { name: 'Maroon', hex: '#6f2f35' },
  mustard: { name: 'Mustard', hex: '#c59a3a' }, sage: { name: 'Sage', hex: '#a3b09a' },
};
const ADULT = ['S', 'M', 'L', 'XL', 'XXL'];
const KIDS = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'];

const raw = [
  ['Essential Cotton Crew Tee', 'KCC-TS-001', ['mens-wear', 't-shirts'], 'tee', [C.white, C.black, C.navy, C.olive], ADULT, 'An everyday crew neck tee cut from combed cotton jersey. Pre-shrunk, soft against the skin and built to keep its shape wash after wash.', '100% combed cotton, 180 GSM', { isFeatured: true, isNewArrival: true }],
  ['Classic Oxford Shirt', 'KCC-SH-002', ['mens-wear', 'shirts'], 'shirt', [C.sky, C.white, C.sand], ADULT, 'A timeless button-down in textured oxford weave. Smart enough for the office, easy enough for the weekend.', 'Cotton oxford, regular fit', { isFeatured: true }],
  ['Relaxed Linen Blend Shirt', 'KCC-SH-003', ['mens-wear', 'shirts', 'casual-wear'], 'shirt', [C.sand, C.sage, C.white], ADULT, 'Breathable linen-cotton shirt designed for Tamil Nadu summers. Lightweight with a relaxed drape.', '55% linen, 45% cotton', { isNewArrival: true }],
  ['Daily Polo T-Shirt', 'KCC-TS-004', ['mens-wear', 't-shirts', 'casual-wear'], 'tee', [C.navy, C.maroon, C.grey], ADULT, 'Pique-knit polo with a clean collar and ribbed cuffs. A dependable staple for uniforms and daily wear.', 'Cotton pique, 210 GSM', { isFeatured: true }],
  ['Everyday Soft Tee for Women', 'KCC-TS-005', ['womens-wear', 't-shirts'], 'tee', [C.rose, C.white, C.sage, C.black], ['XS', 'S', 'M', 'L', 'XL'], 'A relaxed-fit tee in ultra-soft jersey with a flattering neckline. Easy to layer, easy to love.', 'Cotton-modal blend', { isNewArrival: true, isFeatured: true }],
  ['Cotton Everyday Kurti', 'KCC-WW-006', ['womens-wear', 'casual-wear'], 'gown', [C.mustard, C.maroon, C.navy], ADULT, 'A straight-cut cotton kurti with a comfortable length and clean finishing, made for all-day wear.', 'Pure cotton, mid-weight', { isFeatured: true }],
  ['Weekend Casual Shirt', 'KCC-CW-007', ['casual-wear', 'shirts', 'womens-wear'], 'shirt', [C.white, C.sky, C.rose], ['S', 'M', 'L', 'XL'], 'A soft, slightly oversized casual shirt that works open over a tee or buttoned up.', 'Cotton poplin', { isNewArrival: true }],
  ['Kids Play Tee', 'KCC-KW-008', ['kids-wear', 't-shirts'], 'kids', [C.mustard, C.sky, C.sage, C.white], KIDS, 'Gentle on young skin and tough on playground adventures. Tag-free neckline and double-stitched seams.', '100% cotton, 160 GSM', { isFeatured: true }],
  ['Kids Everyday Shirt', 'KCC-KW-009', ['kids-wear', 'shirts'], 'kids', [C.sky, C.white, C.navy], KIDS, 'Easy-care shirt for school and celebrations, with soft collar and smooth buttons.', 'Cotton blend', { isNewArrival: true }],
  ['Soft Cotton Night Tee', 'KCC-NW-010', ['nightwear'], 'tee', [C.grey, C.rose, C.sand], ADULT, "A loose, breathable sleep tee in washed cotton for a good night's rest.", 'Washed cotton jersey', {}],
  ['Lounge Night Gown', 'KCC-NW-011', ['nightwear', 'womens-wear'], 'gown', [C.rose, C.sage, C.navy], ['S', 'M', 'L', 'XL', 'Free Size'], 'A flowing, lightweight night gown with a soft hand-feel. Comfortable in every season.', 'Cotton voile', { isFeatured: true, isNewArrival: true }],
  ['Heavyweight Boxy Tee', 'KCC-TS-012', ['t-shirts', 'casual-wear', 'mens-wear'], 'tee', [C.black, C.sand, C.olive], ADULT, 'A substantial 240 GSM boxy tee with a dropped shoulder. Streetwear attitude, quiet branding.', '100% cotton, 240 GSM', { isFeatured: true }],
];

export const products = raw.map(([name, sku, slugs, shape, colours, sizes, description, material, flags], i) => ({
  _id: `p${i}`,
  name,
  sku,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  description,
  material,
  sizes,
  colours,
  categories: cat(...slugs),
  images: [art(shape, colours[0].hex, '#ece6dc', false), art(shape, colours[0].hex, '#f6f3ee', true)],
  isNewArrival: false,
  isFeatured: false,
  isActive: true,
  showPrice: true, // prices are shown only when true
  retailPrice: 399, // all products priced at ₹399 for now
  createdAt: Date.now() - i * 86400000,
  ...flags,
}));
