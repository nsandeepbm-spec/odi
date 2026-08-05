import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Tag,
  Users,
  CreditCard,
  Settings,
  User,
  Inbox,
} from 'lucide-react';
import DashboardShell, { type NavGroup } from './DashboardShell';

const adminGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard, end: true },
      { name: 'Orders', path: '/dashboard/admin/orders', icon: CalendarCheck },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Products', path: '/dashboard/admin/products', icon: Package },
      { name: 'Coupons', path: '/dashboard/admin/coupons', icon: Tag },
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
      { name: 'Inbox', path: '/dashboard/admin/inbox', icon: Inbox },
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
