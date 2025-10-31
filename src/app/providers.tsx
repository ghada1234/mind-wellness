
'use client';

import { AuthProvider } from '@/context/auth-context';
import { RemindersProvider } from '@/context/reminders-context';
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <RemindersProvider>
        {mounted && (
          <>
            <ServiceWorkerRegister />
            <InstallPrompt />
          </>
        )}
        {children}
      </RemindersProvider>
    </AuthProvider>
  );
}
