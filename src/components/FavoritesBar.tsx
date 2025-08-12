import { GeoLocation } from "@/types/weather";

interface FavoritesBarProps {
  favorites: GeoLocation[];
  onSelect: (city: GeoLocation) => void;
  isLoading: boolean;
}

export default function FavoritesBar({ favorites, onSelect, isLoading }: FavoritesBarProps) {
  if (favorites.length === 0) {
    return null; // Do not display anything if there are no favorites
  }

  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
      {favorites.map((city) => (
        <button
          key={city.id}
          onClick={() => onSelect(city)}
          disabled={isLoading}
          className="rounded-full bg-white/20 px-4 py-1.5 text-sm text-white shadow-md backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10"
        >
          {city.name}
        </button>
      ))}
    </div>
  );
}