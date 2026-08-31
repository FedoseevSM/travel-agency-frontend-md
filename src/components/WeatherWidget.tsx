import React from 'react';
import { Sun, Wind } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Phuket, Thailand (ภูเก็ต)</h3>
          <div className="flex items-center mt-1">
            <Sun className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="text-2xl font-bold">27°C</span>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <Wind className="h-4 w-4 text-teal-600 mr-1" />
            <span className="text-sm text-gray-600">5.8 knots NE</span>
          </div>
        </div>
      </div>
    </div>
  );
};