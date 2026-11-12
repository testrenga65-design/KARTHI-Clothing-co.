import mongoose from 'mongoose';
import { ENQUIRY_STATUSES, noteSchema } from './enquiryShared.js';

const wholesaleEnquirySchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    location: { type: String, required: true, trim: true, maxlength: 150 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    quantity: { type: Number, required: true, min: 1 },
    requirements: { type: String, trim: true, maxlength: 2000, default: '' },
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'New', index: true },
    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true }
);

wholesaleEnquirySchema.index({ createdAt: -1 });

export default mongoose.model('WholesaleEnquiry', wholesaleEnquirySchema);
