
'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import withAuth from '@/components/withAuth';
import { DashboardHeader } from '@/components/dashboard/header';
import { useUserTracking } from '@/hooks/use-user-tracking';

function DashboardLayout({ children }: { children: ReactNode }) {
  // Automatically track user activity for analytics
  useUserTracking();

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

export default withAuth(DashboardLayout);
