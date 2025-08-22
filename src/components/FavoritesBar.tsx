'use client';

import { memo } from 'react';
import { GeoLocation } from "@/types/weather";

interface FavoritesBarProps {
  favorites: GeoLocation[];
  onSelect: (city: GeoLocation) => void;
  isLoading: boolean;
}

// FavoritesBar component to display a list of favorite cities
const FavoritesBar = memo(function FavoritesBar({ favorites, onSelect, isLoading }: FavoritesBarProps) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
      {favorites.map((city) => {
        const { id, name } = city;
        
        return (
          <button
            key={id}
            onClick={() => onSelect(city)}
            disabled={isLoading}
            className="rounded-full bg-white/20 px-4 py-1.5 text-sm text-white shadow-md backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 dark:disabled:bg-slate-800/50"
          >
            {name}
          </button>
        )
      })}
    </div>
  );
});

FavoritesBar.displayName = 'FavoritesBar';

export default FavoritesBar;