import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function SectionHeading({ eyebrow, title, to, linkLabel = 'View all', center }) {
  return (
    <div className={`mb-10 flex flex-wrap items-end justify-between gap-4 ${center ? 'justify-center text-center' : ''}`}>
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-4xl sm:text-5xl">{title}</h2>
      </div>
      {to && <Link to={to} className="group flex items-center gap-2 border-b border-ink pb-1 text-sm">{linkLabel}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="border-b border-paper-line bg-paper-warm">
      <div className="container-x py-14 sm:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-5xl sm:text-6xl">{title}</h1>
        {children && <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">{children}</p>}
      </div>
    </div>
  );
}
