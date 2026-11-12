import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Layers, Handshake, Store, ShoppingBag } from 'lucide-react';
import Seo from '../components/ui/Seo';
import { SectionHeading } from '../components/ui/Section';
import ProductGrid from '../components/product/ProductGrid';
import ProductImage from '../components/ui/ProductImage';
import { ErrorState } from '../components/ui/States';
import { useAsync } from '../lib/useAsync';
import { getCategories, getProducts } from '../lib/data';
import { useSiteConfig } from '../context/SiteConfigContext';
import { whatsappLink } from '../lib/whatsapp';

const why = [
  { Icon: Layers, title: 'Consistent quality', text: 'Every batch is checked for fabric, stitching and finish before it leaves us.' },
  { Icon: Handshake, title: 'Fair wholesale terms', text: 'Transparent bulk pricing and flexible quantities for growing retailers.' },
  { Icon: Truck, title: 'Reliable supply', text: 'Dependable lead times and repeat availability on popular styles.' },
  { Icon: ShieldCheck, title: 'Trusted by shops', text: 'Long-term relationships with retailers built on honesty and service.' },
];

export default function Home() {
  const c = useSiteConfig();
  const cats = useAsync(() => getCategories(), []);
  const fresh = useAsync(() => getProducts({ newArrival: true, limit: 4 }), []);
  const popular = useAsync(() => getProducts({ featured: true, limit: 8, sort: 'name' }), []);
  const hero = popular.data?.items ?? [];

  return (
    <>
      <Seo description={`${c.name} – wholesale and retail garments from Tamil Nadu. ${c.tagline} Browse the collection and enquire for bulk orders.`} />

      {/* Hero */}
      <section className="border-b border-paper-line bg-paper-warm">
        <div className="container-x grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6">Wholesale &amp; Retail · Tamil Nadu</p>
            <h1 className="text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">{c.tagline.replace(/\.$/, '')}<span className="text-sand-400">.</span></h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ink-muted">Thoughtfully made garments for men, women and kids. Shop the collection, or partner with {c.name} for dependable wholesale supply.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">Explore collection <ArrowRight size={16} /></Link>
              <Link to="/wholesale" className="btn-outline">Wholesale enquiry</Link>
            </div>
          </div>
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="aspect-[4/5] overflow-hidden bg-paper-line"><ProductImage image={hero[0]?.images[0]} alt="" eager className="h-full w-full" /></div>
              <div className="mt-10 aspect-[4/5] overflow-hidden bg-paper-line sm:mt-16"><ProductImage image={hero[2]?.images[0]} alt="" eager className="h-full w-full" /></div>
            </div>
            <div className="absolute -bottom-5 left-4 hidden bg-ink px-5 py-4 text-paper sm:block">
              <p className="font-serif text-3xl">Bulk orders welcome</p>
              <p className="text-xs uppercase tracking-wider2 text-sand-300">Retailers · Shops · Businesses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-20">
        <SectionHeading eyebrow="Shop by category" title="Find your fit" to="/products" />
        {cats.error ? <ErrorState error={cats.error} onRetry={cats.reload} /> : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {(cats.data ?? Array.from({ length: 4 })).slice(0, 4).map((cat, i) => cat ? (
              <Link key={cat._id} to={`/products?category=${cat.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
                  <ProductImage image={cat.image} thumb alt={cat.name} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute left-3 top-3 bg-paper px-2.5 py-1 text-[10px] font-medium tracking-wider2 text-ink">0{i + 1}</span>
                </div>
                <div className="flex items-end justify-between pt-4">
                  <div>
                    <h3 className="font-serif text-2xl leading-tight">{cat.name}</h3>
                    <p className="mt-1 text-xs text-ink-muted">{cat.productCount} styles</p>
                  </div>
                  <ArrowRight size={18} className="mb-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ) : <div key={i} className="aspect-[4/5] animate-pulse bg-paper-warm" />)}
          </div>
        )}
      </section>

      {/* New arrivals */}
      <section className="container-x pb-20">
        <SectionHeading eyebrow="Just in" title="New arrivals" to="/products" />
        {fresh.error ? <ErrorState error={fresh.error} onRetry={fresh.reload} /> : <ProductGrid products={fresh.data?.items ?? []} loading={fresh.loading} />}
      </section>

      {/* Wholesale / retail */}
      <section className="bg-ink text-paper">
        <div className="container-x grid md:grid-cols-2">
          {[
            { Icon: ShoppingBag, k: 'Retail', title: 'For everyday shoppers', text: 'Browse our collection, check sizes and colours, and enquire on WhatsApp or through the website. We will help you pick the right fit.', to: '/products', cta: 'Browse collection' },
            { Icon: Store, k: 'Wholesale', title: 'For shops & businesses', text: 'Stock your store with dependable styles at wholesale rates. Tell us your category and quantity and we will send you a tailored quote.', to: '/wholesale', cta: 'Request wholesale pricing' },
          ].map(({ Icon, k, title, text, to, cta }) => (
            <div key={k} className="bg-ink px-0 py-14 md:px-10 md:first:pl-0 md:last:pr-0">
              <Icon strokeWidth={1.25} size={32} className="text-sand-300" />
              <p className="mt-6 text-xs uppercase tracking-wider2 text-sand-300">{k}</p>
              <h3 className="mt-2 text-4xl">{title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">{text}</p>
              <Link to={to} className="group mt-7 inline-flex items-center gap-2 border-b border-paper pb-1 text-sm">{cta}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="container-x py-20">
        <SectionHeading eyebrow="Customer favourites" title="Popular products" to="/products" />
        {popular.error ? <ErrorState error={popular.error} onRetry={popular.reload} /> : <ProductGrid products={popular.data?.items.slice(0, 4) ?? []} loading={popular.loading} />}
      </section>

      {/* Why us */}
      <section className="border-y border-paper-line bg-paper-warm">
        <div className="container-x py-20">
          <SectionHeading eyebrow={`Why ${c.name}`} title="Built on trust, stitched with care" center />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ Icon, title, text }) => (
              <div key={title}>
                <Icon strokeWidth={1.25} size={30} className="text-sand-500" />
                <h3 className="mt-5 text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20">
        <div className="bg-sand-100 px-6 py-14 text-center sm:px-12 sm:py-20">
          <p className="eyebrow mb-4">Bulk &amp; business orders</p>
          <h2 className="mx-auto max-w-2xl text-4xl sm:text-5xl">Planning a bulk order? Let’s talk numbers.</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-ink-muted">Share your requirement and our team will respond with availability, pricing and delivery options.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/wholesale" className="btn-primary">Send bulk enquiry</Link>
            <a href={whatsappLink(c.whatsapp, `Hello ${c.name}, I'd like to place a bulk order enquiry.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  );
}
