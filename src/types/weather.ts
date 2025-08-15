// --- Geocoding API Types (for city search) ---

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // e.g., State or Province
}

export interface GeocodingApiResponse {
  results?: GeoLocation[];
}


// --- Weather API Types (Open-Meteo) ---

export interface WeatherData {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m: number;
    apparent_temperature: number; // "Feels like"
    is_day: number; // 1 for day, 0 for night
    wind_speed_10m: number;
    european_aqi: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface AirQualityData {
  current: {
    european_aqi: number;
  };
}