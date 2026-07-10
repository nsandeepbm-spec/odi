// ─── CENTRAL MOCK DATA ────────────────────────────────────────────────────────
// All dashboard data lives here so the backend can be wired in later
// by replacing these exports with API calls.

export type BookingStatus = 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface Booking {
  id: string;
  customer: string;
  email: string;
  product: string;
  date: string;
  qty: number;
  amount: number;
  status: BookingStatus;
  payment: PaymentStatus;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  bookings: number;
  spent: number;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  volume: string;
  price: number;
  stock: number;
  sold: number;
  status: 'live' | 'coming-soon' | 'out-of-stock';
  img: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  customer: string;
  method: string;
  date: string;
  amount: number;
  status: PaymentStatus;
}

// ─── REVENUE SERIES (admin overview chart) ────────────────────────────────────
export const revenueSeries = [
  { month: 'Jan', revenue: 42000, bookings: 34 },
  { month: 'Feb', revenue: 54500, bookings: 42 },
  { month: 'Mar', revenue: 48200, bookings: 39 },
  { month: 'Apr', revenue: 61000, bookings: 48 },
  { month: 'May', revenue: 73500, bookings: 58 },
  { month: 'Jun', revenue: 89400, bookings: 71 },
  { month: 'Jul', revenue: 145850, bookings: 112 },
];

// ─── BOOKINGS (admin sees all) ────────────────────────────────────────────────
export const bookings: Booking[] = [
  { id: 'BK-0928', customer: 'Ananya Iyer', email: 'ananya@example.com', product: 'Space Explorer 3D Book', date: 'Jul 09, 2026', qty: 2, amount: 2598, status: 'confirmed', payment: 'paid' },
  { id: 'BK-0927', customer: 'Rahul Sharma', email: 'rahul@example.com', product: 'Space Explorer 3D Book', date: 'Jul 08, 2026', qty: 1, amount: 1299, status: 'processing', payment: 'paid' },
  { id: 'BK-0926', customer: 'Priya Patel', email: 'priya@example.com', product: 'Space Explorer 3D Book', date: 'Jul 08, 2026', qty: 1, amount: 1299, status: 'processing', payment: 'pending' },
  { id: 'BK-0925', customer: 'Sandeep', email: 'sandeep@example.com', product: 'Space Explorer 3D Book', date: 'Jul 07, 2026', qty: 1, amount: 1299, status: 'shipped', payment: 'paid' },
  { id: 'BK-0924', customer: 'Vikram Rao', email: 'vikram@example.com', product: 'Space Explorer 3D Book', date: 'Jul 05, 2026', qty: 3, amount: 3897, status: 'delivered', payment: 'paid' },
  { id: 'BK-0923', customer: 'Meera Nair', email: 'meera@example.com', product: 'Space Explorer 3D Book', date: 'Jul 04, 2026', qty: 1, amount: 1299, status: 'delivered', payment: 'paid' },
  { id: 'BK-0922', customer: 'Arjun Mehta', email: 'arjun@example.com', product: 'Space Explorer 3D Book', date: 'Jul 02, 2026', qty: 1, amount: 1299, status: 'cancelled', payment: 'refunded' },
  { id: 'BK-0921', customer: 'Kavya Reddy', email: 'kavya@example.com', product: 'Space Explorer 3D Book', date: 'Jun 30, 2026', qty: 2, amount: 2598, status: 'delivered', payment: 'paid' },
  { id: 'BK-0920', customer: 'Rohan Das', email: 'rohan@example.com', product: 'Space Explorer 3D Book', date: 'Jun 28, 2026', qty: 1, amount: 1299, status: 'delivered', payment: 'paid' },
  { id: 'BK-0919', customer: 'Ishita Singh', email: 'ishita@example.com', product: 'Space Explorer 3D Book', date: 'Jun 26, 2026', qty: 1, amount: 1299, status: 'cancelled', payment: 'failed' },
];

