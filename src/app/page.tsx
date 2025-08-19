'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useUnits } from '@/context/UnitsContext';
import type { WeatherData, GeoLocation } from '@/types/weather';
import { fetchWeather, fetchAirQuality } from '@/services/weatherService';
import { getBackgroundColor } from '@/utils/weatherUtils';
import SearchForm from '@/components/SearchForm';
import FavoritesBar from '@/components/FavoritesBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import ThemeToggle from '@/components/ThemeToggle';

const FAVORITES_KEY = 'weatherAppFavorites';
const INITIAL_BG = 'from-gray-400 to-gray-200';

/**
 * The main page component for the Weather App.
 * It manages all application state, handles data fetching,
 * and assembles the UI components.
 */
export default function Home() {
  // --- Core Application State ---
  const { resolvedTheme } = useTheme();
  const { unit } = useUnits();
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [localTime, setLocalTime] = useState<Date | null>(null);
  
  // --- UI and Local Storage State ---
  const [bgClasses, setBgClasses] = useState([INITIAL_BG, INITIAL_BG]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
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
  }, []); // This effect should only run once on initial mount.

  // Update the background gradient when weather or theme changes.
  useEffect(() => {
    if (weather) {
      const code = weather.current.weather_code;
      const isDay = weather.current.is_day === 1;
      const isDarkMode = resolvedTheme === 'dark';
      
      const newBgClass = getBackgroundColor(code, isDay, isDarkMode);
      const currentBgClass = bgClasses[activeBgIndex];

      if (newBgClass !== currentBgClass) {
        const nextBgIndex = (activeBgIndex + 1) % 2;
        const newBgClasses = [...bgClasses];
        newBgClasses[nextBgIndex] = newBgClass;
        
        setBgClasses(newBgClasses);
        setActiveBgIndex(nextBgIndex);
      }
    }
  }, [weather, resolvedTheme]);

  // Updates the displayed local time every second when timezone is available.
  useEffect(() => {
    if (!weather?.timezone) return;

    const intervalId = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [weather?.timezone]);

  // --- Event Handlers and Logic ---

  // A refactored helper function to handle all weather/AQI fetching and state updates.
  const fetchAndSetWeather = useCallback(async (location: GeoLocation) => {
    setIsLoading(true);
    setError('');
    setWeather(null);
    setLocalTime(null);
    try {
      const [weatherData, airQualityData] = await Promise.all([
        fetchWeather(location.latitude, location.longitude, unit),
        fetchAirQuality(location.latitude, location.longitude),
      ]);

      const combinedData = {
        ...weatherData,
        current: { ...weatherData.current, european_aqi: airQualityData.current.european_aqi },
      };

      setWeather(combinedData);
      setSelectedCity(location);
      setLocalTime(new Date());

      if (location.name !== 'Current Location') {
        localStorage.setItem('lastCity', JSON.stringify(location));
      }
      searchInputRef.current?.blur();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
   }, [unit]);

  const handleCitySelect = useCallback((city: GeoLocation) => {
    fetchAndSetWeather(city);
  }, [fetchAndSetWeather]);
  
  const handleGetLocation = useCallback(() => {
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
  }, [fetchAndSetWeather]);
  
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

  useEffect(() => {
    if (selectedCity) {
      fetchAndSetWeather(selectedCity);
    }
  }, [unit, selectedCity, fetchAndSetWeather]);

  return (
    <main className="relative z-0 flex min-h-screen flex-col items-center gap-8 p-6 sm:p-12">
      <div className="fixed inset-0 -z-10">
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${
            activeBgIndex === 0 ? 'opacity-100' : 'opacity-0'
          } ${bgClasses[0]}`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${
            activeBgIndex === 1 ? 'opacity-100' : 'opacity-0'
          } ${bgClasses[1]}`}
        />
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-white text-shadow-md sm:text-4xl">
          Weather App
        </h1>
        <ThemeToggle />
      </div>
      
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
          localTime={localTime}
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