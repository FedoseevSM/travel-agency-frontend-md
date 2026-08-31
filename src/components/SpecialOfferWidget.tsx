import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SocialLinkModal } from './modals/SocialLinkModal';

export const SpecialOfferWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const consultantInfo = {
    name: 'Анна',
    role: 'Персональный консультант',
    experience: '5 лет опыта',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    whatsappUrl: `https://wa.me/${import.meta.env.VITE_WA_PHONE_NUMBER}`
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 max-w-sm hidden md:block">
        <div className="relative">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center bg-ocean-deep/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-ocean-deep 
                     transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={consultantInfo.avatar}
                alt={consultantInfo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-ocean-deep to-transparent" />
            </div>
            
            <div className="p-4 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium">{consultantInfo.name}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm text-ocean-lighter">
                Получите персональную консультацию
              </p>
            </div>

            <div className="pr-4 pl-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </button>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-ocean-deep rounded-full flex items-center justify-center
                     hover:bg-ocean-medium transition-colors shadow-lg"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <SocialLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={consultantInfo.whatsappUrl}
        title="Свяжитесь с консультантом"
        icon={<MessageCircle className="h-6 w-6 text-ocean-light" />}
        description={
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
              <img
                src={consultantInfo.avatar}
                alt={consultantInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{consultantInfo.name}</h3>
            <p className="text-ocean-light">{consultantInfo.role}</p>
            <p className="text-sm text-ocean-lighter mt-2">{consultantInfo.experience}</p>
          </div>
        }
      />
    </>
  );
};