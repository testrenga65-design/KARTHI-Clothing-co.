import { AlertTriangle, PackageSearch, Loader2 } from 'lucide-react';

export function Spinner({ className = '' }) {
  return <Loader2 className={`animate-spin ${className}`} size={20} aria-label="Loading" />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-ink-muted">
      <Spinner />
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, action, icon: Icon = PackageSearch }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <Icon size={36} strokeWidth={1.25} className="mb-4 text-sand-400" />
      <h3 className="text-2xl">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm text-ink-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <AlertTriangle size={36} strokeWidth={1.25} className="mb-4 text-red-700" />
      <h3 className="text-2xl">Something went wrong</h3>
      <p className="mt-2 max-w-md text-sm text-ink-muted">{error?.message || 'Please try again.'}</p>
      {onRetry && <button className="btn-outline mt-6" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-paper-warm ${className}`} />;
}
