// components/WeatherDisplay.tsx

import UnitToggle from './UnitToggle';
import { useUnits } from '@/context/UnitsContext';
import { WeatherData } from "@/types/weather";
import { getWeatherInfo, getAqiInfo } from "@/utils/weatherUtils";
import { FiWind, FiDroplet, FiSmile, FiFeather } from 'react-icons/fi';
import FavoriteButton from "./FavoriteButton";
import HourlyChart from "./HourlyChart";
import { UNITS } from '@/constants';

interface WeatherDisplayProps {
  city: string;
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  localTime: Date | null;
}

/**
 * Main component for displaying all weather-related information.
 * It's composed of three sections: current conditions, an hourly forecast chart,
 * and a 7-day weekly forecast.
 */
export default function WeatherDisplay({ city, weather, isFavorite, onToggleFavorite, localTime }: WeatherDisplayProps) {
  // Prepare all necessary data for rendering before the return statement.
  // This keeps the JSX clean and focused on presentation.
  const { unit } = useUnits();
  const unitSymbol = unit === UNITS.CELSIUS ? '°C' : '°F';
  const isDay = weather.current.is_day === 1;
  const { icon: WeatherIcon, description } = getWeatherInfo(weather.current.weather_code, isDay);
  const aqiText = getAqiInfo(weather.current.european_aqi);

  return (
    <div className="w-full max-w-4xl text-white">
      {/* Section: Current Weather Conditions */}
      <div className="relative rounded-2xl bg-white/20 p-8 shadow-lg backdrop-blur-md">
        <FavoriteButton isFavorite={isFavorite} onClick={onToggleFavorite} />
        
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* City and weather description */}
          <div>
            <h2 className="text-3xl font-bold capitalize sm:text-4xl">{city}</h2>
            {localTime && (
              <p className="text-lg font-light text-white/80">
                {localTime.toLocaleTimeString('en-US', {
                  timeZone: weather.timezone,
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            )}
            <p className="text-lg">{description}</p>
          </div>
          {/* Main temperature display */}
          <div className="flex items-center gap-4 text-center">
            <WeatherIcon size={100} />
            <div className="flex items-start">
              <p className="text-6xl font-bold">{Math.round(weather.current.temperature_2m)}</p>
              <span className="mt-2 text-2xl font-medium">{unitSymbol}</span>
            </div>
            <div className="absolute bottom-4 right-4">
              <UnitToggle />
            </div>
          </div>
        </div>

        {/* Additional details grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 text-sm sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <FiSmile size={20} />
            <div>
              <p className="text-white/80">Feels like</p>
              <p className="font-bold">{Math.round(weather.current.apparent_temperature)}{unitSymbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiDroplet size={20} />
            <div>
              <p className="text-white/80">Humidity</p>
              <p className="font-bold">{weather.current.relative_humidity_2m}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiWind size={20} />
            <div>
              <p className="text-white/80">Wind</p>
              <p className="font-bold">{weather.current.wind_speed_10m.toFixed(1)} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <FiFeather size={20} />
              <div>
                <p className="text-white/80">Air Quality</p>
                <p className="font-bold">{aqiText}</p>
              </div>
            </div>
        </div>
      </div>

      {/* Section: Hourly Forecast Chart */}
      <HourlyChart 
        hourlyData={weather.hourly}
        timezone={weather.timezone} 
      />
      
      {/* Section: 7-Day Weekly Forecast */}
      <div className="mt-8 rounded-2xl bg-white/20 p-6 shadow-lg backdrop-blur-md">
        <h3 className="mb-4 text-lg font-bold">Weekly Forecast</h3>
        <ul className="space-y-4">
          {weather.daily.time.map((date, index) => {
            const dayWeather = getWeatherInfo(weather.daily.weather_code[index]);
            const DayIcon = dayWeather.icon;
            
            return (
              <li key={date} className="flex items-center justify-between">
                <p className="w-1/4 font-semibold">
                  {/* Format date to display short weekday (e.g., "Fri") */}
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                {/* Weather icon for the day */}
                <div className="flex w-1/4 justify-center">
                  <DayIcon size={28} />
                </div>
                {/* Weather description for the day */}
                <p className="w-1/4 text-center">{dayWeather.description}</p>
                {/* Min and max temperatures for the day */}
                <p className="w-1/4 text-right font-semibold">
                  {Math.round(weather.daily.temperature_2m_min[index])}{unitSymbol} / {Math.round(weather.daily.temperature_2m_max[index])}{unitSymbol}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}