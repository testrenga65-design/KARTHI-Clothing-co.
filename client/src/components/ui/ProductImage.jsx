import { Shirt } from 'lucide-react';

export default function ProductImage({ image, alt, thumb = false, className = '', eager = false }) {
  const src = image ? (thumb ? image.thumb || image.url : image.url) : null;
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-paper-warm text-sand-400 ${className}`} role="img" aria-label={alt}>
        <Shirt size={40} strokeWidth={1} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`object-cover ${className}`} />;
}
