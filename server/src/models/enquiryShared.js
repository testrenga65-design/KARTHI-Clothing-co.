import mongoose from 'mongoose';

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Converted', 'Closed'];

export const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    by: { type: String, default: 'Admin' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
