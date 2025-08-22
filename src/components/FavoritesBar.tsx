'use client';

import { memo } from 'react';
import { GeoLocation } from "@/types/weather";

interface FavoritesBarProps {
  favorites: GeoLocation[];
  onSelect: (city: GeoLocation) => void;
  isLoading: boolean;
}

const FavoritesBar = memo(function FavoritesBar({ favorites, onSelect, isLoading }: FavoritesBarProps) {
  if (favorites.length === 0) {
    return null;
  }
  // If possible, consider destructuring city so that you don't need to reference city.id and city.name directly.
  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
      {favorites.map((city) => {
        return (
          <button
            key={city.id}
            onClick={() => onSelect(city)}
            disabled={isLoading}
            className="rounded-full bg-white/20 px-4 py-1.5 text-sm text-white shadow-md backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:disabled:bg-slate-800/50"
          >
            {city.name}
          </button>
        )
      })}
    </div>
  );
});

FavoritesBar.displayName = 'FavoritesBar';

export default FavoritesBar;