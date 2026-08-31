import React from 'react';
import { Service, PricingOption } from '@/types/service';

interface BookingSidebarProps {
  service: Service;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  adults: number;
  setAdults: (count: number) => void;
  children: number;
  setChildren: (count: number) => void;
  onBookingClick: () => void;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  service,
  selectedDate,
  setSelectedDate,
  adults,
  setAdults,
  children,
  setChildren,
  onBookingClick
}) => {
  const [selectedOption, setSelectedOption] = React.useState<PricingOption | null>(
    service.pricingOptions?.[0] || null
  );

  const currentPricing = selectedOption || {
    price: {
      adult: service.price.adult,
      child: service.price.child,
      currency: service.price.currency
    }
  };

  const totalPrice = (adults * currentPricing.price.adult) + (children * currentPricing.price.child);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 sticky top-24">
      <h3 className="text-2xl font-bold text-white mb-6">Забронировать</h3>
      
      {/* Pricing Options */}
      {service.pricingOptions && service.pricingOptions.length > 0 && (
        <div className="mb-6">
          <label className="block text-ocean-light text-sm mb-2">Выберите вариант</label>
          <div className="space-y-2">
            {service.pricingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option)}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  selectedOption?.id === option.id
                    ? 'bg-ocean-deep text-white'
                    : 'bg-white/10 text-ocean-light hover:bg-white/20'
                }`}
              >
                <div className="font-medium mb-1">{option.name}</div>
                {option.description && (
                  <div className="text-sm opacity-80">{option.description}</div>
                )}
                <div className="mt-2 flex justify-between text-sm">
                  <span>Взрослый: {option.price.adult} {option.price.currency}</span>
                  <span>Детский: {option.price.child} {option.price.currency}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-ocean-light text-sm mb-2">Дата</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-4 py-2
                   text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2
                   focus:ring-ocean-deep focus:border-transparent"
        />
      </div>

      {/* Participants */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-ocean-light text-sm mb-2">Взрослые</label>
          <div className="flex items-center">
            <button
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
            >-</button>
            <span className="mx-4 text-white min-w-[2rem] text-center">{adults}</span>
            <button
              onClick={() => setAdults(adults + 1)}
              className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
            >+</button>
          </div>
        </div>

        <div>
          <label className="block text-ocean-light text-sm mb-2">Дети</label>
          <div className="flex items-center">
            <button
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
            >-</button>
            <span className="mx-4 text-white min-w-[2rem] text-center">{children}</span>
            <button
              onClick={() => setChildren(children + 1)}
              className="bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20"
            >+</button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="flex justify-between text-ocean-light mb-2">
          <span>Взрослые ({adults})</span>
          <span>{(adults * currentPricing.price.adult).toLocaleString()} {currentPricing.price.currency}</span>
        </div>
        <div className="flex justify-between text-ocean-light mb-4">
          <span>Дети ({children})</span>
          <span>{(children * currentPricing.price.child).toLocaleString()} {currentPricing.price.currency}</span>
        </div>
        <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10">
          <span>Итого</span>
          <span>{totalPrice.toLocaleString()} {currentPricing.price.currency}</span>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={onBookingClick}
        disabled={!selectedDate}
        className="w-full bg-ocean-deep text-white font-semibold rounded-lg px-6 py-3
                 hover:bg-ocean-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Забронировать
      </button>
    </div>
  );
};