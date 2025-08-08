"use client";

import { useState, useEffect } from "react";

// ClientOnly component to prevent hydration errors
// Prevents rendering until the component is mounted on the client
export function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
}

// Enhanced ClientOnly component with better fallback handling
export function ClientOnlyWithFallback({
  children,
  fallback = null,
  ssrFallback = null,
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During SSR, show the SSR fallback
  if (typeof window === "undefined") {
    return ssrFallback || fallback;
  }

  // On client, show fallback until mounted
  if (!hasMounted) {
    return fallback;
  }

  return children;
}
