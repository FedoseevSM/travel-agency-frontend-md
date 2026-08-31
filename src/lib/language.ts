import axios from 'axios';

interface GeoResponse {
  country_code: string;
}

export async function detectUserLanguage(): Promise<string> {
  try {
    // Try to get language from localStorage first
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      return savedLanguage;
    }

    // Try to detect country from IP
    const response = await axios.get<GeoResponse>('https://ipapi.co/json/');
    const countryCode = response.data.country_code.toLowerCase();

    // Map country codes to languages
    const languageMap: Record<string, string> = {
      ru: 'ru',
      by: 'ru',
      kz: 'ru',
      ua: 'ru'
    };

    return languageMap[countryCode] || 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English
  }
}