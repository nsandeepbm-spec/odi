import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ShoppingBag, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  const userRoutes = [
    { name: 'Overview', path: '/dashboard', icon: Home },
    { name: 'My Orders', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const adminRoutes = [
    { name: 'Admin Overview', path: '/dashboard/admin', icon: ShieldAlert },
    { name: 'All Orders', path: '/dashboard/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/dashboard/admin/customers', icon: Users },
  ];

  const routes = isAdmin ? adminRoutes : userRoutes;

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: T.bgAlt, color: T.text }}>
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-neutral-100 z-20">
        <span className="font-black text-xl tracking-tight">Dashboard</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-neutral-100 z-20 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6">
          <Link to="/" className="font-black text-2xl tracking-tight block">ODI<span className="text-indigo-500">.</span></Link>
          <div className="mt-1 text-xs font-bold tracking-widest uppercase text-neutral-400">
            {isAdmin ? 'Admin Portal' : 'User Portal'}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {routes.map((route) => {
            const isActive = location.pathname === route.path;
            const Icon = route.icon;
            return (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-neutral-900 text-white' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                {route.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-100 space-y-2">
          {!isAdmin && (
            <Link to="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-colors">
              <ShieldAlert className="w-5 h-5 text-neutral-400" />
              Switch to Admin
            </Link>
          )}
          {isAdmin && (
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-colors">
              <Home className="w-5 h-5 text-neutral-400" />
              Switch to User
            </Link>
          )}
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
