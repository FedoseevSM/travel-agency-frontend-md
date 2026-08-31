import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Anchor, Moon, Plane, MapPin } from 'lucide-react';
import { Service } from '@/types/service';
import { useTranslation } from 'react-i18next';

const getCategoryIcon = (category: string) => {
  if (category.startsWith('sea-')) return <Anchor className="h-4 w-4" />;
  if (category.startsWith('air-')) return <Plane className="h-4 w-4" />;
  if (category.startsWith('land-')) return <MapPin className="h-4 w-4" />;
  if (category.includes('evening')) return <Moon className="h-4 w-4" />;
  return null;
};

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { i18n } = useTranslation();
  
  // Используем titleEn для английского языка, title для русского
  const title = i18n.language === 'en' && service.titleEn ? service.titleEn : service.title;
  
  const truncatedTitle = title.length > 40 
    ? `${title.substring(0, 37)}...` 
    : title;

  // Safely format numbers with fallback
  const formatPrice = (price: number) => {
    try {
      return price?.toLocaleString() || '0';
    } catch {
      return '0';
    }
  };

  return (
    <Link
      to={`/services/${service.id}`}
      className="group block h-[500px] relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
    >
      <div className="h-[240px]">
        <img
          src={service.imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="absolute bottom-0 p-6 w-full">
          {/* Title and Description */}
          <div className="mb-4">
            <h3 
              className="text-xl font-bold text-white mb-2 truncate" 
              title={title}
            >
              {truncatedTitle}
            </h3>
            <p className="text-ocean-lighter line-clamp-3 text-sm h-[60px]">
              {service.description}
            </p>
          </div>
          
          {/* Duration and Price */}
          <div className="flex items-center justify-between mb-4 bg-black/30 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center text-ocean-light text-sm">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-2">
                {service.duration.days} {service.duration.days === 1 ? 'день' : 'дня'} {' '}
                {service.duration.nights > 0 && `${service.duration.nights} ${service.duration.nights === 1 ? 'ночь' : 'ночи'}`}
              </span>
            </div>
            <div className="text-right ml-4">
              <div className="text-ocean-light text-sm font-medium whitespace-nowrap">
                Взрослый: <span className="text-white">{formatPrice(service.price.adult)} {service.price.currency}</span>
              </div>
              <div className="text-ocean-light text-sm font-medium whitespace-nowrap">
                Ребенок: <span className="text-white">{formatPrice(service.price.child)} {service.price.currency}</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-ocean-light group-hover:text-white transition-colors">
            <div className="flex items-center">
              <span className="text-sm font-medium">Подробнее</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </div>
            {service.categories[0] && (
              <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
                {getCategoryIcon(service.categories[0])}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};