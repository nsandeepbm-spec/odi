import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
 Menu, X, ChevronDown, LogOut, ShoppingBag,
 type LucideIcon 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { ODILogo } from './ODILogo';
import { displayName, getInitials, useAuth } from '../lib/auth';
import { useCartStore } from '../store/cartStore';
import { CartDrawer } from './checkout/CartDrawer';

// --- Interfaces for Type Safety ---
interface DropdownItem {
 name: string;
 path: string;
 icon?: LucideIcon; // Optional icon
 desc?: string; // Optional description
}

interface NavLink {
 name: string;
 path: string;
 isMega?: boolean;
 dropdown?: DropdownItem[];
}

// --- Navigation Data ---
const navLinks: NavLink[] = [
 { name: 'Home', path: '/' },
 { name: 'Products', path: '/products' },
 { name: 'About', path: '/about' },
 {
 name: 'Services',
 path: '/services',
 isMega: true,
 dropdown: [
 { name: 'Stereo Conversion', path: '/services/3d-movie-conversion', desc: 'Cinematic depth for feature films.' },
 { name: '3D Books', path: '/services/3d-books', desc: 'Premium 3D learning products for kids.' },
 ]
 },
 {
 name: 'Industries',
 path: '/industries',
 },
 
 { name: 'Careers', path: '/careers' },
];

