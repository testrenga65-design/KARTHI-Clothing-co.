import mongoose from 'mongoose';
import { ENQUIRY_STATUSES, noteSchema } from './enquiryShared.js';

const customerEnquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['contact', 'product'], required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    // Only for product enquiries
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productSnapshot: { name: String, sku: String },
    interest: { type: String, enum: ['retail', 'wholesale', ''], default: '' },
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'New', index: true },
    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true }
);

customerEnquirySchema.index({ createdAt: -1 });

export default mongoose.model('CustomerEnquiry', customerEnquirySchema);
