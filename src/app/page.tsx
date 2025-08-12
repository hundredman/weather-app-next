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
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [bgClass, setBgClass] = useState<string>('from-gray-400 to-gray-200');
  const [favorites, setFavorites] = useState<GeoLocation[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Add 'Enter' key to focus search input ---
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // 1. Check if the pressed key is 'Enter'.
      // 2. Execute only if the event target is not 'INPUT' or 'BUTTON' to avoid conflicts with existing input/button actions.
      if (
        event.key === 'Enter' &&
        (event.target as HTMLElement).tagName !== 'INPUT' &&
        (event.target as HTMLElement).tagName !== 'BUTTON'
      ) {
        // Prevent default action (e.g., form submission).
        event.preventDefault();
        // Focus the search input.
        searchInputRef.current?.focus();
      }
    };

    // Add event listener to document when component mounts.
    document.addEventListener('keydown', handleGlobalKeyDown);

    // Remove event listener when component unmounts to prevent memory leaks.
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []); // Pass an empty array to run only once when the component first renders.


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

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isCityFavorite = (city: GeoLocation | null): boolean => {
    if (!city) return false;
    return favorites.some(fav => fav.id === city.id);
  };

  const handleToggleFavorite = () => {
    if (!selectedCity) return;

    if (isCityFavorite(selectedCity)) {
      setFavorites(favorites.filter(fav => fav.id !== selectedCity.id));
    } else {
      setFavorites([...favorites, selectedCity]);
    }
  };

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
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (weather) {
      setBgClass(getBackgroundColor(weather.current.weather_code));
    }
  }, [weather]);

  const handleCitySelect = async (city: GeoLocation) => {
    setIsLoading(true);
    setError('');
    setWeather(null);
    try {
      const weatherData = await fetchWeather(city.latitude, city.longitude);
      setWeather(weatherData);
      setSelectedCity(city);
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

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setError('');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherData = await fetchWeather(latitude, longitude);
            setWeather(weatherData);
            const currentLocation: GeoLocation = {
              id: Date.now(), name: 'Current Location', country: '', latitude, longitude
            };
            setSelectedCity(currentLocation);
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
    } else {
      setError('Geolocation is not supported by this browser.');
    }
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