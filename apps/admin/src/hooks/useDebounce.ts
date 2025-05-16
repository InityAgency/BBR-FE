import { useState, useEffect } from 'react';

/**
 * Custom hook za debounce vrednosti
 * @param value - Vrednost koju treba debounce-ovati
 * @param delay - Vreme debounce-a u milisekundama
 * @returns Debounce-ovana vrednost
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}