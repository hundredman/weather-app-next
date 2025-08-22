// components/ContentDisplay.tsx

'use client';

import WeatherDisplay from '@/components/WeatherDisplay';
import { useWeather } from '@/context/WeatherContext';
import type { GeoLocation } from '@/types/weather';

// ContentDisplay component to show weather information or loading/error states
export default function ContentDisplay() {
  const { state, dispatch } = useWeather();
  const { isLoading, error, weather, selectedCity, localTime, favorites } = state;

  const isCityFavorite = (city: GeoLocation | null): boolean => {
    return !!city && favorites.some((fav: GeoLocation) => fav.id === city.id);
  };
  const handleToggleFavorite = () => dispatch({ type: 'TOGGLE_FAVORITE' });

  if (isLoading) {
    return <p className="text-center text-white/80">Loading weather data...</p>;
  }
  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-red-500/50 p-4 text-center text-white">
        <p>{error}</p>
      </div>
    );
  }
  if (weather && selectedCity) {
    return (
      <WeatherDisplay
        city={selectedCity.name}
        weather={weather}
        isFavorite={isCityFavorite(selectedCity)}
        onToggleFavorite={handleToggleFavorite}
        localTime={localTime}
      />
    );
  }
  return (
    <div className="text-center text-white/80">
      <p>Search for a city or use your current location to get the weather forecast.</p>
    </div>
  );
}