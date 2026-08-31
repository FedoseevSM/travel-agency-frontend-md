import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SocialLinks } from './SocialLinks';
import { RequestButton } from './RequestButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-teal-900 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button 
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label={t('header.mobileMenu.close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-6 pb-6 bg-teal-900/95">
            <div className="space-y-6">
              <MobileMenuItem to="/services" onClick={onClose}>
                {t('header.services')}
              </MobileMenuItem>
              <MobileMenuItem to="/about" onClick={onClose}>
                {t('header.about')}
              </MobileMenuItem>
              <MobileMenuItem to="/blog" onClick={onClose}>
                {t('header.blog')}
              </MobileMenuItem>
              <MobileMenuItem to="/contacts" onClick={onClose}>
                {t('header.contacts')}
              </MobileMenuItem>
            </div>
            
            <div className="mt-8">
              <RequestButton />
            </div>
            
            <div className="mt-8 flex justify-center">
              <LanguageSwitcher />
            </div>
            
            {/* Social Links for Mobile */}
            <div className="mt-8">
              <h3 className="text-ocean-light text-sm font-medium mb-4 px-2">
                {t('header.mobileMenu.contactUs')}
              </h3>
              <div className="flex justify-center gap-6">
                <SocialLinks isMobile />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

interface MobileMenuItemProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-xl font-medium text-white hover:text-teal-200 transition-colors"
  >
    {children}
  </Link>
);