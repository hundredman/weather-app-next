// context/WeatherContext.tsx

'use client';

import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect, useRef } from 'react';
import type { WeatherData, GeoLocation } from '@/types/weather';
import { fetchWeather, fetchAirQuality } from '@/services/weatherService';
import { useUnits } from './UnitsContext';
import { FAVORITES_KEY, LAST_CITY_KEY, UNITS_KEY, UNITS } from '@/constants';

// --- Type Definitions ---
type Unit = typeof UNITS[keyof typeof UNITS];

interface State {
  selectedCity: GeoLocation | null;
  weather: WeatherData | null;
  isLoading: boolean;
  error: string;
  localTime: Date | null;
  favorites: GeoLocation[];
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { weather: WeatherData; city: GeoLocation } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_LOCAL_TIME'; payload: Date | null }
  | { type: 'SET_FAVORITES'; payload: GeoLocation[] }
  | { type: 'TOGGLE_FAVORITE' };

// --- Context Type ---
interface WeatherContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  fetchAndSetWeather: (location: GeoLocation, unit: Unit) => void;
}

// --- Initial State ---
const initialState: State = {
  selectedCity: null, weather: null, isLoading: true, error: '', localTime: null, favorites: [],
};

// --- Reducer Function ---
function weatherReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, weather: action.payload.weather, selectedCity: action.payload.city, localTime: new Date() };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_LOCAL_TIME':
      return { ...state, localTime: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'TOGGLE_FAVORITE': {
      if (!state.selectedCity) return state;
      const isFavorite = state.favorites.some(fav => fav.id === state.selectedCity!.id);
      const newFavorites = isFavorite
        ? state.favorites.filter(fav => fav.id !== state.selectedCity!.id)
        : [...state.favorites, state.selectedCity];
      return { ...state, favorites: newFavorites };
    }
    default:
      return state;
  }
}

// --- Create Context ---
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// --- Provider Component ---
export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const { unit } = useUnits();
  const isInitialRender = useRef(true);

  // --- Fetch and Set Weather ---
  const fetchAndSetWeather = useCallback(async (location: GeoLocation, currentUnit: Unit) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [weatherData, airQualityData] = await Promise.all([
        fetchWeather(location.latitude, location.longitude, currentUnit),
        fetchAirQuality(location.latitude, location.longitude),
      ]);
      const combinedData = {
        ...weatherData,
        current: { ...weatherData.current, european_aqi: airQualityData.current.european_aqi },
      };
      dispatch({ type: 'FETCH_SUCCESS', payload: { weather: combinedData, city: location } });
      if (location.name !== 'Current Location') {
        localStorage.setItem(LAST_CITY_KEY, JSON.stringify(location));
      }
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err.message : 'An unknown error occurred.' });
    }
  }, []);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(storedFavorites) });
    } catch (e) { console.error("Failed to parse favorites", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    const lastSearchedCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastSearchedCity) {
      try {
        const city: GeoLocation = JSON.parse(lastSearchedCity);
        // If the last city is not valid, we can skip fetching weather.
        const savedUnit = (localStorage.getItem(UNITS_KEY) as Unit) || UNITS.CELSIUS;
        fetchAndSetWeather(city, savedUnit);
      } catch (e) {
        console.error("Failed to parse last city", e);
        dispatch({ type: 'FETCH_ERROR', payload: '' });
      }
    } else {
      dispatch({ type: 'FETCH_ERROR', payload: '' });
    }
  }, [fetchAndSetWeather]);
  
  useEffect(() => {
    if (!state.weather?.timezone) return;
    const intervalId = setInterval(() => dispatch({ type: 'SET_LOCAL_TIME', payload: new Date() }), 1000);
    return () => clearInterval(intervalId);
  }, [state.weather?.timezone]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (state.selectedCity) {
      fetchAndSetWeather(state.selectedCity, unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <WeatherContext.Provider value={{ state, dispatch, fetchAndSetWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

// --- Custom Hook ---
export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (context === undefined) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
}