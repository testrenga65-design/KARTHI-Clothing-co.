import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, MessageCircle, Send, Store } from 'lucide-react';
import Seo from '../components/ui/Seo';
import ProductImage from '../components/ui/ProductImage';
import ProductGrid from '../components/product/ProductGrid';
import ProductEnquiryModal from '../components/product/ProductEnquiryModal';
import { PageLoader, ErrorState } from '../components/ui/States';
import { useAsync } from '../lib/useAsync';
import { getProduct } from '../lib/data';
import { formatPrice } from '../lib/format';
import { useSiteConfig } from '../context/SiteConfigContext';
import { productEnquiryMessage, whatsappLink } from '../lib/whatsapp';

export default function ProductDetail() {
  const { slug } = useParams();
  const business = useSiteConfig();
  const { data, loading, error, reload } = useAsync(() => getProduct(slug), [slug]);
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState(null); // 'retail' | 'wholesale' | null
  useEffect(() => { setActive(0); }, [slug]);

  if (loading) return <PageLoader />;
  if (error?.status === 404) return (
    <div className="container-x py-24 text-center">
      <h1 className="text-5xl">Product not found</h1>
      <p className="mt-3 text-ink-muted">This product may have been removed or is no longer available.</p>
      <Link to="/products" className="btn-primary mt-8">Back to collection</Link>
    </div>
  );
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const { product: p, related } = data;
  const label = 'text-xs font-medium uppercase tracking-wider2 text-ink-soft';

  return (
    <>
      <Seo title={p.name} description={p.description.slice(0, 155)} image={p.images[0]?.url} />
      <div className="container-x py-8 sm:py-12">
        <nav className="mb-8 flex flex-wrap items-center gap-1 text-xs text-ink-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link><ChevronRight size={12} />
          <Link to="/products" className="hover:text-ink">Collection</Link><ChevronRight size={12} />
          <Link to={`/products?category=${p.categories[0].slug}`} className="hover:text-ink">{p.categories[0].name}</Link><ChevronRight size={12} />
          <span className="text-ink">{p.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-[88px_1fr]">
              <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col" role="tablist" aria-label="Product images">
                {p.images.map((img, i) => (
                  <button key={i} role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`h-24 w-20 shrink-0 overflow-hidden border-2 sm:h-28 sm:w-full ${i === active ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <ProductImage image={img} thumb alt={`${p.name} view ${i + 1}`} className="h-full w-full" />
                  </button>
                ))}
              </div>
              <div className="order-1 aspect-[4/5] overflow-hidden bg-paper-warm sm:order-2">
                <ProductImage image={p.images[active]} alt={p.name} eager className="h-full w-full" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-wrap gap-2">
              {p.categories.map((c) => <Link key={c._id} to={`/products?category=${c.slug}`} className="eyebrow hover:text-ink">{c.name}</Link>)}
              {p.isNewArrival && <span className="bg-ink px-2 py-0.5 text-[10px] uppercase tracking-wider2 text-paper">New</span>}
            </div>
            <h1 className="mt-3 text-5xl leading-tight">{p.name}</h1>
            <p className="mt-2 text-sm text-ink-muted">Product code: <span className="font-medium text-ink">{p.sku}</span></p>

            {p.showPrice && p.retailPrice ? (
              <div className="mt-5 flex items-baseline gap-4">
                <span className="font-serif text-3xl">{formatPrice(p.retailPrice)}</span>
                {p.wholesalePrice && <span className="text-sm text-ink-muted">Wholesale from {formatPrice(p.wholesalePrice)}</span>}
              </div>
            ) : <p className="mt-5 text-sm text-ink-muted">Pricing shared on enquiry — retail &amp; wholesale rates available.</p>}

            <p className="mt-6 leading-relaxed text-ink-soft">{p.description}</p>
            {p.material && <p className="mt-3 text-sm text-ink-muted"><span className="text-ink">Fabric:</span> {p.material}</p>}

            <div className="mt-8 border-t border-paper-line pt-6">
              <h2 className={label}>Available colours</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.colours.map((c) => <li key={c.name} className="flex items-center gap-2 border border-paper-line bg-white px-3 py-1.5 text-sm"><span className="h-4 w-4 rounded-full border border-black/15" style={{ background: c.hex }} />{c.name}</li>)}
              </ul>
            </div>
            <div className="mt-6">
              <h2 className={label}>Available sizes</h2>
              <ul className="mt-3 flex flex-wrap gap-2">{p.sizes.map((s) => <li key={s} className="flex h-10 min-w-12 items-center justify-center border border-paper-line bg-white px-3 text-sm">{s}</li>)}</ul>
            </div>

            <div className="mt-10 space-y-3">
              <button className="btn-primary w-full" onClick={() => setModal('retail')}><Send size={16} /> Enquire about this product</button>
              <button className="btn-outline w-full" onClick={() => setModal('wholesale')}><Store size={16} /> Wholesale / bulk enquiry</button>
              <a href={whatsappLink(business.whatsapp, productEnquiryMessage(p, business))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full"><MessageCircle size={18} /> Enquire on WhatsApp</a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 text-4xl">You may also like</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
      {modal && <ProductEnquiryModal product={p} defaultInterest={modal} onClose={() => setModal(null)} />}
    </>
  );
}
