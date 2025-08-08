"use client";

import { useState, useEffect } from "react";
import { ClientOnly } from "@/components/client-only";

export default function TestHydrationPage() {
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hydration Test Page</h1>

      <div className="space-y-4">
        <div className="p-4 bg-blue-100 rounded">
          <h2 className="font-semibold">
            Component Mounted: {mounted ? "Yes" : "No"}
          </h2>
        </div>

        <ClientOnly
          fallback={
            <div className="p-4 bg-yellow-100 rounded">
              Loading window width...
            </div>
          }
        >
          <div className="p-4 bg-green-100 rounded">
            <h2 className="font-semibold">Window Width: {windowWidth}px</h2>
          </div>
        </ClientOnly>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Server/Client Consistent Content</h2>
          <p>This content should be the same on both server and client.</p>
        </div>
      </div>
    </div>
  );
}
