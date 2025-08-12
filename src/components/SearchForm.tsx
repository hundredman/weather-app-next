'use client';

// Import forwardRef.
import { useState, useEffect, useRef, KeyboardEvent, forwardRef } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCities } from '@/services/weatherService';
import type { GeoLocation } from '@/types/weather';

interface SearchFormProps {
  onCitySelect: (city: GeoLocation) => void;
  onGetLocation: () => void;
  isLoading: boolean;
}

// Wrap the component with forwardRef and receive ref as the second argument.
const SearchForm = forwardRef<HTMLInputElement, SearchFormProps>(
  ({ onCitySelect, onGetLocation, isLoading }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const fetchSuggestions = async () => {
        if (debouncedSearchTerm) {
          setActiveIndex(-1);
          const results = await searchCities(debouncedSearchTerm);
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    }, [debouncedSearchTerm]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
          setIsFocused(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    const handleSelectCity = (city: GeoLocation) => {
      setSearchTerm('');
      setSuggestions([]);
      setIsFocused(false);
      onCitySelect(city);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectCity(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelectCity(suggestions[0]);
      }
    };

    // Keep the arrow key logic from the previous version, which had no issues.
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prevIndex => (prevIndex + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prevIndex => (prevIndex - 1 + suggestions.length) % suggestions.length);
          break;
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-md items-start gap-2">
        <div ref={searchContainerRef} className="relative flex-grow">
          <div className="relative">
            {/* Connect the ref received from the parent to the input. */}
            <input
              ref={ref}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a city..."
              className="w-full rounded-full border border-transparent bg-white/20 px-5 py-3 text-white placeholder-white/70 shadow-lg backdrop-blur-sm focus:border-white/50 focus:outline-none focus:ring-0"
              disabled={isLoading}
              autoComplete="off"
            />
            <FiSearch size={20} className="pointer-events-none absolute inset-y-0 right-0 my-auto mr-4 text-white/70" />
          </div>
          
          {isFocused && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-2 w-full overflow-y-auto rounded-lg bg-white/50 shadow-lg backdrop-blur-md max-h-60">
              {suggestions.map((city, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`cursor-pointer px-4 py-2 text-white transition-colors ${
                      isActive ? 'bg-white/30' : 'hover:bg-white/20'
                    }`}
                  >
                    {city.name}, {city.country} {city.admin1 && `(${city.admin1})`}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={onGetLocation}
          disabled={isLoading}
          className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10 disabled:text-white/30"
          title="Use my current location"
        >
          <FiMapPin size={22} />
        </button>
      </form>
    );
  }
);

SearchForm.displayName = "SearchForm";
export default SearchForm;