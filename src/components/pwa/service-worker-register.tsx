'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      let updateInterval: NodeJS.Timeout | null = null;
      let handleControllerChange: (() => void) | null = null;

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates every hour
          updateInterval = setInterval(() => {
            registration.update().catch(() => {
              // Silently handle update errors
            });
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Handle service worker updates
      handleControllerChange = () => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      // Clean up on unmount
      return () => {
        if (updateInterval) {
          clearInterval(updateInterval);
        }
        if (handleControllerChange && 'serviceWorker' in navigator) {
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        }
      };
    }
  }, []);

  return null;
}

