"use client";

import { useState, useEffect } from "react";

/**
 * A hook that ensures state is only updated after hydration to prevent hydration mismatches
 * @param {any} initialValue - The initial value for the state
 * @returns {[any, function]} - Returns the state value and setter function
 */
export function useHydrationSafeState(initialValue) {
  const [state, setState] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const setHydrationSafeState = (newValue) => {
    if (isHydrated) {
      setState(newValue);
    }
  };

  return [state, setHydrationSafeState, isHydrated];
}

/**
 * A hook that provides a safe way to access browser APIs
 * @param {function} getter - Function that returns the value from browser API
 * @param {any} defaultValue - Default value to return during SSR
 * @returns {any} - The value from browser API or default value
 */
export function useBrowserValue(getter, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const result = getter();
      setValue(result);
    } catch (error) {
      console.error("Error accessing browser API:", error);
    }
  }, [getter]);

  return [value, isHydrated];
}


