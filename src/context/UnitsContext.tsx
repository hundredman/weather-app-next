// context/UnitsContext.tsx

'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UNITS, UNITS_KEY } from '@/constants';

type Unit = typeof UNITS[keyof typeof UNITS];

interface UnitsContextType {
  unit: Unit;
  setUnit: (unit: Unit) => void;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

// UnitsProvider component to manage unit settings across the application
export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>(UNITS.CELSIUS);

  useEffect(() => {
    const storedUnit = localStorage.getItem(UNITS_KEY) as Unit;
    if (storedUnit) {
      setUnit(storedUnit);
    }
  }, []);

  const handleSetUnit = (newUnit: Unit) => {
    setUnit(newUnit);
    localStorage.setItem(UNITS_KEY, newUnit);
  };

  return (
    <UnitsContext.Provider value={{ unit, setUnit: handleSetUnit }}>
      {children}
    </UnitsContext.Provider>
  );
}

// Custom hook to use the UnitsContext
export function useUnits() {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
}