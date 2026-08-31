import React, { useState, useEffect } from 'react';
import { ServiceGrid } from './ServiceGrid';
import { ServiceFilters } from './ServiceFilters';
import { LocationFilter } from './LocationFilter';
import { SearchBar } from './SearchBar';
import { PriceFilter } from './PriceFilter';
import { Pagination } from './Pagination';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceCategory, ServiceLocation, ServiceCity } from '@/types/service';
import { getServices } from '@/lib/services';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

interface ServicesSectionProps {
  showAll?: boolean;
  className?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  showAll = false, 
  className = '' 
}) => {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ServiceLocation | null>(null);
  const [selectedCity, setSelectedCity] = useState<ServiceCity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedMinPrice, setSelectedMinPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(1000000);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  
  // State for individual filter visibility
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const services = await getServices();
        const prices = services.map(s => s.price.amount);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(min);
        setMaxPrice(max);
        setSelectedMinPrice(min);
        setSelectedMaxPrice(max);
        setTotalServices(services.length);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: ServiceCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setSelectedMinPrice(min);
    setSelectedMaxPrice(max);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalServices / ITEMS_PER_PAGE);

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAll && (
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">{t('home.services.title')}</h2>
            <Link 
              to="/services"
              className="inline-flex items-center text-teal-200 hover:text-white transition-colors"
            >
              {t('home.services.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
        
        {showAll && (
          <>
            <div className="mb-8">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-6 py-3 bg-ocean-deep/80 hover:bg-ocean-deep text-white rounded-lg transition-colors text-lg"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
                  {showFilters ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-6 mb-8">
                {/* Location Filter */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={() => setShowLocationFilter(!showLocationFilter)}
                  >
                    <h3 className="text-xl font-semibold text-white">Локация</h3>
                    {showLocationFilter ? <ChevronUp className="h-5 w-5 text-ocean-light" /> : <ChevronDown className="h-5 w-5 text-ocean-light" />}
                  </div>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showLocationFilter ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <LocationFilter 
                      selectedLocation={selectedLocation}
                      selectedCity={selectedCity}
                      onLocationChange={setSelectedLocation}
                      onCityChange={setSelectedCity}
                    />
                  </div>
                </div>
                
                {/* Price Filter */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={() => setShowPriceFilter(!showPriceFilter)}
                  >
                    <h3 className="text-xl font-semibold text-white">Стоимость</h3>
                    {showPriceFilter ? <ChevronUp className="h-5 w-5 text-ocean-light" /> : <ChevronDown className="h-5 w-5 text-ocean-light" />}
                  </div>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showPriceFilter ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <PriceFilter
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      selectedMinPrice={selectedMinPrice}
                      selectedMaxPrice={selectedMaxPrice}
                      onPriceChange={handlePriceChange}
                    />
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  >
                    <h3 className="text-xl font-semibold text-white">Тип экскурсии</h3>
                    {showCategoryFilter ? <ChevronUp className="h-5 w-5 text-ocean-light" /> : <ChevronDown className="h-5 w-5 text-ocean-light" />}
                  </div>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showCategoryFilter ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <ServiceFilters 
                      selectedCategories={selectedCategories}
                      onCategoryChange={handleCategoryChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        <ServiceGrid 
          limit={showAll ? undefined : 6} 
          selectedCategories={selectedCategories}
          selectedLocation={selectedLocation}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          selectedMinPrice={selectedMinPrice}
          selectedMaxPrice={selectedMaxPrice}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        {showAll && totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
};