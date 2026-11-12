import { Link } from 'react-router-dom';
import { Gem, Users, Scale, Sprout } from 'lucide-react';
import Seo from '../components/ui/Seo';
import { PageHeader } from '../components/ui/Section';
import { useSiteConfig } from '../context/SiteConfigContext';

const values = [
  { Icon: Gem, t: 'Quality first', d: 'We choose fabrics and finishing that last, because repeat customers are everything.' },
  { Icon: Users, t: 'Customer satisfaction', d: 'Every enquiry is answered by a real person who understands garments.' },
  { Icon: Scale, t: 'Honest dealings', d: 'Clear pricing, realistic timelines and no surprises — for shoppers and shops alike.' },
  { Icon: Sprout, t: 'Growing together', d: 'We succeed when the retailers we supply grow their own businesses.' },
];

export default function About() {
  const { name } = useSiteConfig();
  return (
    <>
      <Seo title="About Us" description={`Learn about ${name} — a Tamil Nadu garment business serving retail customers and wholesale partners with quality clothing.`} />
      <PageHeader eyebrow="About us" title={`${name}, rooted in Tamil Nadu`}>Everyday clothing, made with care and supplied with integrity to families, shops and businesses.</PageHeader>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-4xl sm:text-5xl">Clothing for the way people actually live</h2>
        </div>
        <div className="space-y-5 leading-relaxed text-ink-soft lg:col-span-7">
          <p>{name} is a garment business serving both individual customers and retailers. We offer a considered range of men’s, women’s and kids’ clothing — comfortable, durable and priced fairly.</p>
          <p>Our approach is simple: choose good fabrics, keep styles versatile, and treat every customer — whether buying a single piece or thousands — with the same attention. We keep our catalogue focused so every product earns its place.</p>
          <p>Because we work directly with retailers, we understand what sells, what lasts and what keeps customers coming back. That experience shapes every collection we put together.</p>
        </div>
      </section>

      <section className="border-y border-paper-line bg-paper-warm">
        <div className="container-x grid gap-px py-0 md:grid-cols-2">
          {[
            { k: 'Retail', t: 'For individual customers', d: 'Browse the collection online, see available sizes and colours, and enquire via WhatsApp or the website. We help you choose the right fit and arrange your purchase.' },
            { k: 'Wholesale', t: 'For retailers & businesses', d: 'Reliable bulk supply for clothing shops, boutiques, institutions and corporate buyers — with mixed size runs, repeat availability and personal support.' },
          ].map((x) => (
            <div key={x.k} className="py-14 md:px-10 md:first:pl-0 md:last:pr-0">
              <p className="eyebrow">{x.k}</p>
              <h3 className="mt-2 text-3xl">{x.t}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="mb-12 text-4xl sm:text-5xl">Our commitment</h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, t, d }) => (
            <div key={t}><Icon strokeWidth={1.25} size={30} className="text-sand-500" /><h3 className="mt-5 text-2xl">{t}</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{d}</p></div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary">View collection</Link>
          <Link to="/contact" className="btn-outline">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
