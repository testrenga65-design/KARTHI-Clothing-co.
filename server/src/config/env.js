import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

const env = {
  isProd,
  port: Number(process.env.PORT) || 5001,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/karthi-clothing',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  admin: {
    name: process.env.ADMIN_NAME || 'Store Admin',
    email: process.env.ADMIN_EMAIL || '',
    password: process.env.ADMIN_PASSWORD || '',
  },
  business: {
    name: process.env.BUSINESS_NAME || 'Karthi Clothing Co.',
    tagline: process.env.BUSINESS_TAGLINE || 'Style for Everyday Life.',
    phone: process.env.BUSINESS_PHONE || '',
    whatsapp: (process.env.BUSINESS_WHATSAPP || '').replace(/\D/g, ''),
    email: process.env.BUSINESS_EMAIL || '',
    address: process.env.BUSINESS_ADDRESS || '',
    hours: process.env.BUSINESS_HOURS || '',
    mapEmbedUrl: process.env.BUSINESS_MAP_EMBED_URL || '',
    social: {
      instagram: process.env.SOCIAL_INSTAGRAM || '',
      facebook: process.env.SOCIAL_FACEBOOK || '',
      youtube: process.env.SOCIAL_YOUTUBE || '',
    },
  },
};

if (env.jwtSecret.length < 32) {
  const msg = 'JWT_SECRET must be set and at least 32 characters long.';
  if (isProd) {
    throw new Error(msg);
  } else {
    console.warn(`[env] WARNING: ${msg} Using an insecure development secret.`);
    env.jwtSecret = 'dev-only-insecure-secret-do-not-use-in-production';
  }
}

export default env;
