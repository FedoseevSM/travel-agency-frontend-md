import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Booking {
  id: string;
  service: string;
  timeAgo: string;
  location: string;
}

const mockBookings: Booking[] = [
  { id: '1', service: 'Экскурсия на острова Пхи-Пхи', timeAgo: '2 минуты', location: 'Москва' },
  { id: '2', service: 'Вечернее шоу Сиам Нирамит', timeAgo: '5 минут', location: 'Санкт-Петербург' },
  { id: '3', service: 'Экскурсия на острова Симилан', timeAgo: '7 минут', location: 'Новосибирск' },
  { id: '4', service: 'Морская прогулка на закате', timeAgo: '12 минут', location: 'Екатеринбург' },
  { id: '5', service: 'Храмы Пхукета', timeAgo: '15 минут', location: 'Казань' }
];

export const RecentBookings: React.FC = () => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification
    const initialDelay = setTimeout(() => {
      showNextBooking();
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  const showNextBooking = () => {
    const randomBooking = mockBookings[Math.floor(Math.random() * mockBookings.length)];
    setCurrentBooking(randomBooking);
    setIsVisible(true);

    // Hide notification after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      // Schedule next notification after current one disappears
      setTimeout(() => {
        showNextBooking();
      }, Math.random() * 15000 + 10000); // Random delay between 5-20 seconds
    }, 5000);
  };

  if (!isVisible || !currentBooking) return null;

  return (
    <div className="fixed top-24 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out hidden lg:block">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 pr-12 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start">
          <div className="flex-shrink-0 w-3 h-3 mt-1.5 bg-ocean-deep rounded-full animate-pulse" />
          <div className="ml-3">
            <p className="text-gray-900">
              Путешественник из <span className="font-medium">{currentBooking.location}</span>{' '}
              забронировал(а) <span className="font-medium">{currentBooking.service}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {currentBooking.timeAgo} назад
            </p>
          </div>
        </div>

        <div className="mt-3 text-sm text-ocean-deep">
          🔥 Успейте забронировать по текущей цене!
        </div>
      </div>
    </div>
  );
};