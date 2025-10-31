
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 sm:p-8 lg:p-12">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
