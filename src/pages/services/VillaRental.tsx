import React, { useState } from 'react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { ContactFormModal } from '@/components/modals/ContactFormModal';
import { ChevronLeft, ChevronRight, Wifi, School as Pool, Twitch as Kitchen, Car, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import axios from 'axios';

const villas = [
  {
    id: 'luxury-pool-villa',
    name: 'Luxury Pool Villa',
    location: 'Раваи, Пхукет',
    features: ['Бассейн', 'Wi-Fi', 'Кухня', 'Парковка', '4 спальни'],
    pricing: {
      day: 15000,
      week: 12000,
      month: 10000
    },
    specs: {
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      pool: true
    },
    gallery: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'beachfront-villa',
    name: 'Beachfront Villa',
    location: 'Камала, Пхукет',
    features: ['Прямой выход к пляжу', 'Бассейн', 'Wi-Fi', 'Кухня', '3 спальни'],
    pricing: {
      day: 20000,
      week: 17000,
      month: 15000
    },
    specs: {
      bedrooms: 3,
      bathrooms: 2,
      area: 280,
      pool: true
    },
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80'
    ]
  }
];

const paymentServices = [
  {
    name: 'Booking.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/2560px-Booking.com_logo.svg.png',
    description: 'Помощь в бронировании и оплате через Booking.com'
  },
  {
    name: 'Agoda',
    logo: 'https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg',
    description: 'Поддержка при оплате через Agoda'
  },
  {
    name: 'Airbnb',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png',
    description: 'Содействие в бронировании через Airbnb'
  }
];

const VillaRental = () => {
  const [selectedVilla, setSelectedVilla] = useState<(typeof villas)[0] | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<Record<string, number>>(
    villas.reduce((acc, villa) => ({ ...acc, [villa.id]: 0 }), {})
  );

  const handleImageNav = (villaId: string, direction: 'prev' | 'next') => {
    const villa = villas.find(v => v.id === villaId);
    if (!villa) return;

    setCurrentImages(prev => ({
      ...prev,
      [villaId]: direction === 'next'
        ? (prev[villaId] + 1) % villa.gallery.length
        : (prev[villaId] - 1 + villa.gallery.length) % villa.gallery.length
    }));
  };

  const handleBookingSubmit = async (formData: {
    name: string;
    phone: string;
    email: string;
    message: string;
    contact_method: string;
    service: string;
    location: string;
    status: string;
  }) => {
    if (!selectedVilla) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            contact_method: formData.contact_method,
            service: formData.service,
            location: formData.location,
            status: formData.status,
            service_title: `Аренда виллы: ${selectedVilla.name}`,
            total_price: selectedVilla.pricing.day,
            currency: '฿'
          }
        ]);

      if (error) throw error;

      try {
        await axios.post('https://tgtg.koyeb.app/api/notify', {
          email: formData.email || 'Email не указан',
          name: formData.name,
          contact: formData.phone,
          contactMethod: formData.contact_method,
          service: `Аренда виллы: ${selectedVilla.name}`,
          location: formData.location,
          status: formData.status,
          message: formData.message || 'Нет комментария',
          totalPrice: selectedVilla.pricing.day,
          currency: '฿'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } catch (notifyError: any) {
        console.error('Notification error:', notifyError);
      }

      setIsBookingModalOpen(false);
      setSelectedVilla(null);
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');

    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="space-y-12">
      <div className="relative">
           {/* Payment Services Section */}
        <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm">
          <div className="flex items-center mb-8">
            <CreditCard className="h-6 w-6 text-ocean-light mr-3" />
            <h2 className="text-2xl font-bold text-white">Помощь с оплатой</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentServices.map((service) => (
              <div
                key={service.name}
                className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-colors"
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  className="h-8 object-contain mb-4 filter brightness-0 invert"
                />
                <p className="text-ocean-light text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
        <div className="space-y-12 mb-16">
          {villas.map((villa) => (
            <div
              key={villa.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Left Column - Gallery */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                  <img
                    src={villa.gallery[currentImages[villa.id]]}
                    alt={villa.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <button
                    onClick={() => handleImageNav(villa.id, 'prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                             opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleImageNav(villa.id, 'next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                             opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {villa.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImages(prev => ({ ...prev, [villa.id]: index }))}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          currentImages[villa.id] === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{villa.name}</h2>
                  <p className="text-ocean-light mb-6">{villa.location}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    {villa.features.map((feature, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-white/10 rounded-lg text-ocean-light text-sm"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-2 text-center font-medium">СУТКИ</div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-white">{villa.pricing.day.toLocaleString()}</span>
                        <span className="text-ocean-light ml-1">฿</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-2 text-center font-medium">НЕДЕЛЯ</div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-white">{villa.pricing.week.toLocaleString()}</span>
                        <span className="text-ocean-light ml-1">฿</span>
                        <div className="text-sm text-ocean-light mt-1">за сутки</div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-2 text-center font-medium">МЕСЯЦ</div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-white">{villa.pricing.month.toLocaleString()}</span>
                        <span className="text-ocean-light ml-1">฿</span>
                        <div className="text-sm text-ocean-light mt-1">за сутки</div>
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-1">Спальни</div>
                      <div className="text-lg text-white">{villa.specs.bedrooms}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-1">Ванные</div>
                      <div className="text-lg text-white">{villa.specs.bathrooms}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-1">Площадь</div>
                      <div className="text-lg text-white">{villa.specs.area} м²</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-ocean-light mb-1">Бассейн</div>
                      <div className="text-lg text-white">{villa.specs.pool ? 'Да' : 'Нет'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedVilla(villa);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                             hover:bg-ocean-medium transition-colors"
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


      {selectedVilla && (
        <ContactFormModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          serviceTitle={`Аренда виллы: ${selectedVilla.name}`}
          totalPrice={selectedVilla.pricing.day}
          currency="฿"
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default VillaRental;