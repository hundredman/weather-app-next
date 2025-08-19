'use client';

import { useUnits } from '@/context/UnitsContext';

export default function UnitToggle() {
  const { unit, setUnit } = useUnits();

  const baseClasses = "rounded-full px-3 py-1 text-sm font-medium transition-colors";
  const activeClasses = "bg-white/30 text-white";
  const inactiveClasses = "text-white/70 hover:bg-white/10";

  return (
    <div className="flex items-center rounded-full bg-white/10 p-1 backdrop-blur-sm">
      <button
        onClick={() => setUnit('celsius')}
        className={`${baseClasses} ${unit === 'celsius' ? activeClasses : inactiveClasses}`}
      >
        °C
      </button>
      <button
        onClick={() => setUnit('fahrenheit')}
        className={`${baseClasses} ${unit === 'fahrenheit' ? activeClasses : inactiveClasses}`}
      >
        °F
      </button>
    </div>
  );
}