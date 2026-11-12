// Data access layer. Today it serves sample data and stores enquiries in localStorage.
// When the backend is ready, re-implement these functions with `api` from ./api.js
// (the endpoints in /server already match these signatures). Components don't need to change.
import { categories, products } from './sampleData';

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const STORE_KEY = 'kcc_enquiries';

export async function getCategories() {
  await delay(120);
  return categories.map((c) => {
    const inCat = products.filter((p) => p.isActive && p.categories.some((x) => x._id === c._id));
    // Category image: its own `image` if set (admin upload), otherwise the first product's photo.
    return { ...c, productCount: inCat.length, image: c.image || inCat[0]?.images[0] };
  });
}

export async function getProducts({ search = '', category = '', featured, newArrival, page = 1, limit = 12, sort = 'newest' } = {}) {
  await delay();
  let list = products.filter((p) => p.isActive);
  if (category) list = list.filter((p) => p.categories.some((c) => c.slug === category));
  if (featured) list = list.filter((p) => p.isFeatured);
  if (newArrival) list = list.filter((p) => p.isNewArrival);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((p) => [p.name, p.sku, p.description, ...p.categories.map((c) => c.name)].join(' ').toLowerCase().includes(q));
  }
  list = [...list].sort(sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : (a, b) => b.createdAt - a.createdAt);
  const total = list.length;
  return { items: list.slice((page - 1) * limit, page * limit), total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getProduct(slug) {
  await delay();
  const product = products.find((p) => p.slug === slug && p.isActive);
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  const related = products.filter((p) => p._id !== product._id && p.isActive && p.categories.some((c) => product.categories.some((x) => x._id === c._id))).slice(0, 4);
  return { product, related };
}

/** kind: 'contact' | 'product' | 'wholesale' */
export async function submitEnquiry(kind, payload) {
  await delay(500);
  const { website, ...data } = payload; // `website` is the anti-spam honeypot
  if (website) return { ok: true };
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    all.unshift({ id: crypto.randomUUID(), kind, status: 'New', createdAt: new Date().toISOString(), ...data });
    localStorage.setItem(STORE_KEY, JSON.stringify(all.slice(0, 200)));
  } catch { /* storage unavailable – still show success in demo mode */ }
  return { ok: true };
}
