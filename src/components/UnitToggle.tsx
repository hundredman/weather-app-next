// components/UnitToggle.tsx

'use client';

import { useUnits } from '@/context/UnitsContext';
import { UNITS } from '@/constants';

// UnitToggle component to switch between Celsius and Fahrenheit
export default function UnitToggle() {
  const { unit, setUnit } = useUnits();

  const baseClasses = "rounded-full px-3 py-1 text-sm font-medium transition-colors";
  const activeClasses = "bg-white/30 text-white";
  const inactiveClasses = "text-white/70 hover:bg-white/10";

  return (
    <div className="flex items-center rounded-full bg-white/10 p-1 backdrop-blur-sm">
      <button
        onClick={() => setUnit(UNITS.CELSIUS)}
        className={`${baseClasses} ${unit === UNITS.CELSIUS ? activeClasses : inactiveClasses}`}
      >
        °C
      </button>
      <button
        onClick={() => setUnit(UNITS.FAHRENHEIT)}
        className={`${baseClasses} ${unit === UNITS.FAHRENHEIT ? activeClasses : inactiveClasses}`}
      >
        °F
      </button>
    </div>
  );
}