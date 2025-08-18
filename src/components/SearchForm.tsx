'use client';

import { useState, useEffect, useRef, KeyboardEvent, forwardRef, MouseEvent, memo } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCities } from '@/services/weatherService';
import type { GeoLocation } from '@/types/weather';

interface SearchFormProps {
  onCitySelect: (city: GeoLocation) => void;
  onGetLocation: () => void;
  isLoading: boolean;
}

const SearchForm = memo(forwardRef<HTMLInputElement, SearchFormProps>(
  ({ onCitySelect, onGetLocation, isLoading }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    // Debounce search term to avoid firing API calls on every keystroke.
    const debouncedSearchTerm = useDebounce(searchTerm, 100);
    // Ref for the main search container, used to detect clicks outside.
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Fetch city suggestions when the debounced search term changes.
    useEffect(() => {
      const fetchSuggestions = async () => {
        if (debouncedSearchTerm) {
          setActiveIndex(-1); // Reset active index on new search
          const results = await searchCities(debouncedSearchTerm);
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      };
      fetchSuggestions();
    }, [debouncedSearchTerm]);

    // Handles clicks outside the component to close the suggestion list.
    useEffect(() => {
      function handleClickOutside(event: globalThis.MouseEvent) {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
          setIsFocused(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    // Triggers when a city is selected, clearing state and notifying the parent component.
    const handleSelectCity = (city: GeoLocation) => {
      setSearchTerm('');
      setSuggestions([]);
      setIsFocused(false);
      onCitySelect(city);
    };

    // Handles form submission via the Enter key or by clicking the search icon.
    const handleSubmit = (e: React.FormEvent | MouseEvent) => {
      e.preventDefault();
      if (isLoading) return;

      // Prioritize the user's highlighted selection, otherwise, use the first suggestion.
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectCity(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        handleSelectCity(suggestions[0]);
      }
    };

    // Handles keyboard navigation (Arrow Up/Down) through the suggestions.
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prevIndex => (prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prevIndex => (prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1));
          break;
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex w-full max-w-md items-start gap-2">
        <div ref={searchContainerRef} className="relative flex-grow">
          <div className="relative">
            <input
              // The component forwards its ref to this input element.
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
            <FiSearch
              size={20}
              onClick={handleSubmit}
              className="absolute inset-y-0 right-0 my-auto mr-4 cursor-pointer text-white/70 transition-colors hover:text-white"
            />
          </div>
          
          {/* Show suggestions only when the input is focused and there are results. */}
          {isFocused && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-2 w-full overflow-y-auto rounded-lg bg-white/50 shadow-lg backdrop-blur-md max-h-60">
              {suggestions.map((city, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    onMouseEnter={() => setActiveIndex(index)}
                    // Apply a different style for the currently active suggestion.
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
));

SearchForm.displayName = "SearchForm";
export default SearchForm;