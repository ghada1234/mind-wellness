
'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  BrainCircuit,
  BedDouble,
  Activity,
  Apple,
  Smile,
  Wind,
  BookText,
  HeartHandshake,
  Leaf,
  Bell,
  Sparkles,
  LineChart,
  HeartPulse,
  UserCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

const mainNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/meditation', icon: BrainCircuit, label: 'Meditation' },
  { href: '/dashboard/sleep', icon: BedDouble, label: 'Sleep' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { href: '/dashboard/nutrition', icon: Apple, label: 'Nutrition' },
  { href: '/dashboard/mood', icon: Smile, label: 'Mood' },
  { href: '#', icon: Wind, label: 'Breathing' },
  { href: '#', icon: BookText, label: 'Journal' },
];

const secondaryNav = [
  { href: '#', icon: HeartHandshake, label: 'Self Love' },
  { href: '#', icon: Leaf, label: 'Mindfulness' },
  { href: '#', icon: Bell, label: 'Reminders' },
  { href: '#', icon: Sparkles, label: 'AI Hub' },
  { href: '#', icon: LineChart, label: 'Progress' },
  { href: '#', icon: HeartPulse, label: 'Physical Health' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
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
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
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
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <a href="#">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <a href="#">
                <UserCircle />
                <span>{user ? user.email : 'Profile'}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} tooltip="Sign Out">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
