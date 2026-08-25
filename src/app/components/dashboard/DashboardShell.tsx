import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, LogOut, Menu, PanelLeft, PanelLeftClose, Search, Settings, X, type LucideIcon } from 'lucide-react';
import { displayName, getInitials, useAuth } from '../../lib/auth';
import { ODILogo } from '../ODILogo';
import NotificationBell from './NotificationBell';

// Premium Dark Theme Tokens
const T = { 
  bg: '#050505', 
  bgAlt: '#0a0a0a', 
  text: '#fafafa', 
  sub: '#a1a1aa', 
  border: '#1f1f22',
  accent: '#38bdf8'
};

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
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, firebaseUser, signOut } = useAuth();
  const settingsPath = portal === 'Admin' ? '/dashboard/admin/settings' : '/dashboard/settings';

  const fbName = firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'User';
  const name = user ? displayName(user) : fbName;
  const fbEmail = firebaseUser?.email || 'U';
  const initials = user ? getInitials(user.full_name, user.email) : getInitials(fbName, fbEmail);
  const avatarUrl = user?.avatar_url || firebaseUser?.photoURL || null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await signOut();
    } finally {
      navigate('/login');
    }
  };

  const isActive = (item: NavItem) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const Avatar = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
    const cls = size === 'lg' ? 'w-11 h-11 text-sm' : 'w-8 h-8 text-[11px]';
    if (avatarUrl) {
      return <img src={avatarUrl} alt={name} className={`${cls} rounded-full object-cover shrink-0 ring-1 ring-white/10`} referrerPolicy="no-referrer" />;
    }
    return (
      <div className={`${cls} rounded-full bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black shrink-0 ring-1 ring-white/10`}>
        {initials}
      </div>
    );
  };

  const renderSidebarContent = (isMobile: boolean) => {
    const collapsed = !isMobile && desktopCollapsed;
    return (
      <>
        <div
          className={`h-[72px] shrink-0 ${collapsed ? 'px-2 flex flex-col items-center justify-center gap-0' : 'px-5 flex items-center justify-between gap-3'}`}
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            aria-label="ODI home"
            className={`block shrink-0 hover:opacity-90 transition-opacity ${collapsed ? 'hidden' : 'w-[108px]'}`}
          >
            <ODILogo color="#ffffff" />
          </Link>
          {!isMobile && (
            <button
              type="button"
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          )}
        </div>

        <nav className={`flex-1 min-h-0 overflow-y-auto pt-5 pb-6 space-y-6 ${collapsed ? 'px-2.5' : 'px-4'}`}>
          {groups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-3 mb-2.5 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: T.sub }}>
                  {group.label}
                </div>
              )}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.name : undefined}
                      onClick={() => setSidebarOpen(false)}
                      className={`group relative flex items-center ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'} rounded-xl text-sm font-semibold transition-all duration-300 ${
                        active
                          ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.03)] border border-white/5'
                          : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200 border border-transparent'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId={isMobile ? `mobile-active-indicator-${item.path}` : `active-indicator-${item.path}`}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] transition-colors shrink-0 ${active ? 'text-cyan-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </>
    );
  };

  return (
    <div
      className="min-h-screen md:h-screen md:overflow-hidden flex selection:bg-cyan-500/30 selection:text-cyan-100 [&_input:-webkit-autofill]:![box-shadow:0_0_0_100px_#111113_inset] [&_input:-webkit-autofill]:![-webkit-text-fill-color:#d4d4d8]"
      style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-full flex-col shrink-0 transition-[width] duration-300 ease-in-out ${desktopCollapsed ? 'w-[84px]' : 'w-[300px]'}`}
        style={{ background: T.bgAlt, borderRight: `1px solid ${T.border}` }}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 h-screen w-[300px] flex flex-col z-40 md:hidden shadow-2xl shadow-black"
              style={{ background: T.bgAlt, borderRight: `1px solid ${T.border}` }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors z-10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

        <header
          className="sticky top-0 z-20 flex items-center gap-4 px-5 md:px-8 h-[72px] shrink-0"
          style={{ background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-xl hover:bg-white/[0.06] text-neutral-500 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to="/"
            aria-label="ODI home"
            className="md:hidden w-[80px] shrink-0 hover:opacity-90 transition-opacity"
          >
            <ODILogo color="#ffffff" />
          </Link>

          {desktopCollapsed && (
            <Link
              to="/"
              aria-label="ODI home"
              className="hidden md:block w-[88px] shrink-0 hover:opacity-90 transition-opacity"
            >
              <ODILogo color="#ffffff" />
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md px-3.5 py-2 rounded-full border border-white/[0.07] bg-white/[0.03] focus-within:bg-white/[0.05] focus-within:border-white/[0.14] focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
            <Search className="w-3.5 h-3.5 shrink-0 text-neutral-500 flex-none" />
            <input
              type="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={portal === 'Admin' ? 'Search orders, customers…' : 'Search your orders…'}
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-600 text-neutral-300"
              style={{ WebkitTextFillColor: 'inherit' }}
            />
          </div>

          <div className="flex-1 sm:hidden" />

          <div className="flex items-center gap-2 ml-auto">
            <NotificationBell
              inboxPath={portal === 'Admin' ? '/dashboard/admin/inbox' : '/dashboard/inbox'}
            />

            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className={`flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full border transition-colors ${
                  profileOpen
                    ? 'border-white/15 bg-white/[0.08]'
                    : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/12'
                }`}
                aria-label={`${name} profile`}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <Avatar size="sm" />
                <div className="hidden md:block min-w-0 text-left">
                  <p className="text-[13px] font-bold text-white leading-tight truncate max-w-[140px]">{name}</p>
                  <p className="text-[10px] font-medium text-neutral-500 leading-tight truncate max-w-[140px] mt-0.5">
                    {portal} Portal
                  </p>
                </div>
                <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-neutral-500 shrink-0 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 top-full pt-2.5 z-50 w-[272px]"
                    role="menu"
                  >
                    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111113] shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
                      <div className="px-4 py-4 bg-gradient-to-b from-white/[0.04] to-transparent">
                        <div className="flex items-center gap-3">
                          <Avatar size="lg" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-white truncate">{name}</p>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {user?.email || firebaseUser?.email}
                            </p>
                            <span className="inline-flex mt-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-[0.14em] uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {portal}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-white/[0.06]" />

                      <div className="p-1.5">
                        <Link
                          to={settingsPath}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 w-full px-2.5 py-2 text-[13px] font-medium text-neutral-300 hover:bg-white/[0.06] hover:text-white rounded-xl transition-colors"
                          role="menuitem"
                        >
                          <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                            <Settings className="w-3.5 h-3.5 text-neutral-400" />
                          </span>
                          Settings
                        </Link>
                        {switchTo && (
                          <Link
                            to={switchTo.path}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 w-full px-2.5 py-2 text-[13px] font-medium text-neutral-300 hover:bg-white/[0.06] hover:text-white rounded-xl transition-colors"
                            role="menuitem"
                          >
                            <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                              <switchTo.icon className="w-3.5 h-3.5 text-neutral-400" />
                            </span>
                            {switchTo.label}
                          </Link>
                        )}
                      </div>

                      <div className="h-px bg-white/[0.06]" />

                      <div className="p-1.5">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-2.5 py-2 text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
                          role="menuitem"
                        >
                          <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0">
                            <LogOut className="w-3.5 h-3.5" />
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className={`flex-1 w-full min-h-0 relative z-10 md:overflow-y-auto transition-all duration-300 ${desktopCollapsed ? 'p-5 md:px-10 md:py-8' : 'p-5 md:px-10 md:py-8'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
