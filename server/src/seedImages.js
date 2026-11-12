// Generates tasteful placeholder garment imagery (SVG -> WebP) so the catalogue looks complete
// before real photography is uploaded. Replace these from the admin panel.
import sharp from 'sharp';
import path from 'node:path';
import crypto from 'node:crypto';
import { uploadRoot, ensureUploadDir } from './utils/images.js';

const SHAPES = {
  tee: `<path d="M290 170 L350 140 Q400 195 450 140 L510 170 L640 280 L580 350 L520 310 L520 850 L280 850 L280 310 L220 350 L160 280 Z"/>`,
  shirt: `<path d="M290 160 L350 135 L400 190 L450 135 L510 160 L650 290 L590 365 L525 320 L525 860 L275 860 L275 320 L210 365 L150 290 Z"/><path d="M350 135 L400 215 L450 135" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="5"/><path d="M400 215 L400 860" stroke="rgba(0,0,0,.22)" stroke-width="4"/><g fill="rgba(0,0,0,.3)"><circle cx="400" cy="290" r="6"/><circle cx="400" cy="400" r="6"/><circle cx="400" cy="510" r="6"/><circle cx="400" cy="620" r="6"/><circle cx="400" cy="730" r="6"/></g>`,
  gown: `<path d="M335 130 L372 130 Q400 195 428 130 L465 130 L520 340 L610 880 L190 880 L280 340 Z"/><path d="M300 560 Q400 590 500 560" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="4"/>`,
  kids: `<path d="M310 280 L360 255 Q400 300 440 255 L490 280 L600 370 L550 430 L505 400 L505 780 L295 780 L295 400 L250 430 L200 370 Z"/>`,
};

function svg(shape, fill, bg, variant) {
  const isLight = /^#(f|e|d)/i.test(fill);
  const stroke = isLight ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.12)';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="${bg}"/>
  <ellipse cx="400" cy="${shape === 'gown' ? 905 : 880}" rx="230" ry="18" fill="rgba(0,0,0,.08)"/>
  <g fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" ${variant ? 'transform="translate(400 500) scale(1.18) translate(-400 -500)"' : ''}>${SHAPES[shape]}</g>
</svg>`;
}

async function write(svgString) {
  const id = crypto.randomBytes(12).toString('hex');
  const img = sharp(Buffer.from(svgString));
  await img.clone().webp({ quality: 82 }).toFile(path.join(uploadRoot, `${id}.webp`));
  await img.clone().resize({ width: 480 }).webp({ quality: 74 }).toFile(path.join(uploadRoot, `${id}-thumb.webp`));
  return { url: `/uploads/${id}.webp`, thumb: `/uploads/${id}-thumb.webp` };
}

export async function placeholderImages(shape, hex) {
  await ensureUploadDir();
  return [await write(svg(shape, hex, '#ece6dc', false)), await write(svg(shape, hex, '#f6f3ee', true))];
}
