import React, { useEffect, useState } from 'react';
import { ServiceCard } from './ServiceCard';
import { getServices } from '@/lib/services';
import { Service, ServiceCategory, ServiceLocation, ServiceCity } from '@/types/service';

interface ServiceGridProps {
  limit?: number;
  selectedCategories?: ServiceCategory[];
  selectedLocation?: ServiceLocation | null;
  selectedCity?: ServiceCity | null;
  searchQuery?: string;
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ 
  limit,
  selectedCategories = [],
  selectedLocation = null,
  selectedCity = null,
  searchQuery = '',
  selectedMinPrice,
  selectedMaxPrice,
  currentPage = 1,
  itemsPerPage = 9
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices(searchQuery);
        
        // Client-side filtering
        const filteredData = data.filter(service => {
          const matchesCategories = selectedCategories.length === 0 || 
            service.categories.some(category => selectedCategories.includes(category));
          
          const matchesLocation = !selectedLocation || service.location === selectedLocation;
          const matchesCity = !selectedCity || service.city === selectedCity;
          
          const matchesPrice = (!selectedMinPrice || service.price.amount >= selectedMinPrice) &&
            (!selectedMaxPrice || service.price.amount <= selectedMaxPrice);
          
          return matchesCategories && matchesLocation && matchesCity && matchesPrice;
        });

        setServices(filteredData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Не удалось загрузить услуги');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchServices, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, selectedCategories, selectedLocation, selectedCity, selectedMinPrice, selectedMaxPrice]);

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

  if (services.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-ocean-light text-lg">По вашему запросу ничего не найдено</p>
        <p className="text-ocean-light text-sm mt-2">Попробуйте изменить параметры поиска</p>
      </div>
    );
  }

  const paginatedServices = limit 
    ? services.slice(0, limit) 
    : services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {paginatedServices.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};