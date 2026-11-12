import { z } from 'zod';

const phoneRegex = /^(\+91[\s-]?|91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export const phone = z
  .string({ required_error: 'Mobile number is required' })
  .trim()
  .refine((v) => phoneRegex.test(v), 'Enter a valid 10-digit Indian mobile number');

const name = (label) => z.string({ required_error: `${label} is required` }).trim().min(2, `${label} is required`).max(120);
const optionalEmail = z.string().trim().max(120).refine((v) => v === '' || /^\S+@\S+\.\S+$/.test(v), 'Enter a valid email address').optional().default('');
const requiredEmail = z.string({ required_error: 'Email is required' }).trim().toLowerCase().regex(/^\S+@\S+\.\S+$/, 'Enter a valid email address');
const honeypot = z.string().max(0).optional(); // bots fill this; humans never see it

export const contactEnquirySchema = z.object({
  name: name('Name'),
  phone,
  email: optionalEmail,
  message: z.string({ required_error: 'Message is required' }).trim().min(5, 'Please write a short message').max(2000),
  website: honeypot,
});

export const productEnquirySchema = contactEnquirySchema.extend({
  productId: z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid product'),
  interest: z.enum(['retail', 'wholesale']).default('retail'),
});

export const wholesaleEnquirySchema = z.object({
  businessName: name('Business name'),
  phone,
  email: requiredEmail,
  location: z.string({ required_error: 'Business location is required' }).trim().min(2, 'Business location is required').max(150),
  category: z.string({ required_error: 'Select a category' }).trim().min(1, 'Select a category').max(80),
  quantity: z.coerce.number({ invalid_type_error: 'Enter a quantity' }).int('Enter a whole number').min(1, 'Quantity must be at least 1').max(10000000),
  requirements: z.string().trim().max(2000).optional().default(''),
  website: honeypot,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(10, 'Use at least 10 characters')
    .regex(/[A-Za-z]/, 'Include a letter')
    .regex(/\d/, 'Include a number'),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(60),
  description: z.string().trim().max(300).optional().default(''),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().int().min(0).max(9999).optional().default(0),
  image: z.object({ url: z.string(), thumb: z.string().optional() }).nullable().optional(),
});

const optionalPrice = z
  .union([z.coerce.number().min(0), z.literal(''), z.null()])
  .optional()
  .transform((v) => (v === '' || v === null || v === undefined ? undefined : v));

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required').max(120),
  sku: z.string().trim().min(2, 'SKU is required').max(40),
  description: z.string().trim().max(3000).optional().default(''),
  material: z.string().trim().max(120).optional().default(''),
  categories: z.array(z.string().regex(/^[a-f0-9]{24}$/i)).min(1, 'Select at least one category'),
  images: z.array(z.object({ url: z.string(), thumb: z.string().optional() })).max(10).optional().default([]),
  sizes: z.array(z.string().trim().min(1).max(12)).max(20).optional().default([]),
  colours: z
    .array(z.object({ name: z.string().trim().min(1).max(30), hex: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).optional().default('#cccccc') }))
    .max(20)
    .optional()
    .default([]),
  isNewArrival: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  showPrice: z.boolean().optional().default(false),
  retailPrice: optionalPrice,
  wholesalePrice: optionalPrice,
  minWholesaleQty: optionalPrice,
});

export const productListQuery = z.object({
  search: z.string().trim().max(80).optional(),
  category: z.string().trim().max(80).optional(),
  featured: z.enum(['true', 'false']).optional(),
  newArrival: z.enum(['true', 'false']).optional(),
  status: z.enum(['active', 'hidden']).optional(), // admin only
  sort: z.enum(['newest', 'name']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(60).optional().default(12),
});

export const enquiryListQuery = z.object({
  kind: z.enum(['contact', 'product', 'wholesale']).default('contact'),
  status: z.enum(['New', 'Contacted', 'Converted', 'Closed']).optional(),
  search: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export const enquiryUpdateSchema = z.object({ status: z.enum(['New', 'Contacted', 'Converted', 'Closed']) });
export const noteSchemaZ = z.object({ text: z.string().trim().min(1, 'Write a note first').max(1000) });
