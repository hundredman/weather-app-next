import { WeatherData } from "@/types/weather";
import { getWeatherInfo } from "@/utils/weatherUtils";
import { FiWind, FiDroplet, FiSmile } from 'react-icons/fi';
import FavoriteButton from "./FavoriteButton";
import HourlyChart from "./HourlyChart";

interface WeatherDisplayProps {
  city: string;
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * Displays the main weather information, including current conditions,
 * an hourly forecast chart, and a 7-day weekly forecast.
 */
export default function WeatherDisplay({ city, weather, isFavorite, onToggleFavorite }: WeatherDisplayProps) {
  // Determine if it's currently day or night to select the correct icon set.
  const isDay = weather.current.is_day === 1;
  // Get the appropriate weather icon and description based on the current weather code.
  const { icon: WeatherIcon, description } = getWeatherInfo(weather.current.weather_code, isDay);

  return (
    <div className="w-full max-w-4xl text-white">
      {/* Section: Current Weather Conditions */}
      <div className="relative rounded-2xl bg-white/20 p-8 shadow-lg backdrop-blur-md">
        <FavoriteButton isFavorite={isFavorite} onClick={onToggleFavorite} />
        
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold capitalize sm:text-4xl">{city}</h2>
            <p className="text-lg">{description}</p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <WeatherIcon size={100} />
            <div>
              <p className="text-6xl font-bold">{Math.round(weather.current.temperature_2m)}°</p>
            </div>
          </div>
        </div>

        {/* Additional current weather details */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 text-sm sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <FiSmile size={20} />
            <div>
              <p className="text-white/80">Feels like</p>
              <p className="font-bold">{Math.round(weather.current.apparent_temperature)}°</p>
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
        </div>
      </div>

      {/* Section: Hourly Forecast Chart */}
      <HourlyChart hourlyData={weather.hourly} />
      
      {/* Section: 7-Day Weekly Forecast */}
      <div className="mt-8 rounded-2xl bg-white/20 p-6 shadow-lg backdrop-blur-md">
        <h3 className="mb-4 text-lg font-bold">Weekly Forecast</h3>
        <ul className="space-y-4">
          {weather.daily.time.map((date, index) => {
            // Get weather info for each day in the forecast.
            const dayWeather = getWeatherInfo(weather.daily.weather_code[index]);
            const DayIcon = dayWeather.icon;
            
            return (
              <li key={date} className="flex items-center justify-between">
                <p className="w-1/4 font-semibold">
                  {/* Format the date to display the short day of the week (e.g., "Mon"). */}
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <DayIcon size={28} className="w-1/4 text-center"/>
                <p className="w-1/4 text-center">{dayWeather.description}</p>
                <p className="w-1/4 text-right font-semibold">
                  {/* Display the min and max temperatures for the day. */}
                  {Math.round(weather.daily.temperature_2m_min[index])}° / {Math.round(weather.daily.temperature_2m_max[index])}°
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}