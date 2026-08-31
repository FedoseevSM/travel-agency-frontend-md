import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactFormModal } from '@/components/modals/ContactFormModal';

export const RequestButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="relative px-6 py-2.5 bg-ocean-deep text-white font-semibold rounded-lg overflow-hidden group"
      >
        <span className="relative z-10">{t('header.requestButton')}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-medium to-ocean-deep opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 bg-ocean-medium origin-left transition-transform duration-300 ease-out" />
      </button>

      {isModalOpen && (
        <ContactFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};