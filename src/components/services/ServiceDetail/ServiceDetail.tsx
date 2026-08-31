import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceById, getServices } from '@/lib/services';
import { Service } from '@/types/service';
import { ArrowLeft } from 'lucide-react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { ServiceContent } from './ServiceContent';
import { BookingSidebar } from './BookingSidebar';
import { RecommendedServices } from './RecommendedServices';
import { ContactFormModal } from '@/components/modals/ContactFormModal';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

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
          const recommended = allServices
            .filter(s => 
              s.id !== serviceData.id && 
              s.categories.some(cat => serviceData.categories.includes(cat))
            )
            .slice(0, 3);
            
          setRecommendedServices(recommended);
        }
      } catch (err) {
        setError('Failed to load service');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

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

  if (error || !service) {
    return (
      <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
        <HeaderBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <h1 className="text-4xl font-bold text-white">
            {error || 'Услуга не найдена'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <Link to="/services" className="inline-flex items-center text-teal-200 hover:text-white mb-6 md:mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Назад к услугам
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <div className="lg:col-span-2">
            <ServiceContent service={service} />
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar
              service={service}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
              onBookingClick={() => setIsBookingModalOpen(true)}
            />
          </div>
        </div>

        <RecommendedServices
          services={recommendedServices}
          onServiceClick={(serviceId) => navigate(`/services/${serviceId}`)}
        />
      </div>

      <ContactFormModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        serviceTitle={service.title}
        date={selectedDate}
        adults={adults}
        children={children}
        totalPrice={(adults * service.price.adult) + (children * service.price.child)}
        currency={service.price.currency}
      />
    </div>
  );
};

export default ServiceDetail;