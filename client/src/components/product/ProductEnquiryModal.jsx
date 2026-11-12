import { useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import Field, { Honeypot } from '../ui/Field';
import FormSuccess from '../ui/FormSuccess';
import { useForm } from '../../lib/useForm';
import { clean, emailRule, phoneRule, required } from '../../lib/validators';
import { submitEnquiry } from '../../lib/data';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { productEnquiryMessage, whatsappLink } from '../../lib/whatsapp';

export default function ProductEnquiryModal({ product, defaultInterest = 'retail', onClose }) {
  const business = useSiteConfig();
  const form = useForm(
    { name: '', phone: '', email: '', interest: defaultInterest, message: `I'd like to know more about ${product.name} (${product.sku}).`, website: '' },
    (v) => clean({ name: required(v.name, 'Name is required'), phone: phoneRule(v.phone), email: emailRule(v.email), message: required(v.message, 'Please write a short message') }),
    (v) => submitEnquiry('product', { ...v, productId: product._id, productName: product.name, sku: product.sku })
  );

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const { values, errors, set } = form;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="enq-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-paper p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Product enquiry</p>
            <h2 id="enq-title" className="mt-1 text-3xl">{product.name}</h2>
            <p className="mt-1 text-xs text-ink-muted">Code: {product.sku}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1"><X size={22} /></button>
        </div>

        {form.done ? (
          <FormSuccess message="Enquiry sent! Our team will contact you shortly with availability and pricing.">
            <button className="btn-primary" onClick={onClose}>Close</button>
          </FormSuccess>
        ) : (
          <form onSubmit={form.handleSubmit} noValidate className="relative space-y-4">
            <Honeypot value={values.website} onChange={set('website')} />
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Enquiry type">
              {[['retail', 'Retail'], ['wholesale', 'Wholesale / Bulk']].map(([val, label]) => (
                <label key={val} className={`cursor-pointer border px-4 py-3 text-center text-sm ${values.interest === val ? 'border-ink bg-ink text-paper' : 'border-paper-line bg-white hover:border-ink'}`}>
                  <input type="radio" name="interest" value={val} checked={values.interest === val} onChange={set('interest')} className="sr-only" />{label}
                </label>
              ))}
            </div>
            <Field label="Your name" required error={errors.name}><input className={`input ${errors.name ? 'input-error' : ''}`} value={values.name} onChange={set('name')} autoComplete="name" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile number" required error={errors.phone}><input type="tel" inputMode="tel" className={`input ${errors.phone ? 'input-error' : ''}`} value={values.phone} onChange={set('phone')} autoComplete="tel" placeholder="98765 43210" /></Field>
              <Field label="Email" error={errors.email}><input type="email" className={`input ${errors.email ? 'input-error' : ''}`} value={values.email} onChange={set('email')} autoComplete="email" /></Field>
            </div>
            <Field label="Message" required error={errors.message}><textarea rows={4} className={`input ${errors.message ? 'input-error' : ''}`} value={values.message} onChange={set('message')} /></Field>
            {form.formError && <p className="text-sm text-red-700" role="alert">{form.formError}</p>}
            <button type="submit" className="btn-primary w-full" disabled={form.submitting}>{form.submitting ? 'Sending…' : 'Send enquiry'}</button>
            <a href={whatsappLink(business.whatsapp, productEnquiryMessage(product, business, { interest: values.interest }))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full"><MessageCircle size={18} /> Or enquire on WhatsApp</a>
          </form>
        )}
      </div>
    </div>
  );
}
