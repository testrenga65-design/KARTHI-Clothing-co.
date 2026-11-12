export default function Field({ label, error, hint, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}{required && <span className="text-red-700"> *</span>}</label>}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-700" role="alert">{error}</p>}
    </div>
  );
}

/** Hidden honeypot field – humans never see it; bots fill it. */
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} /></label>
    </div>
  );
}
