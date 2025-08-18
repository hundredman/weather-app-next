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
/**
 * Returns a dynamic background gradient class based on weather, time of day, and theme.
 * @param code - The WMO weather code.
 * @param isDay - A boolean indicating if it's daytime (true) or nighttime (false).
 * @param isDarkMode - A boolean indicating if dark mode is active.
 * @returns A string of Tailwind CSS gradient classes.
 */
export const getBackgroundColor = (code: number, isDay: boolean, isDarkMode: boolean): string => {
  if (isDarkMode) {
    // --- DARK MODE GRADIENTS ---
    // In dark mode, we use a more subdued, darker palette.
    switch (code) {
      case 0: // Clear
        return 'from-slate-900 to-blue-950'; // Deep night sky
      case 1: case 2: case 3: // Cloudy
        return 'from-slate-800 to-slate-700';
      case 45: case 48: // Fog
        return 'from-slate-700 to-gray-800';
      case 61: case 63: case 65: // Rain
      case 80: case 81: case 82:
        return 'from-slate-900 to-gray-900'; // Stormy night
      case 71: case 73: case 75: // Snow
        return 'from-slate-700 to-slate-600';
      case 95: case 96: case 99: // Thunderstorm
        return 'from-gray-950 to-black';
      default:
        return 'from-slate-900 to-slate-800';
    }
  } else {
    // --- LIGHT MODE GRADIENTS ---
    // In light mode, we use vibrant colors that differ between day and night.
    if (isDay) {
      // Daytime Light Mode
      switch (code) {
        case 0: return 'from-sky-400 to-blue-500'; // Bright sunny day
        case 1: case 2: case 3: return 'from-sky-300 to-gray-400';
        case 45: case 48: return 'from-gray-400 to-gray-300';
        case 61: case 63: case 65: case 80: case 81: case 82: return 'from-gray-500 to-slate-600';
        case 71: case 73: case 75: return 'from-slate-300 to-slate-100';
        case 95: case 96: case 99: return 'from-slate-600 to-gray-700';
        default: return 'from-sky-400 to-gray-500';
      }
    } else {
      // Nighttime Light Mode (still part of the light theme, but with night colors)
      switch (code) {
        case 0: return 'from-indigo-800 to-slate-900'; // Clear night
        case 1: case 2: case 3: return 'from-indigo-700 to-slate-800';
        default: return 'from-gray-700 to-gray-900'; // Default night
      }
    }
  }
};

// Maps numerical AQI values to qualitative air quality descriptions
export const getAqiInfo = (aqi: number): string => {
  if (aqi <= 20) return 'Good';
  if (aqi <= 40) return 'Fair';
  if (aqi <= 60) return 'Moderate';
  if (aqi <= 80) return 'Poor';
  if (aqi <= 100) return 'Very Poor';
  return 'Extremely Poor';
};
