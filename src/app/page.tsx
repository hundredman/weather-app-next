// app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useWeather } from '@/context/WeatherContext';
import { getBackgroundColor } from '@/utils/weatherUtils';
import SearchSection from '@/components/SearchSection';
import ContentDisplay from '@/components/ContentDisplay';
import ThemeToggle from '@/components/ThemeToggle';

const INITIAL_BG = 'from-gray-400 to-gray-200';

// Main page component
export default function Home() {
  const { state } = useWeather();
  const { resolvedTheme } = useTheme();
  const { weather } = state;
  
  const [bgClasses, setBgClasses] = useState([INITIAL_BG, INITIAL_BG]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);

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
  }, [weather, resolvedTheme, bgClasses, activeBgIndex]);

  return (
    <main className="relative z-0 flex min-h-screen flex-col items-center gap-8 p-6 sm:p-12">
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${activeBgIndex === 0 ? 'opacity-100' : 'opacity-0'} ${bgClasses[0]}`} />
        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${activeBgIndex === 1 ? 'opacity-100' : 'opacity-0'} ${bgClasses[1]}`} />
      </div>

      <div className="flex w-full max-w-md items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-white text-shadow-md sm:text-4xl">Weather App</h1>
        <ThemeToggle />
      </div>

      <SearchSection />
      <div className="w-full max-w-4xl">
        <ContentDisplay />
      </div>
    </main>
  );
}