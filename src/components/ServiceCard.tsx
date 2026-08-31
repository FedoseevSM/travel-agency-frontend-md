import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Service } from '../types/service';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link
      to={service.link}
      className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
        <div className="absolute bottom-0 p-6">
          <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-teal-100 mb-4">{service.description}</p>
          <div className="flex items-center text-teal-200">
            <span>Подробнее</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </Link>
  );
};