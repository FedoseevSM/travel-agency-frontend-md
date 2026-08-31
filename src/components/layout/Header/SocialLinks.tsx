import React, { useState } from 'react';
import { Phone, Instagram, MessageSquare } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { SocialLinkModal } from '@/components/modals/SocialLinkModal';

interface SocialLink {
  href: string;
  icon: React.ElementType;
  label: string;
  showQR?: boolean;
}

const socialLinks: SocialLink[] = [
  { href: 'tel:+66816690960', icon: Phone, label: 'Телефон' },
  { 
    href: 'https://t.me/thai_guru', 
    icon: FaTelegramPlane, 
    label: 'Telegram',
    showQR: true 
  },
  { 
    href: 'https://wa.me/66816690960', 
    icon: FaWhatsapp, 
    label: 'WhatsApp',
    showQR: true 
  },
  { 
    href: 'https://instagram.com/thaiguru_phuket', 
    icon: Instagram,
    label: 'Instagram',
    showQR: true 
  }
];

interface SocialLinksProps {
  isMobile?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ isMobile = false }) => {
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);

  const handleLinkClick = (link: SocialLink) => {
    if (link.showQR) {
      setSelectedLink(link);
    } else {
      window.location.href = link.href;
    }
  };

  return (
    <>
      <div className={`${isMobile ? 'flex' : 'hidden md:flex'} items-center ${isMobile ? 'gap-6' : 'space-x-4'}`}>
        {socialLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => handleLinkClick(link)}
            className={`text-ocean-light hover:text-ocean-lightest transition-colors ${
              isMobile ? 'p-2 hover:bg-white/10 rounded-lg' : ''
            }`}
            aria-label={link.label}
          >
            <link.icon className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5'}`} />
          </button>
        ))}
      </div>

      {selectedLink && (
        <SocialLinkModal
          isOpen={!!selectedLink}
          onClose={() => setSelectedLink(null)}
          url={selectedLink.href}
          title={selectedLink.label}
          icon={<selectedLink.icon className="h-6 w-6 text-ocean-light" />}
        />
      )}
    </>
  );
};