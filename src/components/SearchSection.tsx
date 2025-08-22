// components/SearchSection.tsx

'use client';

import { useRef, useCallback } from 'react';
import type { GeoLocation } from '@/types/weather';
import SearchForm from '@/components/SearchForm';
import FavoritesBar from '@/components/FavoritesBar';
import { useWeather } from '@/context/WeatherContext';
import { useUnits } from '@/context/UnitsContext';

// SearchSection component to handle city search and display favorites
export default function SearchSection() {
  const { state, fetchAndSetWeather } = useWeather();
  const { unit } = useUnits();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleCitySelect = useCallback((city: GeoLocation) => {
    fetchAndSetWeather(city, unit);
  }, [fetchAndSetWeather, unit]);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation: GeoLocation = { id: Date.now(), name: 'Current Location', country: '', latitude, longitude };
        fetchAndSetWeather(currentLocation, unit);
      }
    );
  }, [fetchAndSetWeather, unit]);

  return (
    <div className="w-full max-w-md space-y-4">
      <SearchForm ref={searchInputRef} onCitySelect={handleCitySelect} onGetLocation={handleGetLocation} isLoading={state.isLoading} />
      <FavoritesBar favorites={state.favorites} onSelect={handleCitySelect} isLoading={state.isLoading} />
    </div>
  );
}