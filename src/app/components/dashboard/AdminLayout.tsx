import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Users,
  CreditCard,
  Settings,
  User,
} from 'lucide-react';
import DashboardShell, { type NavGroup } from './DashboardShell';

const adminGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard, end: true },
      { name: 'Bookings', path: '/dashboard/admin/bookings', icon: CalendarCheck },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', path: '/dashboard/admin/products', icon: Package },
    ],
  },
  {
    label: 'People',
    items: [
      { name: 'Customers', path: '/dashboard/admin/customers', icon: Users },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Payments', path: '/dashboard/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  return (
    <DashboardShell
      portal="Admin"
      groups={adminGroups}
      switchTo={{ label: 'Switch to User', path: '/dashboard', icon: User }}
    />
  );
}
