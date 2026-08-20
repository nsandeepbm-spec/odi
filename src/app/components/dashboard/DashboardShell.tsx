import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Menu, Search, X, type LucideIcon } from 'lucide-react';
import { displayName, getInitials, useAuth } from '../../lib/auth';
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
      return <img src={avatarUrl} alt={name} className={`${cls} rounded-full object-cover shrink-0 ring-1 ring-white/10`} referrerPolicy="no-referrer" />;
    }
    return (
      <div className={`${cls} rounded-full bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black shrink-0 ring-1 ring-white/10 shadow-[0_0_15px_rgba(99,102,241,0.4)]`}>
        {initials}
      </div>
    );
  };

  const renderSidebarContent = (isMobile: boolean) => {
    const collapsed = !isMobile && desktopCollapsed;
    return (
      <>
        <div className={`px-4 pt-7 pb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 h-[85px]`} style={{ borderBottom: `1px solid ${T.border}` }}>
          {!collapsed && (
            <Link to="/" className="block w-fit" onClick={() => setSidebarOpen(false)}>
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">ODI.</span>
            </Link>
          )}
          {!isMobile && (
            <button onClick={() => setDesktopCollapsed(!desktopCollapsed)} className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 transition-colors shrink-0">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className={`flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar ${collapsed ? 'px-2' : 'px-4'}`}>
          {groups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-3 mb-3 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: T.sub }}>
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.name : undefined}
                      onClick={() => setSidebarOpen(false)}
                      className={`group relative flex items-center ${collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-semibold transition-all duration-300 ${
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

        <div className={`p-4 space-y-2 ${collapsed ? 'flex flex-col items-center' : ''}`} style={{ borderTop: `1px solid ${T.border}` }}>
          <div className={`flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-3'} rounded-xl border border-white/5 shadow-inner w-full`} style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}>
            <Avatar />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold truncate text-white">{name}</div>
                <div className="text-[10px] font-semibold tracking-wider uppercase truncate" style={{ color: T.sub }}>
                  {user?.email ?? portal}
                </div>
              </div>
            )}
          </div>
          {switchTo && (
            <Link
              to={switchTo.path}
              title={collapsed ? switchTo.label : undefined}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center ${collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} w-full text-sm font-semibold text-neutral-400 hover:bg-white/5 hover:text-neutral-200 rounded-xl transition-all border border-transparent hover:border-white/5`}
            >
              <switchTo.icon className="w-[18px] h-[18px] text-neutral-500 shrink-0" />
              {!collapsed && <span className="truncate">{switchTo.label}</span>}
            </Link>
          )}
          <button
            onClick={handleSignOut}
            title={collapsed ? "Sign Out" : undefined}
            className={`flex items-center ${collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} w-full text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all border border-transparent hover:border-red-500/10`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex selection:bg-cyan-500/30 selection:text-cyan-100 [&_input:-webkit-autofill]:![box-shadow:0_0_0_100px_#111113_inset] [&_input:-webkit-autofill]:![-webkit-text-fill-color:#d4d4d8]" style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex sticky top-0 h-screen flex-col shrink-0 transition-all duration-300 ease-in-out ${desktopCollapsed ? 'w-[88px]' : 'w-64'}`}
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
              className="fixed top-0 left-0 h-screen w-72 flex flex-col z-40 md:hidden shadow-2xl shadow-black"
              style={{ background: T.bgAlt, borderRight: `1px solid ${T.border}` }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-4 p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300 ease-in-out">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 md:px-8 h-[60px] bg-[#050505]/80 backdrop-blur-xl"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-xl hover:bg-white/[0.06] text-neutral-500 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm px-3.5 py-2 rounded-xl border border-white/[0.07] bg-[#111113] focus-within:bg-[#141416] focus-within:border-white/[0.12] transition-all">
            <Search className="w-3.5 h-3.5 shrink-0 text-neutral-600 flex-none" />
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

            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-default">
              <Avatar size="sm" />
              <div className="hidden md:block min-w-0">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{name}</p>
                <p className="text-[10px] text-neutral-500 truncate max-w-[120px]">{portal} Portal</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto relative z-10 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
