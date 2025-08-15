'use client';

import { useState, useEffect, useRef } from 'react';
import type { WeatherData, GeoLocation } from '@/types/weather';
import { fetchWeather, fetchAirQuality } from '@/services/weatherService';
import { getBackgroundColor } from '@/utils/weatherUtils';
import SearchForm from '@/components/SearchForm';
import FavoritesBar from '@/components/FavoritesBar';
import WeatherDisplay from '@/components/WeatherDisplay';

const FAVORITES_KEY = 'weatherAppFavorites';

/**
 * The main page component for the Weather App.
 * It manages all application state, handles data fetching,
 * and assembles the UI components.
 */
export default function Home() {
  // --- Core Application State ---
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // --- UI and Local Storage State ---
  const [bgClass, setBgClass] = useState<string>('from-gray-400 to-gray-200');
  const [favorites, setFavorites] = useState<GeoLocation[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Side Effects (useEffect Hooks) ---

  // Focuses the search input on 'Enter' key press for better accessibility.
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === 'Enter' && target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Manages persistence of favorites to and from localStorage.
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Restores the last session by loading the last searched city.
  useEffect(() => {
    const lastSearchedCity = localStorage.getItem('lastCity');
    if (lastSearchedCity) {
      try {
        const city: GeoLocation = JSON.parse(lastSearchedCity);
        fetchAndSetWeather(city); // Use the refactored handler
      } catch (e) {
        console.error("Failed to parse last city from localStorage", e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false); // Stop initial loading if there's no last city.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This effect should only run once on initial mount.

  // Updates the background gradient whenever the weather data changes.
  useEffect(() => {
    if (weather) {
      setBgClass(getBackgroundColor(weather.current.weather_code));
    }
  }, [weather]);

  // --- Event Handlers and Logic ---

  // A refactored helper function to handle all weather/AQI fetching and state updates.
  const fetchAndSetWeather = async (location: GeoLocation) => {
    setIsLoading(true);
    setError('');
    setWeather(null);
    try {
      const [weatherData, airQualityData] = await Promise.all([
        fetchWeather(location.latitude, location.longitude),
        fetchAirQuality(location.latitude, location.longitude),
      ]);

      const combinedData = {
        ...weatherData,
        current: { ...weatherData.current, european_aqi: airQualityData.current.european_aqi },
      };

      setWeather(combinedData);
      setSelectedCity(location);

      if (location.name !== 'Current Location') {
        localStorage.setItem('lastCity', JSON.stringify(location));
      }
      searchInputRef.current?.blur();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: GeoLocation) => {
    fetchAndSetWeather(city);
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation: GeoLocation = { id: Date.now(), name: 'Current Location', country: '', latitude, longitude };
        fetchAndSetWeather(currentLocation);
      },
      () => {
        setError('Failed to get location. Please check your browser settings.');
        setIsLoading(false);
      }
    );
  };
  
  const isCityFavorite = (city: GeoLocation | null): boolean => {
    return !!city && favorites.some(fav => fav.id === city.id);
  };

  const handleToggleFavorite = () => {
    if (!selectedCity) return;
    setFavorites(prev =>
      isCityFavorite(selectedCity)
        ? prev.filter(fav => fav.id !== selectedCity.id)
        : [...prev, selectedCity]
    );
  };

  return (
    <main className={`flex min-h-screen flex-col items-center gap-8 p-6 transition-all duration-500 sm:p-12 bg-gradient-to-br ${bgClass}`}>
      <h1 className="text-3xl font-bold text-white text-shadow-md sm:text-4xl">
        Weather App
      </h1>
      
      <div className="w-full max-w-md space-y-4">
        <SearchForm 
          ref={searchInputRef}
          onCitySelect={handleCitySelect} 
          onGetLocation={handleGetLocation} 
          isLoading={isLoading} 
        />
        <FavoritesBar favorites={favorites} onSelect={handleCitySelect} isLoading={isLoading} />
      </div>
      
      {/* Conditional UI Rendering */}
      {isLoading && <p className="text-white/80">Loading weather data...</p>}
      
      {error && (
        <div className="rounded-lg bg-red-500/50 p-4 text-center text-white">
          <p>{error}</p>
        </div>
      )}

      {weather && selectedCity && !isLoading && (
        <WeatherDisplay 
          city={selectedCity.name} 
          weather={weather}
          isFavorite={isCityFavorite(selectedCity)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {!weather && !isLoading && !error && (
        <div className="text-center text-white/80">
          <p>Search for a city or use your current location to get the weather forecast.</p>
        </div>
      )}
    </main>
  );
}