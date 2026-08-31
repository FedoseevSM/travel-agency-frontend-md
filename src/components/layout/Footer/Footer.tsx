import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import ActivatedModal from "../../ActivatedModal"

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 15000); // 15 seconds
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
  return (
    <footer className="bg-ocean-darkest/80 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">THAI GURU</h3>
            <p className="text-ocean-light text-sm">
              {t('footer.company.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.navigation.title')}</h3>
            <div className="space-y-2">
              <Link to="/services" className="block text-ocean-light hover:text-white text-sm transition-colors">
                {t('footer.navigation.services')}
              </Link>
              <Link to="/about" className="block text-ocean-light hover:text-white text-sm transition-colors">
                {t('footer.navigation.about')}
              </Link>
              <Link to="/blog" className="block text-ocean-light hover:text-white text-sm transition-colors">
                {t('footer.navigation.blog')}
              </Link>
              <Link to="/contacts" className="block text-ocean-light hover:text-white text-sm transition-colors">
                {t('footer.navigation.contacts')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contacts.title')}</h3>
            <div className="space-y-2">
              <a 
                href="https://t.me/thai_guru" 
                className="flex items-center text-ocean-light hover:text-white text-sm transition-colors"
              >
                <FaTelegramPlane className="h-4 w-4 mr-2" />
                <span>@thai_guru</span>
              </a>
              <a 
                href="https://wa.me/66816690960" 
                className="flex items-center text-ocean-light hover:text-white text-sm transition-colors"
              >
                <FaWhatsapp className="h-4 w-4 mr-2" />
                <span>+66 81 669 0960</span>
              </a>
              <div className="flex items-center text-ocean-light text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{t('footer.contacts.location')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-ocean-light text-sm text-center">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
      {showModal && <ActivatedModal onClose={handleCloseModal} />}
    </footer>
  );
};