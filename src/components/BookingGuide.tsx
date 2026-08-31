import React, { useState } from 'react';
import { Search, Calendar, MessageCircle, CreditCard, MapPin, ArrowRight } from 'lucide-react';
import { ContactFormModal } from '@/components/modals/ContactFormModal';
import { useTranslation } from 'react-i18next';

export const BookingGuide = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const steps = [
    {
      icon: Search,
      title: t('home.booking.steps.search.title'),
      description: t('home.booking.steps.search.description'),
      details: t('home.booking.steps.search.details')
    },
    {
      icon: MessageCircle,
      title: t('home.booking.steps.contact.title'),
      description: t('home.booking.steps.contact.description'),
      details: t('home.booking.steps.contact.details')
    },
    {
      icon: Calendar,
      title: t('home.booking.steps.date.title'),
      description: t('home.booking.steps.date.description'),
      details: t('home.booking.steps.date.details')
    },
    {
      icon: MapPin,
      title: t('home.booking.steps.info.title'),
      description: t('home.booking.steps.info.description'),
      details: t('home.booking.steps.info.details')
    },
    {
      icon: CreditCard,
      title: t('home.booking.steps.payment.title'),
      description: t('home.booking.steps.payment.description'),
      details: t('home.booking.steps.payment.details')
    }
  ];

  const handleStepHover = (index: number) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveStep(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <>
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-darker/95 to-ocean-darkest/90" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.booking.title')}
          </h2>
          <p className="text-xl text-ocean-light max-w-3xl mx-auto">
            {t('home.booking.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => handleStepHover(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`absolute -top-4 -left-4 w-8 h-8 flex items-center justify-center
                           text-5xl transition-all duration-300 z-10 ${
                             activeStep === index 
                               ? 'text-white scale-110' 
                               : 'bg-ocean-deep/20 text-ocean-light'
                           }`}>
                {index + 1}
              </div>
              
              <div className={`cursor-pointer relative bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-300
                           hover:bg-white/20 ${
                             activeStep === index 
                               ? 'transform scale-105 shadow-lg shadow-ocean-deep/20' 
                               : ''
                           }`}
                    onClick={() => setIsModalOpen(true)}
                >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4
                               transition-all duration-300 ${
                                 activeStep === index 
                                   ? 'bg-ocean-deep' 
                                   : 'bg-ocean-deep/20'
                               }`}>
                    <step.icon className={`w-8 h-8 transition-all duration-300 ${
                      activeStep === index ? 'text-white' : 'text-ocean-light'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-ocean-light text-sm mb-4">
                    {step.description}
                  </p>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    activeStep === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-xs text-ocean-lighter mt-2 px-2 py-3 bg-ocean-deep/10 rounded-lg">
                      {step.details}
                    </p>
                  </div>
                </div>

                <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
                  activeStep === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ArrowRight className="w-4 h-4 text-ocean-light animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-ocean-light text-lg mb-6">
            {t('home.booking.contact.subtitle')}
          </p>
          <button
            onClick={() => document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center justify-center px-6 py-3 bg-ocean-deep text-white 
                     font-semibold rounded-lg hover:bg-ocean-medium transition-all duration-300
                     hover:shadow-lg hover:shadow-ocean-deep/20 hover:-translate-y-0.5"
          >
            <span>{t('home.booking.contact.button')}</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
    {isModalOpen && (
        <ContactFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
  </>
  );
};