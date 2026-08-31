import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ContactForm } from '@/components/ContactForm';
import { BookingGuide } from '@/components/BookingGuide';
import { FAQ } from '@/components/FAQ';
import { SpecialOfferWidget } from '@/components/SpecialOfferWidget';

// Lazy load components
const WeatherWidget = React.lazy(() => import('@/components/weather/WeatherWidget').then(m => ({ default: m.WeatherWidget })));
const ServicesSection = React.lazy(() => import('@/components/services/ServicesSection').then(m => ({ default: m.ServicesSection })));

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Suspense fallback={null}>
        <WeatherWidget />
      </Suspense>
      <div className="relative min-h-[100dvh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=80"
            alt="Phuket"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-ocean-darkest/40 to-ocean-darker/60" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-bg-primary to-transparent" />
        </div>

        <div className="relative min-h-[100dvh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0">
            <div className="w-full md:max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 [text-shadow:_0_1px_12px_rgb(0_0_0_/_20%)]">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg sm:text-xl text-ocean-lighter mb-6 md:mb-8 [text-shadow:_0_1px_8px_rgb(0_0_0_/_20%)]">
                {t('home.hero.subtitle')}
              </p>
              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-text-primary text-bg-primary hover:bg-text-secondary transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {t('home.hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Suspense fallback={null}>
        <ServicesSection className="bg-bg-alt/50 backdrop-blur-sm" />
      </Suspense>

      <BookingGuide />

      <FAQ />

      <div id="contact-form">
        <ContactForm />
      </div>

      <SpecialOfferWidget />
    </>
  );
};

export default Home;