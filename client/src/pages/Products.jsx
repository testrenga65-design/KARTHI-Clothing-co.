import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import Seo from '../components/ui/Seo';
import { PageHeader } from '../components/ui/Section';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/ui/Pagination';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useAsync, useDebounced } from '../lib/useAsync';
import { getCategories, getProducts } from '../lib/data';

const PAGE_SIZE = 8;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const page = Number(params.get('page')) || 1;
  const sort = params.get('sort') || 'newest';
  const urlSearch = params.get('q') || '';
  const [search, setSearch] = useState(urlSearch);
  const debounced = useDebounced(search);
  const [showCats, setShowCats] = useState(false);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: true });
  };

  useEffect(() => { if (debounced !== urlSearch) update({ q: debounced }); /* eslint-disable-next-line */ }, [debounced]);

  const cats = useAsync(() => getCategories(), []);
  const list = useAsync(() => getProducts({ category, search: urlSearch, page, sort, limit: PAGE_SIZE }), [category, urlSearch, page, sort]);
  const active = cats.data?.find((c) => c.slug === category);

  const chip = (isActive) => `shrink-0 border px-4 py-2 text-sm transition-colors ${isActive ? 'border-ink bg-ink text-paper' : 'border-paper-line bg-white hover:border-ink'}`;

  return (
    <>
      <Seo title={active ? active.name : 'Collection'} description={active?.description || 'Browse our full range of men’s, women’s and kids garments. Enquire for retail or wholesale pricing.'} />
      <PageHeader eyebrow="Collection" title={active ? active.name : 'All products'}>
        {active?.description || 'Explore our range and enquire for availability, sizes and wholesale pricing. Prices are shared on enquiry.'}
      </PageHeader>

      <div className="container-x py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, code or type…" aria-label="Search products" className="input pl-11 pr-10" />
            {search && <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"><X size={16} /></button>}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-outline btn-sm lg:hidden" onClick={() => setShowCats((s) => !s)} aria-expanded={showCats}><SlidersHorizontal size={14} /> Categories</button>
            <label className="flex items-center gap-2 text-sm text-ink-muted">Sort
              <select value={sort} onChange={(e) => update({ sort: e.target.value === 'newest' ? '' : e.target.value })} className="input !w-auto !py-2">
                <option value="newest">Newest</option><option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>

        <div className={`mb-10 flex-wrap gap-2 ${showCats ? 'flex' : 'hidden lg:flex'}`} role="group" aria-label="Filter by category">
          <button className={chip(!category)} onClick={() => update({ category: '' })}>All</button>
          {cats.data?.map((c) => <button key={c._id} className={chip(category === c.slug)} onClick={() => update({ category: c.slug })} aria-pressed={category === c.slug}>{c.name} <span className="opacity-60">({c.productCount})</span></button>)}
        </div>

        {list.error ? <ErrorState error={list.error} onRetry={list.reload} /> : !list.loading && list.data.items.length === 0 ? (
          <EmptyState title="No products found" message="Try a different search or category — or tell us what you’re looking for and we’ll help." action={<button className="btn-outline" onClick={() => { setSearch(''); setParams({}, { replace: true }); }}>Clear filters</button>} />
        ) : (
          <>
            {!list.loading && <p className="mb-6 text-sm text-ink-muted" aria-live="polite">{list.data.total} {list.data.total === 1 ? 'product' : 'products'}</p>}
            <ProductGrid products={list.data?.items ?? []} loading={list.loading} skeletons={PAGE_SIZE} />
            {list.data && <Pagination page={list.data.page} pages={list.data.pages} onChange={(p) => { update({ page: p > 1 ? String(p) : '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
          </>
        )}
      </div>
    </>
  );
}
