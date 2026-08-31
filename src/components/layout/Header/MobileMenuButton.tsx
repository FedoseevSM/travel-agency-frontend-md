import React from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  
  return (
    <button 
      onClick={onClick}
      className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
      aria-label={t('header.mobileMenu.open')}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
};