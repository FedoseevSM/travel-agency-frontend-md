import React, { useState, useEffect } from 'react';
import { Bitcoin } from 'lucide-react';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  selectedMinPrice: number;
  selectedMaxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  selectedMinPrice,
  selectedMaxPrice,
  onPriceChange,
}) => {
  const [localMin, setLocalMin] = useState(selectedMinPrice);
  const [localMax, setLocalMax] = useState(selectedMaxPrice);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  // Синхронизация с внешними значениями
  useEffect(() => {
    setLocalMin(selectedMinPrice);
    setLocalMax(selectedMaxPrice);
  }, [selectedMinPrice, selectedMaxPrice]);

  // Предустановленные диапазоны цен
  const priceRanges = [
    { label: 'До 1000', min: minPrice, max: 1000 },
    { label: '1000-3000', min: 1000, max: 3000 },
    { label: '3000-5000', min: 3000, max: 5000 },
    { label: 'От 5000', min: 5000, max: maxPrice },
  ];

  // Преобразование значения в процент для слайдера
  const valueToPercent = (value: number) => {
    const percent = ((value - minPrice) / (maxPrice - minPrice)) * 100;
    return Math.min(Math.max(percent, 0), 100);
  };

  // Преобразование процента в значение
  const percentToValue = (percent: number) => {
    const value = ((maxPrice - minPrice) * percent) / 100 + minPrice;
    return Math.round(Math.min(Math.max(value, minPrice), maxPrice));
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const handleSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const value = percentToValue(percent);

    if (isDragging === 'min') {
      const newMin = Math.min(value, localMax - 100);
      setLocalMin(newMin);
      onPriceChange(newMin, localMax);
    } else {
      const newMax = Math.max(value, localMin + 100);
      setLocalMax(newMax);
      onPriceChange(localMin, newMax);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging]);

  return (
    <div>
      {/* Предустановленные диапазоны */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {priceRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => {
              setLocalMin(range.min);
              setLocalMax(range.max);
              onPriceChange(range.min, range.max);
            }}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              localMin === range.min && localMax === range.max
                ? 'bg-ocean-deep text-white'
                : 'bg-white/10 text-ocean-light hover:bg-white/20'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Слайдер */}
      <div className="mb-8">
        <div
          className="relative h-2 bg-white/10 rounded-full cursor-pointer"
          onMouseMove={handleSliderChange}
          onMouseLeave={() => setIsDragging(null)}
        >
          <div
            className="absolute h-full bg-ocean-deep rounded-full"
            style={{
              left: `${valueToPercent(localMin)}%`,
              right: `${100 - valueToPercent(localMax)}%`,
            }}
          />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging('min');
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full 
                     shadow-lg cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `${valueToPercent(localMin)}%` }}
          />
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging('max');
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full 
                     shadow-lg cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `${valueToPercent(localMax)}%` }}
          />
        </div>
      </div>

      {/* Инпуты */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ocean-light mb-1">От</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => {
              const value = Math.max(minPrice, Math.min(Number(e.target.value), localMax - 100));
              setLocalMin(value);
              onPriceChange(value, localMax);
            }}
            className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-3 py-1.5 
                     text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2 
                     focus:ring-ocean-deep focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-ocean-light mb-1">До</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => {
              const value = Math.min(maxPrice, Math.max(Number(e.target.value), localMin + 100));
              setLocalMax(value);
              onPriceChange(localMin, value);
            }}
            className="w-full bg-white/10 border border-ocean-deep/20 rounded-lg px-3 py-1.5 
                     text-white placeholder-ocean-light/70 focus:outline-none focus:ring-2 
                     focus:ring-ocean-deep focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Текущий диапазон */}
      <div className="mt-4 text-center text-sm text-ocean-light">
        Выбран диапазон: {formatPrice(localMin)} - {formatPrice(localMax)} ฿
      </div>
    </div>
  );
};