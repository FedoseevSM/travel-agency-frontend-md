import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { SocialLinks } from './SocialLinks';
import { RequestButton } from './RequestButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-teal-900/95 backdrop-blur-sm z-50">
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-white p-2">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex flex-col items-center justify-center flex-1 space-y-8">
          <Link 
            to="/services" 
            className="text-xl font-medium text-white hover:text-teal-200"
            onClick={onClose}
          >
            Наши Услуги
          </Link>
          <Link 
            to="/about" 
            className="text-xl font-medium text-white hover:text-teal-200"
            onClick={onClose}
          >
            О нас
          </Link>
          <Link 
            to="/blog" 
            className="text-xl font-medium text-white hover:text-teal-200"
            onClick={onClose}
          >
            Блог
          </Link>
          <Link 
            to="/contacts" 
            className="text-xl font-medium text-white hover:text-teal-200"
            onClick={onClose}
          >
            Контакты
          </Link>
          
          <div className="pt-8">
            <RequestButton />
          </div>
          
          <div className="pt-4">
            <SocialLinks />
          </div>
        </nav>
      </div>
    </div>
  );
};