// Business details – edit via client/.env (see .env.example). Nothing is hardcoded in components.
const e = import.meta.env;

export const siteConfig = {
  name: e.VITE_BUSINESS_NAME || 'Karthi Clothing Co.',
  tagline: e.VITE_BUSINESS_TAGLINE || 'Style for Everyday Life.',
  phone: e.VITE_BUSINESS_PHONE || '+91 63810 57469',
  whatsapp: (e.VITE_BUSINESS_WHATSAPP || '916381057469').replace(/\D/g, ''),
  email: e.VITE_BUSINESS_EMAIL || 'karthi18@gmail.com',
  address: e.VITE_BUSINESS_ADDRESS || 'NGR Road, Palladam, Tiruppur, Tamil Nadu, India',
  hours: e.VITE_BUSINESS_HOURS || 'Mon – Sat, 9:30 AM – 7:00 PM',
  mapEmbedUrl: e.VITE_BUSINESS_MAP_EMBED_URL || '',
  social: {
    instagram: e.VITE_SOCIAL_INSTAGRAM || '',
    facebook: e.VITE_SOCIAL_FACEBOOK || '',
    youtube: e.VITE_SOCIAL_YOUTUBE || '',
  },
};
