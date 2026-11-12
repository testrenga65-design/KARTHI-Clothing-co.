import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import env from '../config/env.js';

export const uploadRoot = path.resolve(env.uploadDir);

export async function ensureUploadDir() {
  await fs.mkdir(uploadRoot, { recursive: true });
}

/** Optimise an image buffer: full-size (max 1600px) + thumbnail (640px), both WebP. */
export async function saveImage(buffer) {
  await ensureUploadDir();
  const id = crypto.randomBytes(12).toString('hex');
  const base = sharp(buffer, { failOn: 'error' }).rotate();
  await base.clone().resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(uploadRoot, `${id}.webp`));
  await base.clone().resize({ width: 640, height: 800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(uploadRoot, `${id}-thumb.webp`));
  return { url: `/uploads/${id}.webp`, thumb: `/uploads/${id}-thumb.webp` };
}

/** Delete files for the given /uploads/... urls (ignores anything outside uploads). */
export async function deleteImages(urls = []) {
  await Promise.all(
    urls
      .filter((u) => typeof u === 'string' && /^\/uploads\/[a-f0-9-]+\.webp$/i.test(u))
      .map((u) => fs.unlink(path.join(uploadRoot, path.basename(u))).catch(() => {}))
  );
}
