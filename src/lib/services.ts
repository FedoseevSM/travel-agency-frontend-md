import type { Service } from '@/types/service';
import { getRandomGalleryImages } from '@/data/gallery';
import frontMatter from 'front-matter';

// Load all markdown files as strings
const markdownFiles = import.meta.glob('@/content/tours/*.md', { query: '?raw', import: 'default', eager: true });

function getAllServices(): Service[] {
  const services: Service[] = [];
  
  for (const path in markdownFiles) {
    const rawContent = markdownFiles[path] as string;
    const { attributes, body } = frontMatter<any>(rawContent);
    services.push(formatService({ ...attributes, program: body }));
  }
  
  return services;
}

export async function getServices(searchQuery?: string): Promise<Service[]> {
  let services = getAllServices();

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    services = services.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) ||
      (s.titleEn && s.titleEn.toLowerCase().includes(lowerQuery)) ||
      (s.description && s.description.toLowerCase().includes(lowerQuery))
    );
  }

  return services;
}

export async function getServiceById(id: string): Promise<Service | null> {
  const services = getAllServices();
  return services.find(s => s.id === id) || null;
}

export async function getRelatedServices(ids: string[]): Promise<Service[]> {
  if (!ids.length) return [];
  const services = getAllServices();
  return services.filter(s => ids.includes(s.id));
}

function formatService(raw: any): Service {
  return {
    id: raw.id,
    title: raw.title,
    titleEn: raw.titleEn,
    description: raw.description,
    imageUrl: raw.imageUrl,
    gallery: raw.gallery || getRandomGalleryImages(4),
    categories: raw.categories || [],
    location: raw.location,
    city: raw.city,
    duration: {
      days: raw.duration?.days || 0,
      nights: raw.duration?.nights || 0
    },
    price: {
      adult: raw.price?.adult || 0,
      child: raw.price?.child || 0,
      amount: raw.price?.amount || 0,
      currency: raw.price?.currency || 'THB'
    },
    program: raw.program || '',
    pricingOptions: raw.pricingOptions || [{
      id: 'standard',
      name: 'Стандартный',
      price: {
        adult: raw.price?.adult || 0,
        child: raw.price?.child || 0,
        currency: raw.price?.currency || 'THB'
      }
    }],
    included: raw.included || [],
    notIncluded: raw.notIncluded || [],
    requirements: raw.requirements || [],
    itinerary: raw.itinerary || [],
    testimonials: raw.testimonials || [],
    relatedServices: raw.relatedServices || []
  };
}