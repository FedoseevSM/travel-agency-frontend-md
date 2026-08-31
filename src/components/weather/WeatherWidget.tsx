import React, { useEffect, useState } from 'react';
import { Sun, Wind, Cloud, CloudRain } from 'lucide-react';
import { API_CONFIG } from '../../config/api';

interface WeatherData {
  temp: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Use default weather data instead of making API call
        setWeather({
          temp: 28,
          windSpeed: 5,
          windDirection: 'NE',
          condition: 'sunny'
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading || !weather) {
    return null;
  }

  return (
    <div className="absolute top-24 right-4 lg:right-8 z-40 hidden md:block z-[1]">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Phuket, Thailand (ภูเก็ต)</h3>
            <div className="flex items-center mt-1">
              {weather.condition.includes('sunny') || weather.condition.includes('clear') ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : weather.condition.includes('cloud') ? (
                <Cloud className="h-5 w-5 text-gray-400" />
              ) : weather.condition.includes('rain') ? (
                <CloudRain className="h-5 w-5 text-blue-400" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-2xl font-bold ml-1">
                {weather.temp}°C
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <Wind className="h-4 w-4 text-teal-600 mr-1" />
              <span className="text-sm text-gray-600">
                {weather.windSpeed} knots {weather.windDirection}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};