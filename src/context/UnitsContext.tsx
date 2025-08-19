'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Unit = 'celsius' | 'fahrenheit';

interface UnitsContextType {
  unit: Unit;
  setUnit: (unit: Unit) => void;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

const UNITS_KEY = 'weatherAppUnits';

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>('celsius');

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

export function useUnits() {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
}