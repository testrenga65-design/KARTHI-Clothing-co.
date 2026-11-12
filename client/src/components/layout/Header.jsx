import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Collection' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Logo({ light = false }) {
  const { name } = useSiteConfig();
  const [first, ...rest] = name.split(' ');
  return (
    <Link to="/" className={`flex flex-col leading-none ${light ? 'text-paper' : 'text-ink'}`} aria-label={`${name} home`}>
      <span className="font-serif text-2xl font-semibold tracking-wide">{first.toUpperCase()}</span>
      <span className={`mt-1 text-[10px] uppercase tracking-[0.32em] ${light ? 'text-sand-300' : 'text-ink-muted'}`}>{rest.join(' ')}</span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { phone } = useSiteConfig();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const linkCls = ({ isActive }) => `text-sm tracking-wide transition-colors ${isActive ? 'text-ink border-b border-ink pb-1' : 'text-ink-muted hover:text-ink pb-1 border-b border-transparent'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-paper/95 backdrop-blur">
      <div className="hidden bg-ink text-paper md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs tracking-wide">
          <span className="text-sand-300">Wholesale &amp; retail garments · Tamil Nadu, India</span>
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-sand-200"><Phone size={12} /> {phone}</a>
        </div>
      </div>
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
        </nav>
        <Link to="/wholesale" className="btn-primary btn-sm hidden md:inline-flex">Bulk enquiry</Link>
        <button className="p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={24} /></button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="container-x flex h-[72px] items-center justify-between border-b border-paper-line">
            <Logo />
            <button className="p-2" onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button>
          </div>
          <nav className="container-x flex flex-1 flex-col gap-1 py-8">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `border-b border-paper-line py-4 font-serif text-3xl ${isActive ? 'text-ink' : 'text-ink-muted'}`}>{l.label}</NavLink>
            ))}
            <Link to="/wholesale" className="btn-primary mt-8">Bulk order enquiry</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
