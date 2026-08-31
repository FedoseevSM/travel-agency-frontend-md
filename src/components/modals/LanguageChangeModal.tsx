import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
}

export const LanguageChangeModal: React.FC<LanguageChangeModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage
}) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' }
  ];

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md bg-ocean-darkest rounded-lg shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-ocean-light hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-ocean-light" />
              <h2 className="text-2xl font-bold text-white">
                {t('language.modal.title')}
              </h2>
            </div>

            <p className="text-ocean-light mb-6">
              {t('language.modal.description')}
            </p>

            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-ocean-deep text-white'
                      : 'bg-white/10 text-ocean-light hover:bg-white/20'
                  }`}
                >
                  <span>{lang.name}</span>
                  {selectedLanguage === lang.code && (
                    <Check className="h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};