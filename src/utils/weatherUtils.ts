import { IconType } from 'react-icons';
import {
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloudy,
  WiFog, WiDayShowers, WiNightAltShowers, WiDayRain, WiNightAltRain,
  WiRain, WiSnow, WiThunderstorm, WiSleet, WiDayHaze
} from 'react-icons/wi';

// Maps WMO weather codes to icons and English descriptions
export const getWeatherInfo = (code: number, isDay: boolean = true): { icon: IconType; description: string } => {
  switch (code) {
    case 0: return { icon: isDay ? WiDaySunny : WiNightClear, description: 'Clear sky' };
    case 1: return { icon: isDay ? WiDayCloudy : WiNightAltCloudy, description: 'Mainly clear' };
    case 2: return { icon: WiCloudy, description: 'Partly cloudy' };
    case 3: return { icon: WiCloudy, description: 'Overcast' };
    case 45: case 48: return { icon: WiFog, description: 'Fog' };
    case 51: case 53: case 55: return { icon: isDay ? WiDayShowers : WiNightAltShowers, description: 'Drizzle' };
    case 61: case 63: case 65: return { icon: isDay ? WiDayRain : WiNightAltRain, description: 'Rain' };
    case 66: case 67: return { icon: WiSleet, description: 'Freezing Rain' };
    case 71: case 73: case 75: return { icon: WiSnow, description: 'Snow fall' };
    case 77: return { icon: WiSnow, description: 'Snow grains' };
    case 80: case 81: case 82: return { icon: WiRain, description: 'Rain showers' };
    case 85: case 86: return { icon: WiSnow, description: 'Snow showers' };
    case 95: case 96: case 99: return { icon: WiThunderstorm, description: 'Thunderstorm' };
    default: return { icon: isDay ? WiDayHaze : WiFog, description: 'Unknown' };
  }
};

// Returns a dynamic background class based on the weather condition
export const getBackgroundColor = (code: number): string => {
    if (code <= 1) return 'from-blue-400 to-blue-200'; // Clear
    if (code <= 3) return 'from-sky-500 to-sky-300'; // Cloudy
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'from-gray-600 to-gray-400'; // Rain
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'from-slate-300 to-slate-100'; // Snow
    if (code >= 95) return 'from-gray-800 to-gray-600'; // Thunderstorm
    if (code >= 45 && code <= 48) return 'from-gray-400 to-gray-300'; // Fog
    return 'from-gray-400 to-gray-200';
}

// Maps numerical AQI values to qualitative air quality descriptions
export const getAqiInfo = (aqi: number): string => {
  if (aqi <= 20) return 'Good';
  if (aqi <= 40) return 'Fair';
  if (aqi <= 60) return 'Moderate';
  if (aqi <= 80) return 'Poor';
  if (aqi <= 100) return 'Very Poor';
  return 'Extremely Poor';
};
