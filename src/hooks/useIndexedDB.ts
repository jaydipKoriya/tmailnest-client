import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export function useIndexedDB<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    
    get<T>(key)
      .then((val) => {
        if (isMounted) {
          if (val !== undefined) {
            setStoredValue(val);
          }
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.warn(`Error reading from IndexedDB for key "${key}":`, err);
        if (isMounted) {
          setIsLoaded(true); // Proceed even if there's an error so the app doesn't hang
        }
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to IndexedDB
      set(key, valueToStore).catch((err) => {
        console.warn(`Error writing to IndexedDB for key "${key}":`, err);
      });
    } catch (error) {
      console.warn(`Error applying new value for key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoaded];
}
