import React, { useEffect, useState } from 'react';
import { Clock, Check, X, Info, Calendar } from 'lucide-react';
import { Service } from '@/types/service';
import { ServiceTestimonials } from '@/components/services/ServiceTestimonials';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { translateText } from '@/lib/cohere';

interface ServiceContentProps {
  service: Service;
}

export const ServiceContent: React.FC<ServiceContentProps> = ({ service }) => {
  const { i18n } = useTranslation();
  const [translatedDescription, setTranslatedDescription] = useState(service.description);
  const [translatedProgram, setTranslatedProgram] = useState(service.program);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    async function translateContent() {
      if (i18n.language === 'en') {
        try {
          setIsTranslating(true);

          // Check if we have stored translations
          const { data: storedTranslations, error: fetchError } = await supabase
            .from('services')
            .select('descriptionEn, programEn')
            .eq('id', service.id)
            .single();

          if (fetchError) {
            console.error('Error fetching translations:', fetchError);
            return;
          }

          let newDescriptionEn = storedTranslations?.descriptionEn;
          let newProgramEn = storedTranslations?.programEn;
          let needsUpdate = false;

          // Handle description translation
          if (!newDescriptionEn) {
            // No stored translation, get new one
            newDescriptionEn = await translateText(service.description, 'en');
            needsUpdate = true;
          } else {
            // Verify stored translation
            const freshTranslation = await translateText(service.description, 'en');
            if (freshTranslation !== newDescriptionEn) {
              newDescriptionEn = freshTranslation;
              needsUpdate = true;
            }
          }
          setTranslatedDescription(newDescriptionEn);

          // Handle program translation if exists
          if (service.program) {
            if (!newProgramEn) {
              // No stored translation, get new one
              newProgramEn = await translateText(service.program, 'en');
              needsUpdate = true;
            } else {
              // Verify stored translation
              const freshProgramTranslation = await translateText(service.program, 'en');
              if (freshProgramTranslation !== newProgramEn) {
                newProgramEn = freshProgramTranslation;
                needsUpdate = true;
              }
            }
            setTranslatedProgram(newProgramEn);
          }

          // Update Supabase if needed
          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from('services')
              .update({
                descriptionEn: newDescriptionEn,
                programEn: newProgramEn
              })
              .eq('id', service.id);

            if (updateError) {
              console.error('Error updating translations:', updateError);
            }
          }
        } catch (error) {
          console.error('Translation error:', error);
          // Fallback to original text
          setTranslatedDescription(service.description);
          setTranslatedProgram(service.program);
        } finally {
          setIsTranslating(false);
        }
      } else {
        // Reset to original Russian text
        setTranslatedDescription(service.description);
        setTranslatedProgram(service.program);
      }
    }

    translateContent();
  }, [i18n.language, service.description, service.program, service.id]);

  const handleTestimonialSubmit = async (testimonial: {
    rating: number;
    comment: string;
    author: string;
  }) => {
    const newTestimonial = {
      id: crypto.randomUUID(),
      ...testimonial,
      date: new Date().toLocaleDateString('ru-RU'),
    };

    const { data: currentService, error: fetchError } = await supabase
      .from('services')
      .select('testimonials')
      .eq('id', service.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const updatedTestimonials = [
      ...(currentService?.testimonials || []),
      newTestimonial
    ];

    const { error: updateError } = await supabase
      .from('services')
      .update({ testimonials: updatedTestimonials })
      .eq('id', service.id);

    if (updateError) {
      throw updateError;
    }
  };

  const LoadingBlock = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
      <div className="h-4 bg-white/10 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{service.title}</h1>
        {isTranslating ? (
          <div className="mb-8">
            <LoadingBlock />
          </div>
        ) : (
          <p className="text-lg md:text-xl text-teal-100 mb-8">{translatedDescription}</p>
        )}

        {/* Program Section */}
        {service.program && (
          <div className="mb-8">
            <div className="flex items-center text-white mb-4">
              <Calendar className="h-6 w-6 mr-3 text-ocean-light" />
              <h2 className="text-2xl font-bold">Программа</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <div className="prose prose-invert prose-ocean max-w-none">
                {isTranslating ? (
                  <LoadingBlock />
                ) : (
                  translatedProgram.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-ocean-light mb-4">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Duration Card */}
        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <div className="flex items-center text-white mb-4">
            <Clock className="h-6 w-6 mr-3 text-ocean-light" />
            <h2 className="text-2xl font-bold">Продолжительность</h2>
          </div>
          <p className="text-ocean-light text-lg">
            {service.duration.days} {service.duration.days === 1 ? 'день' : 'дня'} {' '}
            {service.duration.nights > 0 && `${service.duration.nights} ${service.duration.nights === 1 ? 'ночь' : 'ночи'}`}
          </p>
        </div>

        {/* Included Section */}
        {service.included && service.included.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center text-white mb-4">
              <Check className="h-6 w-6 mr-3 text-emerald-500" />
              <h2 className="text-2xl font-bold">Включено в стоимость</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.included.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-ocean-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Not Included Section */}
        {service.notIncluded && service.notIncluded.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center text-white mb-4">
              <X className="h-6 w-6 mr-3 text-red-500" />
              <h2 className="text-2xl font-bold">Не включено в стоимость</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-ocean-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Requirements Section */}
        {service.requirements && service.requirements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center text-white mb-4">
              <Info className="h-6 w-6 mr-3 text-ocean-light" />
              <h2 className="text-2xl font-bold">Что взять с собой</h2>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-ocean-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {service.testimonials && (
          <ServiceTestimonials 
            testimonials={service.testimonials}
            serviceId={service.id}
            onTestimonialSubmit={handleTestimonialSubmit}
          />
        )}
      </div>
    </div>
  );
};