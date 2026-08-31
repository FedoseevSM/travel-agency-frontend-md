import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageChangeModal } from '@/components/modals/LanguageChangeModal';
import { detectUserLanguage } from '@/lib/language';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initLanguage = async () => {
      const detectedLanguage = await detectUserLanguage();
      if (i18n.language !== detectedLanguage) {
        i18n.changeLanguage(detectedLanguage);
        setIsModalOpen(true);
      }
    };

    initLanguage();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
  };

  return (
    <>
      <div className="flex items-center space-x-2 text-sm">
        <button 
          onClick={() => {
            changeLanguage('ru');
            setIsModalOpen(true);
          }}
          className={`px-2 py-1 font-medium transition-colors ${
            i18n.language === 'ru' 
              ? 'text-ocean-lightest' 
              : 'text-ocean-light hover:text-ocean-lightest'
          }`}
        >
          RU
        </button>
        <span className="text-ocean-medium">|</span>
        <button 
          onClick={() => {
            changeLanguage('en');
            setIsModalOpen(true);
          }}
          className={`px-2 py-1 font-medium transition-colors ${
            i18n.language === 'en' 
              ? 'text-ocean-lightest' 
              : 'text-ocean-light hover:text-ocean-lightest'
          }`}
        >
          EN
        </button>
      </div>

      <LanguageChangeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLanguage={i18n.language}
      />
    </>
  );
};