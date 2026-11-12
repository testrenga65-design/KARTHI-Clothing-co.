import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
  const items = nums.reduce((acc, n, i) => (i && n - nums[i - 1] > 1 ? [...acc, '…', n] : [...acc, n]), []);
  const base = 'flex h-10 min-w-10 items-center justify-center border px-3 text-sm';
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button className={`${base} border-paper-line bg-white disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {items.map((n, i) =>
        n === '…' ? <span key={`e${i}`} className="px-1 text-ink-muted">…</span> : (
          <button key={n} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className={`${base} ${n === page ? 'border-ink bg-ink text-paper' : 'border-paper-line bg-white hover:border-ink'}`}>{n}</button>
        )
      )}
      <button className={`${base} border-paper-line bg-white disabled:opacity-40`} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  );
}
