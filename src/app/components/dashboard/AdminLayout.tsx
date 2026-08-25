import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  Tag,
  Users,
  CreditCard,
  User,
  Inbox,
  Mail,
  Briefcase,
  Truck,
  CalendarClock,
  Ban,
  Banknote,
} from 'lucide-react';
import DashboardShell, { type NavGroup } from './DashboardShell';

const adminGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Orders & fulfillment',
    items: [
      { name: 'All orders', path: '/dashboard/admin/orders', icon: CalendarCheck },
      { name: 'Shipments', path: '/dashboard/admin/shipments', icon: Truck },
      { name: 'Pickup schedule', path: '/dashboard/admin/pickups', icon: CalendarClock },
      { name: 'Cancel requests', path: '/dashboard/admin/cancels', icon: Ban },
      { name: 'Refund requests', path: '/dashboard/admin/refunds', icon: Banknote },
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
    label: 'Customers & payments',
    items: [
      { name: 'Customer directory', path: '/dashboard/admin/customers', icon: Users },
      { name: 'Payments', path: '/dashboard/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Inbox & leads',
    items: [
      { name: 'Notifications', path: '/dashboard/admin/inbox', icon: Inbox },
      { name: 'Contact inquiries', path: '/dashboard/admin/contact-inquiries', icon: Mail },
      { name: 'Job applications', path: '/dashboard/admin/career-applications', icon: Briefcase },
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
