import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Service } from '@/types/service';
import { ServiceCard } from '@/components/services/ServiceCard';

interface RecommendedServicesProps {
  services: Service[];
  onServiceClick: (serviceId: string) => void;
}

export const RecommendedServices: React.FC<RecommendedServicesProps> = ({
  services,
  onServiceClick
}) => {
  if (services.length === 0) return null;

  return (
    <div className="mt-24 mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Другие экскурсии</h2>
        <Link 
          to="/services"
          className="text-ocean-light hover:text-white transition-colors flex items-center"
        >
          Все экскурсии
          <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div 
            key={service.id}
            onClick={() => onServiceClick(service.id)}
            className="cursor-pointer"
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};