import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Logo } from './Header';

const svg = (d) => (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>{d}</svg>
);
const Instagram = svg(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></>);
const Facebook = svg(<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />);
const Youtube = svg(<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" /></>);

export default function Footer() {
  const c = useSiteConfig();
  const socials = [
    { href: c.social.instagram, Icon: Instagram, label: 'Instagram' },
    { href: c.social.facebook, Icon: Facebook, label: 'Facebook' },
    { href: c.social.youtube, Icon: Youtube, label: 'YouTube' },
  ].filter((s) => s.href);
  const col = 'mb-4 text-xs font-medium uppercase tracking-wider2 text-sand-300';
  const link = 'text-sm text-paper/70 hover:text-paper';
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">{c.tagline} Quality garments for retail customers and wholesale partners across Tamil Nadu and beyond.</p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center border border-paper/25 hover:bg-paper hover:text-ink"><Icon /></a>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <h4 className={col}>Explore</h4>
          <ul className="space-y-3">
            {[['/products', 'Collection'], ['/wholesale', 'Wholesale'], ['/about', 'About us'], ['/contact', 'Contact']].map(([to, l]) => <li key={to}><Link to={to} className={link}>{l}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className={col}>Shop</h4>
          <ul className="space-y-3">
            {[['mens-wear', "Men's Wear"], ['womens-wear', "Women's Wear"], ['kids-wear', 'Kids Wear'], ['nightwear', 'Nightwear']].map(([s, l]) => <li key={s}><Link to={`/products?category=${s}`} className={link}>{l}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className={col}>Get in touch</h4>
          <ul className="space-y-3 text-sm text-paper/70">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-sand-300" />{c.address}</li>
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-sand-300" /><a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-paper">{c.phone}</a></li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-sand-300" /><a href={`mailto:${c.email}`} className="hover:text-paper">{c.email}</a></li>
            {c.hours && <li className="flex gap-3"><Clock size={16} className="mt-0.5 shrink-0 text-sand-300" />{c.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {c.name} All rights reserved.</span>
          <span>Wholesale &amp; retail garments, Tamil Nadu, India</span>
        </div>
      </div>
    </footer>
  );
}
