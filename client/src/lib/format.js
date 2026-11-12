export const formatDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export const PHONE_RE = /^(\+91[\s-]?|91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;
export const EMAIL_RE = /^\S+@\S+\.\S+$/;
