import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, QrCode } from 'lucide-react';
import QRCode from 'qrcode.react';

interface SocialLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  icon: React.ReactNode;
  description?: React.ReactNode;
}

export const SocialLinkModal: React.FC<SocialLinkModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  icon,
  description
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-sm bg-ocean-darkest rounded-lg shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-ocean-light hover:text-white transition-colors z-10"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            {/* Header */}
            {!description && (
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 flex items-center justify-center bg-ocean-deep/20 rounded-full">
                  {icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
              </div>
            )}

            {/* Description */}
            {description && (
              <>
                <h2 className="text-2xl font-bold text-white text-center mb-4">{title}</h2>
                {description}
              </>
            )}

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg mb-6 flex items-center justify-center">
              <QRCode 
                value={url}
                size={200}
                level="H"
                includeMargin
                className="w-full max-w-[200px]"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-ocean-deep text-white 
                         rounded-lg hover:bg-ocean-medium transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                Открыть
              </a>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-ocean-light 
                         rounded-lg hover:bg-white/20 transition-colors"
              >
                <QrCode className="h-5 w-5" />
                Сканировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};