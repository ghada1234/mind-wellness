
'use client';

import { AuthProvider } from '@/context/auth-context';
import { RemindersProvider } from '@/context/reminders-context';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RemindersProvider>{children}</RemindersProvider>
    </AuthProvider>
  );
}
