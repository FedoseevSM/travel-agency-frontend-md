import React from 'react';
import { ServiceCategory } from '@/types/service';
import { Compass, Car, Home, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategorySelectorProps {
  activeCategory: ServiceCategory;
  onCategoryChange: (category: ServiceCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation();

  const categories = [
    { id: 'excursions', label: t('services.categories.excursions'), icon: Compass },
    { id: 'auto', label: t('services.categories.auto'), icon: Car },
    { id: 'rent', label: t('services.categories.rent'), icon: Home },
    { id: 'shopping', label: t('services.categories.shopping'), icon: ShoppingBag },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {categories.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onCategoryChange(id as ServiceCategory)}
          className={`
            relative group flex flex-col items-center p-6 rounded-xl transition-all duration-300
            ${activeCategory === id
              ? 'bg-ocean-deep text-white shadow-lg shadow-ocean-deep/20'
              : 'bg-white/5 hover:bg-white/10 text-ocean-light hover:text-white hover:shadow-lg hover:shadow-white/5'
            }
          `}
        >
          <Icon className={`
            h-8 w-8 mb-3 transition-transform duration-300
            ${activeCategory === id ? 'scale-110' : 'group-hover:scale-110'}
          `} />
          <span className="text-sm font-medium">{label}</span>
          {activeCategory === id && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-ocean-deep rotate-45" />
          )}
        </button>
      ))}
    </div>
  );
};