import { ServiceCategory, ServiceLocation, ServiceCity } from './serviceTypes';

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface PricingOption {
  id: string;
  name: string;
  description?: string;
  price: {
    adult: number;
    child: number;
    currency: string;
  };
}

export interface Service {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  imageUrl: string;
  gallery: string[]; // Added gallery field
  categories: ServiceCategory[];
  location: ServiceLocation;
  city: ServiceCity;
  duration: {
    days: number;
    nights: number;
  };
  included: string[];
  notIncluded: string[];
  requirements: string[];
  itinerary: {
    day: number;
    activities: string[];
  }[];
  program: string;
  pricingOptions: PricingOption[];
  price: {
    adult: number;
    child: number;
    amount: number;
    currency: string;
  };
  testimonials?: Testimonial[];
  relatedServices?: string[];
}