import React from 'react';
import { ServiceCategory } from '@/types/service';
import { Compass, Moon, Ticket, Anchor, MapPin, Plane, Users } from 'lucide-react';

interface ServiceFiltersProps {
  selectedCategories: ServiceCategory[];
  onCategoryChange: (category: ServiceCategory) => void;
}

interface FilterGroup {
  title: string;
  icon: React.ElementType;
  filters: { value: ServiceCategory; label: string }[];
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const filterGroups: FilterGroup[] = [
    {
      title: 'Морские экскурсии',
      icon: Anchor,
      filters: [
        { value: 'sea-oneday', label: 'Однодневные' },
        { value: 'sea-overnight', label: 'С ночевкой' },
      ]
    },
    {
      title: 'Наземные экскурсии',
      icon: MapPin,
      filters: [
        { value: 'land-oneday', label: 'Однодневные' },
        { value: 'land-overnight', label: 'С ночевкой' },
      ]
    },
    {
      title: 'Авиаэкскурсии',
      icon: Plane,
      filters: [
        { value: 'air-oneday', label: 'Однодневные' },
        { value: 'air-overnight', label: 'С ночевкой' },
      ]
    },
    {
      title: 'Вечерние шоу',
      icon: Moon,
      filters: [
        { value: 'evening-show', label: 'Вечерние шоу' },
      ]
    },
    {
      title: 'Приватные туры',
      icon: Users,
      filters: [
        { value: 'private', label: 'Приватные' },
      ]
    }
  ];

  return (
    <div>
      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-2 mb-2">
              <group.icon className="h-4 w-4 text-ocean-light" />
              <p className="text-ocean-light text-sm">{group.title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.filters.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onCategoryChange(value)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategories.includes(value)
                      ? 'bg-ocean-deep text-white'
                      : 'bg-white/10 text-ocean-light hover:bg-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};