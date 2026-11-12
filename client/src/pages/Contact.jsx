import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import Seo from '../components/ui/Seo';
import { PageHeader } from '../components/ui/Section';
import Field, { Honeypot } from '../components/ui/Field';
import FormSuccess from '../components/ui/FormSuccess';
import { useForm } from '../lib/useForm';
import { submitEnquiry } from '../lib/data';
import { clean, emailRule, phoneRule, required } from '../lib/validators';
import { useSiteConfig } from '../context/SiteConfigContext';
import { whatsappLink } from '../lib/whatsapp';

export default function Contact() {
  const c = useSiteConfig();
  const form = useForm(
    { name: '', phone: '', email: '', message: '', website: '' },
    (v) => clean({ name: required(v.name, 'Name is required'), phone: phoneRule(v.phone), email: emailRule(v.email), message: !v.message.trim() ? 'Please write a message' : v.message.trim().length < 5 ? 'Please write a little more' : undefined }),
    (v) => submitEnquiry('contact', v)
  );
  const { values, errors, set } = form;
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;
  const items = [
    { Icon: Phone, label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s/g, '')}` },
    { Icon: MessageCircle, label: 'WhatsApp', value: `+${c.whatsapp}`, href: whatsappLink(c.whatsapp, `Hello ${c.name}!`) },
    { Icon: Mail, label: 'Email', value: c.email, href: `mailto:${c.email}` },
    { Icon: MapPin, label: 'Address', value: c.address },
    { Icon: Clock, label: 'Hours', value: c.hours },
  ].filter((i) => i.value);

  return (
    <>
      <Seo title="Contact Us" description={`Contact ${c.name} by phone, WhatsApp, email or the enquiry form for retail and wholesale queries.`} />
      <PageHeader eyebrow="Contact" title="We’d love to hear from you">Questions about products, availability or bulk pricing? Reach out and our team will respond promptly.</PageHeader>

      <div className="container-x grid gap-14 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ul className="space-y-6">
            {items.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-paper-line bg-white"><Icon size={18} strokeWidth={1.5} /></span>
                <div>
                  <p className="eyebrow">{label}</p>
                  {href ? <a href={href} target={label === 'WhatsApp' ? '_blank' : undefined} rel="noopener noreferrer" className="mt-0.5 block hover:underline">{value}</a> : <p className="mt-0.5">{value}</p>}
                </div>
              </li>
            ))}
          </ul>

          <div className="relative mt-10 aspect-[4/3] min-h-[280px] overflow-hidden border border-paper-line bg-paper-warm">
            {c.mapEmbedUrl ? (
              <iframe title={`${c.name} location`} src={c.mapEmbedUrl} className="absolute inset-0 block h-full w-full border-0" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-ink-muted">
                <MapPin size={32} strokeWidth={1.25} className="mb-3 text-sand-400" />
                <p className="text-sm font-medium text-ink">Google Maps placeholder</p>
                <p className="mt-1 max-w-xs text-xs">Add your embed link as <code>VITE_BUSINESS_MAP_EMBED_URL</code> in <code>client/.env</code> to show the map here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          {form.done ? (
            <FormSuccess message="Thank you! We have received your message and will get back to you shortly." onReset={() => form.setDone(false)} />
          ) : (
            <form onSubmit={form.handleSubmit} noValidate className="relative card space-y-5 p-6 sm:p-10">
              <h2 className="text-3xl">Send us a message</h2>
              <Honeypot value={values.website} onChange={set('website')} />
              <Field label="Your name" required error={errors.name}><input className={cls('name')} value={values.name} onChange={set('name')} autoComplete="name" /></Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Mobile number" required error={errors.phone}><input type="tel" inputMode="tel" className={cls('phone')} value={values.phone} onChange={set('phone')} placeholder="98765 43210" autoComplete="tel" /></Field>
                <Field label="Email" error={errors.email}><input type="email" className={cls('email')} value={values.email} onChange={set('email')} autoComplete="email" /></Field>
              </div>
              <Field label="Message" required error={errors.message}><textarea rows={6} className={cls('message')} value={values.message} onChange={set('message')} /></Field>
              {form.formError && <p className="text-sm text-red-700" role="alert">{form.formError}</p>}
              <button className="btn-primary w-full sm:w-auto" disabled={form.submitting}>{form.submitting ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
