import ProductCard, { ProductCardSkeleton } from './ProductCard';

export default function ProductGrid({ products, loading, skeletons = 4, cols = 'grid-cols-2 lg:grid-cols-4' }) {
  return (
    <div className={`grid gap-x-4 gap-y-10 sm:gap-x-6 ${cols}`}>
      {loading ? Array.from({ length: skeletons }, (_, i) => <ProductCardSkeleton key={i} />) : products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
