import React from 'react';
import { ServiceLocation, ServiceCity } from '@/types/service';
import { MapPin } from 'lucide-react';

interface LocationFilterProps {
  selectedLocation: ServiceLocation | null;
  selectedCity: ServiceCity | null;
  onLocationChange: (location: ServiceLocation | null) => void;
  onCityChange: (city: ServiceCity | null) => void;
}

const locations: { id: ServiceLocation; label: string; cities: { id: ServiceCity; label: string }[] }[] = [
  {
    id: 'thailand',
    label: 'Таиланд',
    cities: [
      { id: 'phuket', label: 'Пхукет' },
      { id: 'bangkok', label: 'Бангкок' }
    ]
  },
  {
    id: 'singapore',
    label: 'Сингапур',
    cities: [
      { id: 'singapore', label: 'Сингапур' }
    ]
  },
  {
    id: 'malaysia',
    label: 'Малайзия',
    cities: [
      { id: 'kualalumpur', label: 'Куала-Лумпур' }
    ]
  },
  {
    id: 'cambodia',
    label: 'Камбоджа',
    cities: [
      { id: 'siemreap', label: 'Сием Рип' }
    ]
  },
  {
    id: 'hongkong',
    label: 'Гонконг',
    cities: [
      { id: 'hongkong', label: 'Гонконг' }
    ]
  },
  {
    id: 'indonesia',
    label: 'Индонезия',
    cities: [
      { id: 'bali', label: 'Бали' }
    ]
  }
];

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation,
  selectedCity,
  onLocationChange,
  onCityChange
}) => {
  const availableCities = selectedLocation 
    ? locations.find(l => l.id === selectedLocation)?.cities || []
    : [];

  return (
    <div>
      <div className="space-y-4">
        <div>
          <p className="text-ocean-light text-sm mb-2">Страна</p>
          <div className="flex flex-wrap gap-2">
            {locations.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  if (selectedLocation === id) {
                    onLocationChange(null);
                    onCityChange(null);
                  } else {
                    onLocationChange(id);
                    onCityChange(null);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedLocation === id
                    ? 'bg-ocean-deep text-white'
                    : 'bg-white/10 text-ocean-light hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {selectedLocation && availableCities.length > 0 && (
          <div>
            <p className="text-ocean-light text-sm mb-2">Город</p>
            <div className="flex flex-wrap gap-2">
              {availableCities.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onCityChange(selectedCity === id ? null : id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCity === id
                      ? 'bg-ocean-deep text-white'
                      : 'bg-white/10 text-ocean-light hover:bg-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};