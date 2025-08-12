import type { WeatherData, GeoLocation } from '@/types/weather';

interface GeocodingApiResponse {
  results?: GeoLocation[];
}

// Fetches a list of cities from the Geocoding API.
export const searchCities = async (query: string): Promise<GeoLocation[]> => {
  if (query.length < 2) return [];

  // Set API language based on query (KO/EN).
  const containsKorean = /[가-힣]/.test(query);
  const language = containsKorean ? 'ko' : 'en';

  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: language,
    format: 'json',
  });

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch city data.');
    }
    const data: GeocodingApiResponse = await response.json();
    return data.results || [];
  } catch (err) {
    console.error("searchCities Error:", err);
    throw new Error('An error occurred while searching for cities.');
  }
};


// Fetches weather data for a given location (latitude and longitude).
export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    hourly: 'temperature_2m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data.');
    }
    return await response.json();
  } catch (err) {
    console.error("fetchWeather Error:", err);
    throw new Error('An error occurred while fetching weather data.');
  }
};