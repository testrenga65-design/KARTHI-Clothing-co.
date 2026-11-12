import { Link } from 'react-router-dom';
import ProductImage from '../ui/ProductImage';
import { formatPrice } from '../../lib/format';

export default function ProductCard({ product }) {
  const { name, slug, categories, images, colours, sizes, isNewArrival, showPrice, retailPrice } = product;
  return (
    <article className="group">
      <Link to={`/products/${slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
          <ProductImage image={images[0]} thumb alt={name} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
          {isNewArrival && <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider2 text-paper">New</span>}
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/90 py-3 text-center text-xs uppercase tracking-wider2 text-paper transition-transform group-hover:translate-y-0">View details</span>
        </div>
        <div className="pt-4">
          <p className="eyebrow">{categories[0]?.name}</p>
          <h3 className="mt-1 font-serif text-xl leading-snug">{name}</h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-label={`Colours: ${colours.map((c) => c.name).join(', ')}`}>
              {colours.slice(0, 5).map((c) => <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ background: c.hex }} />)}
              {colours.length > 5 && <span className="text-xs text-ink-muted">+{colours.length - 5}</span>}
            </div>
            <span className="text-xs text-ink-muted">{showPrice && retailPrice ? formatPrice(retailPrice) : `${sizes[0]}–${sizes[sizes.length - 1]}`}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-paper-warm" />
      <div className="mt-4 h-3 w-1/3 bg-paper-warm" />
      <div className="mt-3 h-5 w-3/4 bg-paper-warm" />
    </div>
  );
}
