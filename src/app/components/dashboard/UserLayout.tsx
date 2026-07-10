import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingBag,
  CreditCard,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import DashboardShell, { type NavGroup } from './DashboardShell';
import { useAuth } from '../../lib/auth';

const userGroups: NavGroup[] = [
  {
    label: 'My Account',
    items: [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
      { name: 'My Bookings', path: '/dashboard/bookings', icon: CalendarCheck },
      { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
    ],
  },
  {
    label: 'Billing',
    items: [
      { name: 'Payments', path: '/dashboard/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ],
  },
];

export default function UserLayout() {
  const { isAdmin } = useAuth();

  return (
    <DashboardShell
      portal="User"
      groups={userGroups}
      switchTo={
        isAdmin
          ? { label: 'Switch to Admin', path: '/dashboard/admin', icon: ShieldCheck }
          : undefined
      }
    />
  );
}
