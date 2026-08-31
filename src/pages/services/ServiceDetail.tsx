import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getServiceById, getServices, getRelatedServices } from '@/lib/services';
import { Service, PricingOption } from '@/types/service';
import { ArrowLeft, Check, X, Clock, Users, Calendar, CreditCard, Info } from 'lucide-react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { ContactFormModal } from '@/components/modals/ContactFormModal';
import { ServiceTestimonials } from '@/components/services/ServiceTestimonials';
import { ServiceCard } from '@/components/services/ServiceCard';
import { supabase } from '@/lib/supabase';
import { translateText } from '@/lib/cohere';
import { ServiceGallery } from '@/components/services/ServiceDetail/ServiceGallery';

const LoadingBlock = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-white/10 rounded w-3/4"></div>
    <div className="h-4 bg-white/10 rounded w-5/6"></div>
    <div className="h-4 bg-white/10 rounded w-2/3"></div>
  </div>
);

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string>('');
  const [translatedProgram, setTranslatedProgram] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    async function loadService() {
      if (!id) return;
      
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const [serviceData, allServices] = await Promise.all([
          getServiceById(id),
          getServices()
        ]);
        
        setService(serviceData);
        
        if (serviceData) {
          // Load related services if available
          if (serviceData.relatedServices && serviceData.relatedServices.length > 0) {
            const related = await getRelatedServices(serviceData.relatedServices);
            setRelatedServices(related);
          }

          // Load recommended services based on categories
          const recommended = allServices
            .filter(s => 
              s.id !== serviceData.id && 
              !serviceData.relatedServices?.includes(s.id) &&
              s.categories.some(cat => serviceData.categories.includes(cat))
            )
            .slice(0, 3);
            
          setRecommendedServices(recommended);
        }
        
        if (serviceData?.pricingOptions?.length > 0) {
          setSelectedOption(serviceData.pricingOptions[0]);
        }

        // Set initial translation values
        setTranslatedDescription(serviceData?.description || '');
        setTranslatedProgram(serviceData?.program || '');
      } catch (err) {
        setError('Failed to load service');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

  useEffect(() => {
    async function translateContent() {
      if (!service || !i18n.language) return;

      if (i18n.language === 'en') {
        try {
          // If we have titleEn, immediately show it and other stored translations
          if (service.titleEn) {
            setTranslatedDescription(service.titleEn);
          }
          
          // Get stored translations
          const { data: storedTranslations, error: fetchError } = await supabase
            .from('services')
            .select('descriptionEn, programEn')
            .eq('id', service.id)
            .single();

          if (fetchError) {
            console.error('Error fetching translations:', fetchError);
            return;
          }

          // If we have stored translations, show them immediately
          if (storedTranslations?.descriptionEn) {
            setTranslatedDescription(storedTranslations.descriptionEn);
            setIsTranslating(false);
          }
          if (storedTranslations?.programEn) {
            setTranslatedProgram(storedTranslations.programEn);
            setIsTranslating(false);
          }

          // In background, verify translations
          let needsUpdate = false;
          let newDescriptionEn = storedTranslations?.descriptionEn;
          let newProgramEn = storedTranslations?.programEn;

          // Only show loading state if we don't have stored translations
          if (!storedTranslations?.descriptionEn && !service.titleEn) {
            setIsTranslating(true);
          }

          // Check description translation
          const freshDescriptionTranslation = await translateText(service.description, 'en');
          if (!newDescriptionEn || freshDescriptionTranslation !== newDescriptionEn) {
            newDescriptionEn = freshDescriptionTranslation;
            setTranslatedDescription(newDescriptionEn);
            needsUpdate = true;
          }

          // Check program translation if exists
          if (service.program) {
            const freshProgramTranslation = await translateText(service.program, 'en');
            if (!newProgramEn || freshProgramTranslation !== newProgramEn) {
              newProgramEn = freshProgramTranslation;
              setTranslatedProgram(newProgramEn);
              needsUpdate = true;
            }
          }

          // Update translations in Supabase if needed
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
        // For Russian language use original text
        setTranslatedDescription(service.description);
        setTranslatedProgram(service.program);
        setIsTranslating(false);
      }
    }

    translateContent();
  }, [i18n.language, service]);
  
  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const handleTestimonialSubmit = async (testimonial: {
    rating: number;
    comment: string;
    author: string;
  }) => {
    if (!service) return;

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

    setService(prev => prev ? {
      ...prev,
      testimonials: updatedTestimonials
    } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
        <HeaderBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex justify-center items-center py-12">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const title = i18n.language === 'en' && service.titleEn ? service.titleEn : service.title;

  const currentPricing = selectedOption || {
    price: {
      adult: service.price.adult,
      child: service.price.child,
      currency: service.price.currency
    }
  };

  const totalPrice = (adults * currentPricing.price.adult) + (children * currentPricing.price.child);

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <Link to="/services" className="inline-flex items-center text-teal-200 hover:text-white mb-6 md:mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('services.detail.backToServices')}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img src={service.imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
                
                {isTranslating ? (
                  <div className="mb-8">
                    <LoadingBlock />
                  </div>
                ) : (
                  <p className="text-lg md:text-xl text-teal-100 mb-8">{translatedDescription}</p>
                )}

                      {/* Gallery */}
      <ServiceGallery images={service.gallery} title={service.title} />


                {/* Program Section */}
                {service.program && (
                  <div className="mb-8">
                    <div className="flex items-center text-white mb-4">
                      <Calendar className="h-6 w-6 mr-3 text-ocean-light" />
                      <h2 className="text-2xl font-bold">{t('services.detail.program')}</h2>
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
                    <h2 className="text-2xl font-bold">{t('services.detail.duration')}</h2>
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
                      <h2 className="text-2xl font-bold">{t('services.detail.included')}</h2>
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
                      <h2 className="text-2xl font-bold">{t('services.detail.notIncluded')}</h2>
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
                      <h2 className="text-2xl font-bold">{t('services.detail.requirements')}</h2>
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

                {/* Itinerary Section */}
                {service.itinerary && service.itinerary.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center text-white mb-4">
                      <Calendar className="h-6 w-6 mr-3 text-ocean-light" />
                      <h2 className="text-2xl font-bold">Расписание</h2>
                    </div>
                    <div className="space-y-4">
                      {service.itinerary.map((day, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-6">
                          <h3 className="text-xl font-bold text-white mb-4">
                            День {day.day}
                          </h3>
                          <ul className="space-y-3">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="flex items-start text-ocean-light">
                                <div className="w-2 h-2 rounded-full bg-ocean-light mt-2 mr-3 flex-shrink-0" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
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
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6">{t('services.detail.booking.title')}</h3>
              
              {/* Pricing Options */}
              {service.pricingOptions && service.pricingOptions.length > 0 && (
                <div className="mb-6">
                  <label className="block text-ocean-light text-sm mb-2">
                    {t('services.detail.booking.selectOption')}
                  </label>
                  <div className="space-y-2">
                    {service.pricingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full p-4 rounded-lg text-left transition-colors ${
                          selectedOption?.id === option.id
                            ? 'bg-ocean-deep text-white'
                            : 'bg-white/10 text-ocean-light hover:bg-white/20'
                        }`}
                      >
                        <div className="font-medium mb-1">{option.name}</div>
                        {option.description && (
                          <div className="text-sm opacity-80">{option.description}</div>
                        )}
                        <div className="mt-2 flex justify-between text-sm">
                          <span>{t('services.detail.booking.priceBreakdown.adults')}: {option.price.adult} {option.price.currency}</span>
                          <span>{t('services.detail.booking.priceBreakdown.children')}: {option.price.child} {option.price.currency}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-ocean-light text-sm mb-2">{t('services.detail.booking.date')}</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                           text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                           focus:ring-ocean-deep focus:border-transparent"
                />
              </div>

              {/* Participants */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-ocean-light text-sm mb-2">{t('services.detail.booking.adults')}</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
                    >-</button>
                    <span className="mx-4 text-white min-w-[2rem] text-center">{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
                    >+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-ocean-light text-sm mb-2">{t('services.detail.booking.children')}</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
                    >-</button>
                    <span className="mx-4 text-white min-w-[2rem] text-center">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-ocean-light mb-2">
                  <span>{t('services.detail.booking.priceBreakdown.adults')} ({adults})</span>
                  <span>{(adults * currentPricing.price.adult).toLocaleString()} {currentPricing.price.currency}</span>
                </div>
                <div className="flex justify-between text-ocean-light mb-4">
                  <span>{t('services.detail.booking.priceBreakdown.children')} ({children})</span>
                  <span>{(children * currentPricing.price.child).toLocaleString()} {currentPricing.price.currency}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10">
                  <span>{t('services.detail.booking.priceBreakdown.total')}</span>
                  <span>{totalPrice.toLocaleString()} {currentPricing.price.currency}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                disabled={!selectedDate}
                className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                         hover:bg-ocean-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('services.detail.booking.button')}
              </button>
            </div>
          </div>
        </div>

        {/* Related Services Section */}
        {relatedServices.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">{t('services.detail.relatedServices')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((relatedService) => (
                <div 
                  key={relatedService.id}
                  onClick={() => handleServiceClick(relatedService.id)}
                  className="cursor-pointer"
                >
                  <ServiceCard service={relatedService} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Services Section */}
        {recommendedServices.length > 0 && (
          <div className="mt-24 mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">{t('services.detail.otherServices')}</h2>
              <Link 
                to="/services"
                className="text-ocean-light hover:text-white transition-colors flex items-center"
              >
                {t('services.detail.allServices')}
                <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedServices.map((recommendedService) => (
                <div 
                  key={recommendedService.id}
                  onClick={() => handleServiceClick(recommendedService.id)}
                  className="cursor-pointer"
                >
                  <ServiceCard service={recommendedService} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ContactFormModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        serviceTitle={`${title}${selectedOption ? ` (${selectedOption.name})` : ''}`}
        date={selectedDate}
        adults={adults}
        children={children}
        totalPrice={totalPrice}
        currency={currentPricing.price.currency}
      />
    </div>
  );
};

export default ServiceDetail;