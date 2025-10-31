
'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BedDouble,
  Activity,
  Apple,
  Smile,
  BookText,
  HeartHandshake,
  Bell,
  Sparkles,
  HeartPulse,
  Settings,
  Droplets,
  BarChart3,
  BrainCircuit,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useReminders } from '@/context/reminders-context';

const mainNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/practice', icon: BrainCircuit, label: 'Practice' },
  { href: '/dashboard/sleep', icon: BedDouble, label: 'Sleep' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { href: '/dashboard/nutrition', icon: Apple, label: 'Nutrition' },
  { href: '/dashboard/mood', icon: Smile, label: 'Mood' },
  { href: '/dashboard/journal', icon: BookText, label: 'Journal' },
];

const secondaryNav = [
  { href: '/dashboard/self-love', icon: HeartHandshake, label: 'Self Love' },
  { href: '/dashboard/reminders', icon: Bell, label: 'Reminders' },
  { href: '/dashboard/water', icon: Droplets, label: 'Water Log' },
  { href: '/dashboard/ai-hub', icon: Sparkles, label: 'AI Hub' },
  {
    href: '/dashboard/wellness-report',
    icon: HeartPulse,
    label: 'Wellness Report',
  },
  {
    href: '/dashboard/analytics-admin',
    icon: BarChart3,
    label: 'User Analytics',
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { reminders } = useReminders();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/">
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <Separator className="my-2" />
          <SidebarMenu>
            {secondaryNav.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                    {item.label === 'Reminders' && reminders.length > 0 && (
                      <SidebarMenuBadge>{reminders.length}</SidebarMenuBadge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2"></SidebarFooter>
      </Sidebar>
    </>
  );
}
