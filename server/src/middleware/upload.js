import multer from 'multer';
import { HttpError } from '../utils/asyncHandler.js';

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
  fileFilter(_req, file, cb) {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(null, true);
    cb(new HttpError(400, 'Only JPG, PNG or WebP images are allowed.'));
  },
});
