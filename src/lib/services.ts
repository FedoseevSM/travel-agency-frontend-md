import { supabase } from './supabase';
import type { Service } from '@/types/service';
import { getRandomGalleryImages } from '@/data/gallery';

export async function getServices(searchQuery?: string): Promise<Service[]> {
  let query = supabase
    .from('services')
    .select('*')
    .eq('active', true);

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,titleEn.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map(formatService);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*, testimonials, related_services')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }

  return data ? formatService(data) : null;
}

export async function getRelatedServices(ids: string[]): Promise<Service[]> {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .in('id', ids)
    .eq('active', true);

  if (error) {
    console.error('Error fetching related services:', error);
    throw error;
  }

  return data ? data.map(formatService) : [];
}

function formatService(raw: any): Service {
  return {
    id: raw.id,
    title: raw.title,
    titleEn: raw.titleEn,
    description: raw.description,
    imageUrl: raw.imageUrl,
    gallery: raw.gallery || getRandomGalleryImages(4), // Use random gallery images if none provided
    categories: raw.categories,
    location: raw.location,
    city: raw.city,
    duration: {
      days: raw['duration.days'],
      nights: raw['duration.nights']
    },
    price: {
      adult: raw['price.adult'],
      child: raw['price.child'],
      amount: raw['price.amount'],
      currency: raw['price.currency']
    },
    program: raw.program || '',
    pricingOptions: raw.pricingOptions || [{
      id: 'standard',
      name: 'Стандартный',
      price: {
        adult: raw['price.adult'],
        child: raw['price.child'],
        currency: raw['price.currency']
      }
    }],
    included: raw.included || [],
    notIncluded: raw.notIncluded || [],
    requirements: raw.requirements || [],
    itinerary: raw.itinerary || [],
    testimonials: raw.testimonials || [],
    relatedServices: raw.related_services || []
  };
}