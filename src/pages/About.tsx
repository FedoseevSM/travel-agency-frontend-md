import React from 'react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground height="30vh" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('about.title')}
            </h1>
            <p className="text-ocean-light text-lg mb-12">
              {t('about.subtitle')}
            </p>

            {/* About Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">{t('about.mission.title')}</h2>
              <p className="text-ocean-lighter mb-6">
                {t('about.mission.text1')}
              </p>
              <p className="text-ocean-lighter">
                {t('about.mission.text2')}
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('about.whyUs.title')}</h3>
                <ul className="space-y-3">
                  {t('about.whyUs.items', { returnObjects: true }).map((item, index) => (
                    <li key={index} className="flex items-start text-ocean-lighter">
                      <div className="w-2 h-2 rounded-full bg-ocean-deep mt-2 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">{t('about.advantages.title')}</h3>
                <ul className="space-y-3">
                  {t('about.advantages.items', { returnObjects: true }).map((item, index) => (
                    <li key={index} className="flex items-start text-ocean-lighter">
                      <div className="w-2 h-2 rounded-full bg-ocean-deep mt-2 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{t('about.contact.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <a 
                    href="https://t.me/thai_guru" 
                    className="flex items-center text-ocean-lighter hover:text-white transition-colors"
                  >
                    <FaTelegramPlane className="h-5 w-5 mr-3 text-ocean-light" />
                    <span>Telegram</span>
                  </a>
                  <a 
                    href="https://wa.me/66816690960" 
                    className="flex items-center text-ocean-lighter hover:text-white transition-colors"
                  >
                    <FaWhatsapp className="h-5 w-5 mr-3 text-ocean-light" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-ocean-lighter">
                    <MapPin className="h-5 w-5 mr-3 text-ocean-light" />
                    <span>{t('about.contact.location')}</span>
                  </div>
                  <div className="flex items-center text-ocean-lighter">
                    <Clock className="h-5 w-5 mr-3 text-ocean-light" />
                    <span>{t('about.contact.hours')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;