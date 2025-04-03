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
    // Postaviti timeout koji će ažurirati debounce-ovanu vrednost nakon definisanog delay-a
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Očistiti timeout ako se vrednost promeni pre nego što istekne delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}