export function Navbar() {
 const [isScrolled, setIsScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
 const [profileOpen, setProfileOpen] = useState(false);
 
  const navigate = useNavigate();
  const location = useLocation();
  const { user, firebaseUser, isAdmin, signOut, loading } = useAuth();
  const { items: cartItems, toggleDrawer } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isLoggedIn = Boolean(firebaseUser);
  const dashboardPath = isAdmin ? '/dashboard/admin' : '/dashboard';
  const profileName = user ? displayName(user) : (firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'Account');
  const profileInitials = user
    ? getInitials(user.full_name, user.email)
    : getInitials(firebaseUser?.displayName, firebaseUser?.email || 'U');
  const avatarUrl = user?.avatar_url || firebaseUser?.photoURL || null;

  const isLight =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname === '/learn-more';

 useEffect(() => {
 const handleScroll = () => setIsScrolled(window.scrollY > 20);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => setMobileMenuOpen(false), [location]);

 const handleSignOut = async () => {
   setProfileOpen(false);
   setMobileMenuOpen(false);
   try {
     await signOut();
   } finally {
     navigate('/');
   }
 };

 const CartButton = ({ className = '' }: { className?: string }) => (
   <button
     type="button"
     onClick={toggleDrawer}
     aria-label="Open cart"
     className={`relative p-2 rounded-full border transition-colors flex items-center justify-center ${
       isLight
         ? 'border-neutral-200 hover:bg-neutral-50 text-neutral-800'
         : 'border-white/20 hover:bg-white/10 text-white'
     } ${className}`}
   >
     <ShoppingBag className="w-5 h-5" />
     {cartCount > 0 && (
       <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
         {cartCount > 9 ? '9+' : cartCount}
       </span>
     )}
   </button>
 );

 const Avatar = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
   const cls = size === 'md' ? 'w-10 h-10 text-xs' : 'w-8 h-8 text-[10px]';
   if (avatarUrl) {
     return <img src={avatarUrl} alt="" className={`${cls} rounded-full object-cover shrink-0`} referrerPolicy="no-referrer" />;
   }
   return (
     <span className={`${cls} rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0`}>
       {profileInitials}
     </span>
   );
 };

 return (
 <>
 <CartDrawer />
 <nav className="fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-all duration-500">
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-2 pb-4 md:pt-4 md:pb-6">
        <div 
          className={`pointer-events-auto relative flex items-center px-6 py-3 rounded-full transition-all duration-500 border ${
            isLight
              ? 'bg-white/80 backdrop-blur-xl border-neutral-200 shadow-md'
              : 'bg-[#020617]/80 backdrop-blur-xl border-transparent shadow-2xl'
          }`}
        >
          {/* Gradient Border (on dark background of website) */}
          <div 
            className={`absolute inset-[-1px] rounded-full pointer-events-none transition-opacity duration-500 p-[1px] bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] ${!isLight ? 'opacity-100' : 'opacity-0'}`}
            style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} 
          />
 {/* LOGO */}
 <div 
 className="relative z-[110] cursor-pointer shrink-0 lg:flex-1 hover:scale-105 transition-transform"
 onClick={() => navigate('/')}
 >
  <div className="w-24 md:w-28">
    <ODILogo color={isLight ? "black" : "white"}/>
  </div>
 </div>

 {/* DESKTOP LINKS — evenly spaced in the center */}
 <div className="hidden lg:flex items-center justify-center gap-1 shrink-0">
 {navLinks.map((link) => (
 <div 
 key={link.name}
 className="relative"
 onMouseEnter={() => setActiveDropdown(link.name)}
 onMouseLeave={() => setActiveDropdown(null)}
 >
 <button
  onClick={() => !link.dropdown && navigate(link.path)}
  className={`px-3 py-2 text-[11px] font-black tracking-[0.2em] uppercase transition-all flex items-center gap-1.5 whitespace-nowrap ${
  location.pathname === link.path 
    ? isLight ? 'text-cyan-600' : 'text-cyan-400' 
    : isLight ? 'text-neutral-600 hover:text-black' : 'text-white/70 hover:text-white'
  }`}
 >
 {link.name}
  {link.dropdown && (
  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
    activeDropdown === link.name 
      ? isLight ? 'rotate-180 text-cyan-600' : 'rotate-180 text-cyan-400' 
      : isLight ? 'text-neutral-400' : 'text-white/50'
  }`} />
  )}
 </button>

 {/* DROPDOWN MENU */}
 <AnimatePresence>
 {link.dropdown && activeDropdown === link.name && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.98 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.98 }}
 className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 ${link.isMega ? 'w-[600px]' : 'w-64'}`}
 >
  <div className={`rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl ${
    isLight ? 'bg-white border border-neutral-200 shadow-xl' : 'bg-[#0D121F] border border-white/10'
  }`}>
 <div className={link.isMega ?"grid grid-cols-2 gap-4":"flex flex-col gap-1"}>
 {link.dropdown.map((sub) => (
 <button
 key={sub.name}
 onClick={() => navigate(sub.path)}
 className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
 >
 {sub.icon && (
 <div className="mt-1 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
 <sub.icon className="w-4 h-4 text-cyan-400"/>
 </div>
 )}
  <div>
  <div className={`text-sm font-bold transition-colors uppercase tracking-tight ${
    isLight ? 'text-neutral-800 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'
  }`}>
  {sub.name}
  </div>
  {sub.desc && (
  <div className={`text-[11px] mt-0.5 leading-tight ${isLight ? 'text-neutral-400' : 'text-white/40'}`}>
  {sub.desc}
  </div>
  )}
  </div>
 </button>
 ))}
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 ))}
 </div>

 {/* CTA — equal flex weight to logo side */}
 <div className="hidden lg:flex flex-1 items-center justify-end gap-2.5">
   {loading ? (
     <div className={`w-8 h-8 rounded-full animate-pulse ${isLight ? 'bg-neutral-200' : 'bg-white/20'}`} />
   ) : isLoggedIn ? (
     <>
       <button
         onClick={() => navigate(dashboardPath)}
         className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-xl whitespace-nowrap ${
           isLight ? 'bg-neutral-900 text-white hover:bg-cyan-600' : 'bg-white text-black hover:bg-cyan-400'
         }`}
       >
         Dashboard
       </button>

       <CartButton />

       <div
         className="relative"
         onMouseEnter={() => setProfileOpen(true)}
         onMouseLeave={() => setProfileOpen(false)}
       >
         <button
           type="button"
           className="flex items-center justify-center rounded-full p-[2px] transition-all border-2 border-white hover:scale-105 shadow-sm"
           aria-label={`${profileName} profile`}
           aria-expanded={profileOpen}
         >
           <Avatar />
         </button>

         <AnimatePresence>
           {profileOpen && (
             <motion.div
               initial={{ opacity: 0, y: 8, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 8, scale: 0.98 }}
               className="absolute top-full right-0 pt-3 z-[120]"
             >
               <div className={`min-w-[180px] rounded-2xl p-2 shadow-2xl backdrop-blur-2xl ${
                 isLight ? 'bg-white border border-neutral-200' : 'bg-[#0D121F] border border-white/10'
               }`}>
                 <div className={`px-3 py-2 mb-1 border-b ${isLight ? 'border-neutral-100' : 'border-white/10'}`}>
                   <p className={`text-xs font-bold truncate ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                     {profileName}
                   </p>
                   <p className={`text-[10px] truncate mt-0.5 ${isLight ? 'text-neutral-400' : 'text-white/40'}`}>
                     {user?.email || firebaseUser?.email}
                   </p>
                 </div>
                 <button
                   type="button"
                   onClick={handleSignOut}
                   className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black tracking-[0.15em] uppercase transition-colors ${
                     isLight
                       ? 'text-red-600 hover:bg-red-50'
                       : 'text-red-400 hover:bg-white/5'
                   }`}
                 >
                   <LogOut className="w-3.5 h-3.5" />
                   Logout
                 </button>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </>
   ) : (
     <>
       <button
         onClick={() => navigate('/register')}
         className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-xl whitespace-nowrap ${
           isLight ? 'bg-neutral-900 text-white hover:bg-cyan-600' : 'bg-white text-black hover:bg-cyan-400'
         }`}
       >
         Register
       </button>
       <CartButton />
     </>
   )}
 </div>

 {/* MOBILE: cart + menu */}
 <div className="lg:hidden relative z-[110] ml-auto flex items-center gap-2">
  <CartButton />
  <button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className={`p-3 rounded-xl border transition-all ${
    isLight 
      ? 'bg-neutral-900/5 border-neutral-900/10 text-neutral-800' 
      : 'bg-white/5 border-white/10 text-white'
  }`}
  >
 {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
 </button>
 </div>
 </div>
 </div>

 {/* MOBILE OVERLAY */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <motion.div
 initial={{ x: '100%' }}
 animate={{ x: 0 }}
 exit={{ x: '100%' }}
 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
 className="fixed inset-0 z-[105] bg-[#020617] lg:hidden flex flex-col p-8 pt-32 overflow-y-auto pointer-events-auto"
 >
 <div className="space-y-8">
 {navLinks.map((link, idx) => (
 <motion.div
 key={link.name}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: idx * 0.05 }}
 >
 <div className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-4">
 {link.name}
 </div>
 {link.dropdown ? (
 <div className="grid grid-cols-1 gap-4 pl-4 border-l border-white/5">
 {link.dropdown.map((sub) => (
 <button
 key={sub.name}
 onClick={() => navigate(sub.path)}
 className="text-xl font-bold text-white/70 hover:text-cyan-400 text-left"
 >
 {sub.name}
 </button>
 ))}
 </div>
 ) : (
 <button
 onClick={() => navigate(link.path)}
 className="text-4xl font-black tracking-tighter text-white hover:text-cyan-400 text-left uppercase"
 >
 {link.name}
 </button>
 )}
 </motion.div>
 ))}
 </div>

 <div className="mt-auto pt-12 pb-8 flex flex-col gap-3">
 {loading ? (
   <div className="w-full h-14 rounded-2xl animate-pulse bg-white/10" />
 ) : isLoggedIn ? (
 <>
 <button
 onClick={() => { setMobileMenuOpen(false); navigate(dashboardPath); }}
 className="w-full py-4 bg-white text-black rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl"
 >
 Dashboard
 </button>
 <div className="rounded-2xl border border-white/10 p-4 flex items-center gap-3">
 <span className="rounded-full border-2 border-white p-[2px] flex">
 <Avatar size="md" />
 </span>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-bold text-white truncate">{profileName}</p>
 <p className="text-[11px] text-white/40 truncate">{user?.email || firebaseUser?.email}</p>
 </div>
 </div>
 <button
 onClick={handleSignOut}
 className="w-full py-4 border border-red-500/30 text-red-400 rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-red-500/10 flex items-center justify-center gap-2"
 >
 <LogOut className="w-4 h-4" />
 Logout
 </button>
 </>
 ) : (
 <button
 onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
 className="w-full py-4 bg-white text-black rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl"
 >
 Register
 </button>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </nav>
 </>
 );
}
