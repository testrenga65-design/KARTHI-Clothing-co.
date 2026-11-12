import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: { type: String, required: true }, thumb: String }, { _id: false });
const colourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    hex: { type: String, trim: true, match: [/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Invalid colour code'], default: '#cccccc' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 40 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    material: { type: String, trim: true, maxlength: 120, default: '' },
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      validate: [(v) => v.length > 0, 'Select at least one category'],
      index: true,
    },
    images: { type: [imageSchema], default: [] },
    sizes: { type: [{ type: String, trim: true, maxlength: 12 }], default: [] },
    colours: { type: [colourSchema], default: [] },
    isNewArrival: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    // Prices are only shown publicly when showPrice is true.
    showPrice: { type: Boolean, default: false },
    retailPrice: { type: Number, min: 0 },
    wholesalePrice: { type: Number, min: 0 },
    minWholesaleQty: { type: Number, min: 1 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', sku: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
