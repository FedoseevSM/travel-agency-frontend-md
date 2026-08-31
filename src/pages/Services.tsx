import React, { Suspense, useState } from 'react';
import { HeaderBackground } from '@/components/layout/HeaderBackground';
import { CategorySelector, ServiceCategory } from '@/components/services/CategorySelector';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Lazy load components
const ServicesSection = React.lazy(() => import('@/components/services/ServicesSection').then(m => ({ default: m.ServicesSection })));
const RentService = React.lazy(() => import('./services/RentService'));
const VillaRental = React.lazy(() => import('./services/VillaRental'));
const ShoppingService = React.lazy(() => import('./services/ShoppingService'));

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('excursions');
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="min-h-screen bg-ocean-darkest pt-20 md:pt-24 relative">
      <HeaderBackground height="30vh" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('services.title')}
              </h1>
              <p className="text-ocean-light text-lg max-w-2xl">
                {t('services.subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 bg-ocean-deep/80 hover:bg-ocean-deep text-white rounded-lg transition-colors md:self-start text-lg"
            >
              <Filter className="h-5 w-5 mr-2" />
              {showFilters ? t('services.hideFilters') : t('services.showFilters')}
              {showFilters ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
            </button>
          </div>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <CategorySelector 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />
          </div>

          <Suspense fallback={<div className="h-96 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>}>
            {activeCategory === 'excursions' && <ServicesSection showAll />}
            {activeCategory === 'auto' && <RentService />}
            {activeCategory === 'rent' && <VillaRental />}
            {activeCategory === 'shopping' && <ShoppingService />}
            {(activeCategory !== 'excursions' && 
              activeCategory !== 'auto' && 
              activeCategory !== 'rent' && 
              activeCategory !== 'shopping') && (
              <div className="text-center py-16 px-4 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold text-ocean-light mb-4">
                    {t('services.inDevelopment.title')}
                  </h2>
                  <p className="text-ocean-lighter">
                    {t('services.inDevelopment.description')}
                  </p>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Services;