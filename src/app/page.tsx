'use client';

import { useState, useEffect, useRef } from 'react';
import type { WeatherData, GeoLocation } from '@/types/weather';
import { fetchWeather } from '@/services/weatherService';
import { getBackgroundColor } from '@/utils/weatherUtils';
import SearchForm from '@/components/SearchForm';
import FavoritesBar from '@/components/FavoritesBar';
import WeatherDisplay from '@/components/WeatherDisplay';

const FAVORITES_KEY = 'weatherAppFavorites';

export default function Home() {
  // Core state for the application
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // State for UI and local storage features
  const [bgClass, setBgClass] = useState<string>('from-gray-400 to-gray-200');
  const [favorites, setFavorites] = useState<GeoLocation[]>([]);

  // Ref to control the search input element directly.
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on 'Enter' key press anywhere on the page.
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Enter' &&
        (event.target as HTMLElement).tagName !== 'INPUT' &&
        (event.target as HTMLElement).tagName !== 'BUTTON'
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Load favorites from localStorage on initial component mount.
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
    }
  }, []);

  // Persist favorites to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Load the last searched city on initial mount to restore the previous session.
  useEffect(() => {
    const lastSearchedCity = localStorage.getItem('lastCity');
    if (lastSearchedCity) {
      try {
        const city: GeoLocation = JSON.parse(lastSearchedCity);
        handleCitySelect(city);
      } catch (e) {
        console.error("Failed to parse last city from localStorage", e);
        setIsLoading(false);
      }
    } else {
      // If no last city, stop the initial loading state.
      setIsLoading(false);
    }
  }, []);

  // Update the background gradient when weather data changes.
  useEffect(() => {
    if (weather) {
      setBgClass(getBackgroundColor(weather.current.weather_code));
    }
  }, [weather]);

  // --- State Handlers ---

  const isCityFavorite = (city: GeoLocation | null): boolean => {
    if (!city) return false;
    return favorites.some(fav => fav.id === city.id);
  };

  const handleToggleFavorite = () => {
    if (!selectedCity) return;
    setFavorites(prev => 
      isCityFavorite(selectedCity)
        ? prev.filter(fav => fav.id !== selectedCity.id)
        : [...prev, selectedCity]
    );
  };

  // Fetches and displays weather when a city is selected.
  const handleCitySelect = async (city: GeoLocation) => {
    setIsLoading(true);
    setError('');
    setWeather(null);
    try {
      const weatherData = await fetchWeather(city.latitude, city.longitude);
      setWeather(weatherData);
      setSelectedCity(city);
      // Don't save "Current Location" as the last searched city.
      if (city.name !== 'Current Location') {
        localStorage.setItem('lastCity', JSON.stringify(city));
      }
      searchInputRef.current?.blur();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Gets the user's current location and fetches the weather.
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await fetchWeather(latitude, longitude);
          setWeather(weatherData);
          setSelectedCity({ id: Date.now(), name: 'Current Location', country: '', latitude, longitude });
        } catch (err: unknown) {
           if (err instanceof Error) {
             setError(err.message);
           } else {
             setError('An unknown error occurred.');
           }
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError('Failed to get location. Please check your browser settings.');
        setIsLoading(false);
      }
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
      
      {/* Display loading indicator */}
      {isLoading && <p className="text-white/80">Loading weather data...</p>}
      
      {/* Display error message */}
      {error && (
        <div className="rounded-lg bg-red-500/50 p-4 text-center text-white">
          <p>{error}</p>
        </div>
      )}

      {/* Display weather information when data is available */}
      {weather && selectedCity && !isLoading && (
        <WeatherDisplay 
          city={selectedCity.name} 
          weather={weather}
          isFavorite={isCityFavorite(selectedCity)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Display initial prompt message */}
      {!weather && !isLoading && !error && (
        <div className="text-center text-white/80">
          <p>Search for a city or use your current location to get the weather forecast.</p>
        </div>
      )}
    </main>
  );
}