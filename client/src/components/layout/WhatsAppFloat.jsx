import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { whatsappLink } from '../../lib/whatsapp';

export default function WhatsAppFloat() {
  const { whatsapp, name } = useSiteConfig();
  return (
    <a
      href={whatsappLink(whatsapp, `Hello ${name}, I'd like to know more about your products.`)}
      target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-[#1f8f4e] px-4 text-white shadow-lg transition-colors hover:bg-[#187a42] sm:px-5"
    >
      <MessageCircle size={22} /><span className="hidden text-sm font-medium sm:inline">Chat with us</span>
    </a>
  );
}
