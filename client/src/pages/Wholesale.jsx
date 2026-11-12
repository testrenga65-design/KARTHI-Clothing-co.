import { MessageCircle, BadgePercent, PackageCheck, Truck, Headset } from 'lucide-react';
import Seo from '../components/ui/Seo';
import { PageHeader } from '../components/ui/Section';
import Field, { Honeypot } from '../components/ui/Field';
import FormSuccess from '../components/ui/FormSuccess';
import { useAsync } from '../lib/useAsync';
import { useForm } from '../lib/useForm';
import { getCategories, submitEnquiry } from '../lib/data';
import { clean, emailRule, phoneRule, required } from '../lib/validators';
import { useSiteConfig } from '../context/SiteConfigContext';
import { whatsappLink } from '../lib/whatsapp';

const benefits = [
  { Icon: BadgePercent, t: 'Wholesale pricing', d: 'Tiered rates that improve with quantity.' },
  { Icon: PackageCheck, t: 'Assorted size runs', d: 'Mix sizes and colours within an order.' },
  { Icon: Truck, t: 'Dependable delivery', d: 'Clear lead times and repeat supply.' },
  { Icon: Headset, t: 'Personal support', d: 'Talk directly to our team on call or WhatsApp.' },
];

const initial = { businessName: '', phone: '', email: '', location: '', category: '', quantity: '', requirements: '', website: '' };

export default function Wholesale() {
  const c = useSiteConfig();
  const cats = useAsync(() => getCategories(), []);
  const form = useForm(
    initial,
    (v) => clean({
      businessName: required(v.businessName, 'Customer / business name is required'),
      phone: phoneRule(v.phone),
      email: emailRule(v.email, true),
      location: required(v.location, 'Business location is required'),
      category: required(v.category, 'Select a product category'),
      quantity: !String(v.quantity).trim() ? 'Enter an approximate quantity' : !/^\d+$/.test(v.quantity) || Number(v.quantity) < 1 ? 'Enter a whole number, 1 or more' : undefined,
    }),
    (v) => submitEnquiry('wholesale', { ...v, quantity: Number(v.quantity) })
  );
  const { values, errors, set } = form;
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <>
      <Seo title="Wholesale & Bulk Orders" description={`Wholesale garment supply for retailers and businesses in Tamil Nadu. Send your requirement to ${c.name} and get a tailored quote.`} />
      <PageHeader eyebrow="Wholesale" title="Stock your store with confidence">Retailers, boutiques and businesses — tell us what you need and we’ll come back with availability, pricing and delivery details.</PageHeader>

      <div className="container-x grid gap-14 py-14 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <h2 className="text-3xl">Why buy wholesale from us</h2>
          <ul className="mt-8 space-y-6">
            {benefits.map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <Icon strokeWidth={1.25} size={26} className="mt-0.5 shrink-0 text-sand-500" />
                <div><h3 className="text-xl">{t}</h3><p className="text-sm text-ink-muted">{d}</p></div>
              </li>
            ))}
          </ul>
          <div className="mt-10 border border-paper-line bg-paper-warm p-6">
            <p className="text-sm text-ink-soft">Prefer to talk? Message us directly and we’ll respond quickly.</p>
            <a href={whatsappLink(c.whatsapp, `Hello ${c.name}, I'm a retailer interested in wholesale supply.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-4 w-full"><MessageCircle size={18} /> Chat on WhatsApp</a>
            <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="mt-3 block text-center text-sm underline underline-offset-4">or call {c.phone}</a>
          </div>
        </aside>

        <div className="lg:col-span-8">
          {form.done ? (
            <FormSuccess message="Your wholesale enquiry has been received. Our team will contact you soon with pricing and details." onReset={() => form.setDone(false)}>
              <a href={whatsappLink(c.whatsapp, `Hello ${c.name}, I just submitted a wholesale enquiry on your website.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><MessageCircle size={18} /> Message us on WhatsApp</a>
            </FormSuccess>
          ) : (
            <form onSubmit={form.handleSubmit} noValidate className="relative card space-y-5 p-6 sm:p-10">
              <h2 className="text-3xl">Wholesale enquiry</h2>
              <Honeypot value={values.website} onChange={set('website')} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Customer / business name" required error={errors.businessName}><input className={cls('businessName')} value={values.businessName} onChange={set('businessName')} autoComplete="organization" /></Field>
                <Field label="Mobile number" required error={errors.phone}><input type="tel" inputMode="tel" className={cls('phone')} value={values.phone} onChange={set('phone')} placeholder="98765 43210" autoComplete="tel" /></Field>
                <Field label="Email" required error={errors.email}><input type="email" className={cls('email')} value={values.email} onChange={set('email')} autoComplete="email" /></Field>
                <Field label="Business location" required error={errors.location}><input className={cls('location')} value={values.location} onChange={set('location')} placeholder="City, District" /></Field>
                <Field label="Product category" required error={errors.category}>
                  <select className={cls('category')} value={values.category} onChange={set('category')}>
                    <option value="">Select a category</option>
                    {cats.data?.map((x) => <option key={x._id} value={x.name}>{x.name}</option>)}
                    <option value="Multiple / Other">Multiple / Other</option>
                  </select>
                </Field>
                <Field label="Approximate quantity (pieces)" required error={errors.quantity}><input inputMode="numeric" className={cls('quantity')} value={values.quantity} onChange={set('quantity')} placeholder="e.g. 300" /></Field>
              </div>
              <Field label="Additional requirements" hint="Sizes, colours, fabric, delivery location, timeline…"><textarea rows={5} className="input" value={values.requirements} onChange={set('requirements')} /></Field>
              {form.formError && <p className="text-sm text-red-700" role="alert">{form.formError}</p>}
              <button className="btn-primary w-full sm:w-auto" disabled={form.submitting}>{form.submitting ? 'Submitting…' : 'Submit enquiry'}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
