import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wifi, School as Pool, Twitch as Kitchen, Car, CreditCard } from 'lucide-react';
import { ContactFormModal } from '@/components/modals/ContactFormModal';
import { supabase } from '@/lib/supabase';
import axios from 'axios';

interface CarCategory {
  id: string;
  name: string;
  description: string;
}

interface CarData {
  id: string;
  category_id: string;
  brand: string;
  year: number;
  seats: number;
  features: string[];
  pricing: {
    day: number;
    week: number;
    month: number;
  };
  gallery: string[];
}

const RentService = () => {
  const [categories, setCategories] = useState<CarCategory[]>([]);
  const [cars, setCars] = useState<Record<string, CarData[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCarsForCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('car_categories')
        .select('*')
        .order('id');

      if (error) throw error;

      if (data) {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Не удалось загрузить категории автомобилей');
    }
  };

  const loadCarsForCategory = async (categoryId: string) => {
    if (cars[categoryId]) return; // Already loaded

    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('category_id', categoryId)
        .eq('active', true);

      if (error) throw error;

      if (data) {
        setCars(prev => ({
          ...prev,
          [categoryId]: data
        }));
        // Initialize image indices for new cars
        setCurrentImages(prev => ({
          ...prev,
          ...data.reduce((acc, car) => ({ ...acc, [car.id]: 0 }), {})
        }));
      }
    } catch (err) {
      console.error('Error loading cars:', err);
      setError('Не удалось загрузить данные об автомобилях');
    } finally {
      setLoading(false);
    }
  };

  const handleImageNav = (carId: string, direction: 'prev' | 'next') => {
    const car = Object.values(cars).flat().find(c => c.id === carId);
    if (!car) return;

    setCurrentImages(prev => ({
      ...prev,
      [carId]: direction === 'next'
        ? (prev[carId] + 1) % car.gallery.length
        : (prev[carId] - 1 + car.gallery.length) % car.gallery.length
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
    if (!selectedCategory) return;

    try {
      const selectedCar = cars[selectedCategory.id]?.[0];
      if (!selectedCar) return;

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
            service_title: `Аренда авто: ${selectedCar.brand} ${selectedCar.year}`,
            total_price: selectedCar.pricing.day,
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
          service: `Аренда авто: ${selectedCar.brand} ${selectedCar.year}`,
          location: formData.location,
          status: formData.status,
          message: formData.message || 'Нет комментария',
          totalPrice: selectedCar.pricing.day,
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
      setSelectedCategory(null);
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');

    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-ocean-light text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className={`p-6 rounded-xl text-left transition-all ${
              selectedCategory?.id === category.id
                ? 'bg-ocean-deep text-white'
                : 'bg-white/10 text-ocean-light hover:bg-white/20'
            }`}
          >
            <Car className={`h-8 w-8 mb-4 ${
              selectedCategory?.id === category.id ? 'text-white' : 'text-ocean-light'
            }`} />
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-sm opacity-80">{category.description}</p>
          </button>
        ))}
      </div>

      {/* Cars */}
      {selectedCategory && cars[selectedCategory.id]?.map((car) => (
        <div
          key={car.id}
          className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Gallery */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img
                src={car.gallery[currentImages[car.id]]}
                alt={car.brand}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <button
                onClick={() => handleImageNav(car.id, 'prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => handleImageNav(car.id, 'next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white
                         opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {car.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImages(prev => ({ ...prev, [car.id]: index }))}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImages[car.id] === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{car.brand}</h2>
              <p className="text-ocean-light mb-6">{car.year} • {car.seats} мест</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-4 mb-8">
                {car.features.map((feature, index) => (
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
                    <span className="text-2xl font-bold text-white">{car.pricing.day.toLocaleString()}</span>
                    <span className="text-ocean-light ml-1">฿</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-ocean-light mb-2 text-center font-medium">НЕДЕЛЯ</div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{car.pricing.week.toLocaleString()}</span>
                    <span className="text-ocean-light ml-1">฿</span>
                    <div className="text-sm text-ocean-light mt-1">за сутки</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-ocean-light mb-2 text-center font-medium">МЕСЯЦ</div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{car.pricing.month.toLocaleString()}</span>
                    <span className="text-ocean-light ml-1">฿</span>
                    <div className="text-sm text-ocean-light mt-1">за сутки</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                         hover:bg-ocean-medium transition-colors"
              >
                Забронировать
              </button>
            </div>
          </div>
        </div>
      ))}

      {selectedCategory && (
        <ContactFormModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          serviceTitle={`Аренда авто: ${selectedCategory.name}`}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default RentService;