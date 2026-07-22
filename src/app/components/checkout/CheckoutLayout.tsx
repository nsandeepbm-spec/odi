import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Check, LogOut, ShoppingBag } from 'lucide-react';
import { CheckoutProvider, useCheckout } from '../../lib/checkout';
import { displayName, getInitials, useAuth } from '../../lib/auth';
import { useCartStore } from '../../store/cartStore';
import { CartDrawer } from './CartDrawer';
import { ODILogo } from '../ODILogo';
import { ScrollToTop } from '../ScrollToTop';

const T = { bgAlt: '#F7F7F5', text: '#111111' };

function CheckoutNavbar() {
  const navigate = useNavigate();
  const { user, firebaseUser, isAdmin, signOut } = useAuth();
  const { items: cartItems, toggleDrawer } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const dashboardPath = isAdmin ? '/dashboard/admin' : '/dashboard';
  const profileName = user
    ? displayName(user)
    : firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'Account';
  const profileInitials = user
    ? getInitials(user.full_name, user.email)
    : getInitials(firebaseUser?.displayName, firebaseUser?.email || 'U');
  const avatarUrl = user?.avatar_url || firebaseUser?.photoURL || null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await signOut();
    } finally {
      navigate('/');
    }
  };

  return (
    <header className="w-full bg-white border-b border-neutral-100 py-3 sm:py-4 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        <Link
          to="/"
          className="shrink-0 hover:opacity-80 transition-opacity hover:scale-[1.02] active:scale-[0.98]"
          aria-label="ODI home"
        >
          <div className="w-20 sm:w-24 md:w-28">
            <ODILogo color="black" />
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          <Link
            to={dashboardPath}
            className="hidden md:flex px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold rounded-full hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap"
          >
            Dashboard
          </Link>

          <button
            type="button"
            onClick={toggleDrawer}
            aria-label="Open cart"
            className="relative p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center justify-center shrink-0"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {firebaseUser ? (
            <div ref={profileRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-opacity"
                aria-label={`${profileName} profile`}
                aria-expanded={profileOpen}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  profileInitials
                )}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-full pt-2 z-50 w-52 sm:w-56"
                  >
                    <div className="bg-white border border-neutral-200 shadow-xl rounded-xl p-2">
                      <div className="px-3 py-2 mb-1 border-b border-neutral-100">
                        <p className="text-xs font-bold text-neutral-900 truncate">{profileName}</p>
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                          {user?.email || firebaseUser?.email}
                        </p>
                      </div>
                      <Link
                        to={dashboardPath}
                        onClick={() => setProfileOpen(false)}
                        className="md:hidden block w-full text-left px-3 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-bold transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold text-xs sm:text-sm hover:bg-neutral-300 transition-colors shrink-0"
            >
              ?
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function CheckoutStepper() {
  const location = useLocation();

  const STEPS = [
    { name: 'Product', path: '/checkout' },
    { name: 'Shipping', path: '/checkout/review' },
    { name: 'Payment', path: '/checkout/payment' },
    { name: 'Done', path: '/checkout/success' },
  ];

  const currentIndex = STEPS.findIndex((s) => {
    if (s.path === '/checkout') {
      return location.pathname === '/checkout' || location.pathname === '/checkout/';
    }
    return location.pathname.startsWith(s.path);
  });

  return (
    <div className="flex items-center justify-between relative max-w-2xl mx-auto mt-4 mb-4">
      <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-200 z-0" />
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.name} className="flex items-center gap-2 bg-[#F7F7F5] px-4 relative z-10">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors z-10 ${
                isCompleted
                  ? 'bg-[#00a680] text-white'
                  : isActive
                    ? 'bg-black text-white'
                    : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : index + 1}
            </div>
            <span
              className={`text-[11px] font-bold tracking-wide ${
                isCompleted ? 'text-[#00a680]' : isActive ? 'text-black' : 'text-neutral-500'
              }`}
            >
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CheckoutLayoutInner() {
  const location = useLocation();
  const isSuccess = location.pathname.includes('/success');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bgAlt, color: T.text }}>
      <ScrollToTop />
      <CartDrawer />
      <CheckoutNavbar />

      {!isSuccess && (
        <div className="w-full max-w-7xl mx-auto px-4 pt-6 pb-2">
          <CheckoutStepper />
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-20 pt-2">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default function CheckoutLayout() {
  return (
    <CheckoutProvider>
      <CheckoutLayoutInner />
    </CheckoutProvider>
  );
}
