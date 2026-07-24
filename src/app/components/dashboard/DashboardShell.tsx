import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, LogOut, Menu, Search, X, type LucideIcon } from 'lucide-react';
import { displayName, getInitials, useAuth } from '../../lib/auth';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

interface DashboardShellProps {
  portal: 'Admin' | 'User';
  groups: NavGroup[];
  switchTo?: { label: string; path: string; icon: LucideIcon };
}

export default function DashboardShell({ portal, groups, switchTo }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, firebaseUser, signOut } = useAuth();

  const fbName = firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'User';
  const name = user ? displayName(user) : fbName;
  const fbEmail = firebaseUser?.email || 'U';
  const initials = user ? getInitials(user.full_name, user.email) : getInitials(fbName, fbEmail);
  const avatarUrl = user?.avatar_url || firebaseUser?.photoURL || null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate('/login');
    }
  };

  const isActive = (item: NavItem) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const Avatar = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
    const cls = size === 'md' ? 'w-9 h-9 text-xs' : 'w-9 h-9 text-xs';
    if (avatarUrl) {
      return <img src={avatarUrl} alt={name} className={`${cls} rounded-full object-cover shrink-0`} referrerPolicy="no-referrer" />;
    }
    return (
      <div className={`${cls} rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0`}>
        {initials}
      </div>
    );
  };

  const SidebarContent = (
    <>
      <div className="px-6 pt-6 pb-5" style={{ borderBottom: `1px solid ${T.border}` }}>
        <Link to="/" className="block w-fit" onClick={() => setSidebarOpen(false)}>
          <img src="/Logo.svg" alt="ODI" className="h-8 w-auto" />
        </Link>
        <div className="mt-2 text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: T.sub }}>
          {portal} Portal
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-7">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#A3A3A3' }}>
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-neutral-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 space-y-2" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: T.bgAlt }}>
          <Avatar />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold truncate">{name}</div>
            <div className="text-[10px] font-semibold tracking-wider uppercase truncate" style={{ color: T.sub }}>
              {user?.email ?? portal}
            </div>
          </div>
        </div>
        {switchTo && (
          <Link
            to={switchTo.path}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 rounded-xl transition-colors"
          >
            <switchTo.icon className="w-[18px] h-[18px] text-neutral-400" />
            {switchTo.label}
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: T.bgAlt, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside
        className="hidden md:flex sticky top-0 h-screen w-64 flex-col bg-white shrink-0"
        style={{ borderRight: `1px solid ${T.border}` }}
      >
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/25 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 h-screen w-72 flex flex-col bg-white z-40 md:hidden"
              style={{ borderRight: `1px solid ${T.border}` }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-4 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 md:px-8 h-16 bg-white/90 backdrop-blur"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm px-3.5 py-2 rounded-xl" style={{ background: T.bgAlt, border: `1px solid ${T.border}` }}>
            <Search className="w-4 h-4 shrink-0" style={{ color: '#A3A3A3' }} />
            <input
              type="text"
              placeholder={portal === 'Admin' ? 'Search bookings, customers…' : 'Search your bookings…'}
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-xl hover:bg-neutral-100 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5 text-neutral-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500" />
            </button>
            <Avatar size="md" />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
