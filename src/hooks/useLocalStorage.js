import { useEffect, useState } from "react";

export function useLocalStorage(initialValue, key) {
  // Best Practice: Initializing state from localStorage for data persistence
  // We use a function to ensure this logic runs only once on initial render.
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  // useEffect to save the watched list to localStorage whenever it changes
  useEffect(() => {
    // We stringify the array because localStorage only stores strings
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
