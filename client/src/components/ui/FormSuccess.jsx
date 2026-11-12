import { CheckCircle2 } from 'lucide-react';

export default function FormSuccess({ title = 'Thank you!', message, onReset, children }) {
  return (
    <div className="border border-paper-line bg-white px-6 py-12 text-center" role="status">
      <CheckCircle2 size={44} strokeWidth={1.25} className="mx-auto mb-4 text-emerald-700" />
      <h3 className="text-3xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {children}
        {onReset && <button className="btn-outline" onClick={onReset}>Send another</button>}
      </div>
    </div>
  );
}