// ─── USER'S OWN BOOKINGS ──────────────────────────────────────────────────────
export const myBookings: Booking[] = [
  { id: 'BK-0925', customer: 'Sandeep', email: 'sandeep@example.com', product: 'Space Explorer 3D Book', date: 'Jul 07, 2026', qty: 1, amount: 1299, status: 'shipped', payment: 'paid' },
  { id: 'BK-0871', customer: 'Sandeep', email: 'sandeep@example.com', product: 'Space Explorer 3D Book', date: 'May 18, 2026', qty: 2, amount: 2598, status: 'delivered', payment: 'paid' },
  { id: 'BK-0714', customer: 'Sandeep', email: 'sandeep@example.com', product: 'Space Explorer 3D Book', date: 'Feb 02, 2026', qty: 1, amount: 1299, status: 'cancelled', payment: 'refunded' },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const products: Product[] = [
  { id: 'PRD-01', name: 'Space Explorer', volume: 'Vol. 01', price: 1299, stock: 248, sold: 412, status: 'live', img: '/book cover.jpg' },
  { id: 'PRD-02', name: 'Ocean Explorer', volume: 'Vol. 02', price: 1299, stock: 0, sold: 0, status: 'coming-soon', img: '/Ocean Explorer.png' },
  { id: 'PRD-03', name: 'Dinosaur Explorer', volume: 'Vol. 03', price: 1299, stock: 0, sold: 0, status: 'coming-soon', img: '/Dinosaur Explorer.png' },
  { id: 'PRD-04', name: 'Human Body', volume: 'Vol. 04', price: 1299, stock: 0, sold: 0, status: 'coming-soon', img: '/Human Body.png' },
  { id: 'PRD-05', name: 'Wildlife', volume: 'Vol. 05', price: 1299, stock: 0, sold: 0, status: 'coming-soon', img: '/Wildlife.png' },
  { id: 'PRD-06', name: 'Ancient Egypt', volume: 'Vol. 06', price: 1299, stock: 0, sold: 0, status: 'coming-soon', img: '/Ancient Egypt.png' },
];

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'CUS-101', name: 'Ananya Iyer', email: 'ananya@example.com', phone: '+91 98301 12345', joined: 'Mar 2026', bookings: 4, spent: 5196, status: 'active' },
  { id: 'CUS-102', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 99870 22334', joined: 'Jan 2026', bookings: 3, spent: 3897, status: 'active' },
  { id: 'CUS-103', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 91234 55678', joined: 'Jun 2026', bookings: 1, spent: 1299, status: 'active' },
  { id: 'CUS-104', name: 'Sandeep', email: 'sandeep@example.com', phone: '+91 90000 11122', joined: 'Dec 2025', bookings: 3, spent: 5196, status: 'active' },
  { id: 'CUS-105', name: 'Vikram Rao', email: 'vikram@example.com', phone: '+91 88776 65544', joined: 'Feb 2026', bookings: 5, spent: 7794, status: 'active' },
  { id: 'CUS-106', name: 'Meera Nair', email: 'meera@example.com', phone: '+91 97654 32109', joined: 'Apr 2026', bookings: 2, spent: 2598, status: 'active' },
  { id: 'CUS-107', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 96543 21098', joined: 'May 2026', bookings: 1, spent: 0, status: 'inactive' },
  { id: 'CUS-108', name: 'Kavya Reddy', email: 'kavya@example.com', phone: '+91 95432 10987', joined: 'Jan 2026', bookings: 2, spent: 2598, status: 'active' },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: 'TXN-4471', bookingId: 'BK-0928', customer: 'Ananya Iyer', method: 'UPI', date: 'Jul 09, 2026', amount: 2598, status: 'paid' },
  { id: 'TXN-4470', bookingId: 'BK-0927', customer: 'Rahul Sharma', method: 'Card', date: 'Jul 08, 2026', amount: 1299, status: 'paid' },
  { id: 'TXN-4469', bookingId: 'BK-0926', customer: 'Priya Patel', method: 'Netbanking', date: 'Jul 08, 2026', amount: 1299, status: 'pending' },
  { id: 'TXN-4468', bookingId: 'BK-0925', customer: 'Sandeep', method: 'UPI', date: 'Jul 07, 2026', amount: 1299, status: 'paid' },
  { id: 'TXN-4467', bookingId: 'BK-0924', customer: 'Vikram Rao', method: 'Card', date: 'Jul 05, 2026', amount: 3897, status: 'paid' },
  { id: 'TXN-4466', bookingId: 'BK-0922', customer: 'Arjun Mehta', method: 'UPI', date: 'Jul 02, 2026', amount: 1299, status: 'refunded' },
  { id: 'TXN-4465', bookingId: 'BK-0919', customer: 'Ishita Singh', method: 'Card', date: 'Jun 26, 2026', amount: 1299, status: 'failed' },
];
