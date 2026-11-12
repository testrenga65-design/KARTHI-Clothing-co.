export function whatsappLink(number, text) {
  const n = String(number || '').replace(/\D/g, '');
  if (!n) return '#';
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function productEnquiryMessage(product, business, { interest } = {}) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.slug}` : '';
  return [
    `Hello ${business?.name || ''}, I'm interested in this product:`,
    '',
    `*${product.name}*`,
    `Code: ${product.sku}`,
    interest ? `Enquiry type: ${interest === 'wholesale' ? 'Wholesale / bulk' : 'Retail'}` : null,
    url,
    '',
    'Please share availability and pricing details.',
  ]
    .filter((l) => l !== null)
    .join('\n');
}
