import { EMAIL_RE, PHONE_RE } from './format';

export const required = (v, msg) => (!String(v ?? '').trim() ? msg : undefined);
export const phoneRule = (v) => (!String(v || '').trim() ? 'Mobile number is required' : PHONE_RE.test(v.trim()) ? undefined : 'Enter a valid 10-digit Indian mobile number');
export const emailRule = (v, req = false) => (!String(v || '').trim() ? (req ? 'Email is required' : undefined) : EMAIL_RE.test(v.trim()) ? undefined : 'Enter a valid email address');
export const clean = (errs) => Object.fromEntries(Object.entries(errs).filter(([, v]) => v));
