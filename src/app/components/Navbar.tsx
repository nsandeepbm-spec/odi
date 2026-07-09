import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
 Menu, X, ChevronDown, ArrowRight, Sparkles, 
 MonitorPlay, Layers, Smartphone, Box, Film, BookOpen,
 type LucideIcon 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { ODILogo } from './ODILogo';

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
 { name: 'About', path: '/about' },
 {
 name: 'Services',
 path: '/services',
 isMega: true,
 dropdown: [
 { name: 'Stereo Conversion', path: '/services/3d-movie-conversion', icon: Film, desc: 'Cinematic depth for feature films.' },
 { name: '3D Books', path: '/services/3d-books', icon: BookOpen, desc: 'Premium 3D learning products for kids.' },
 ]
 },
 {
 name: 'Industries',
 path: '/industries',
 },
 { name: 'Work', path: '/work' },
 { name: 'Products', path: '/products' },
 { name: 'Careers', path: '/careers' },
];

export function Navbar() {
 const [isScrolled, setIsScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
 
  const navigate = useNavigate();
  const location = useLocation();

  // Light-bg pages: /products/space-explorer, /checkout, and /learn-more use dark-text navbar
  const isLight = location.pathname === '/products/space-explorer' || location.pathname === '/checkout' || location.pathname === '/learn-more';

 useEffect(() => {
 const handleScroll = () => setIsScrolled(window.scrollY > 20);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 useEffect(() => setMobileMenuOpen(false), [location]);

 return (
 <nav className="fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-all duration-500">
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-2 pb-4 md:pt-4 md:pb-6">
        <div 
          className={`pointer-events-auto relative flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 border ${
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
 className="relative z-[110] cursor-pointer w-24 md:w-28 hover:scale-105 transition-transform"
 onClick={() => navigate('/')}
 >
  <ODILogo color={isLight ? "black" : "white"}/>
 </div>

 {/* DESKTOP LINKS */}
 <div className="hidden lg:flex items-center gap-2">
 {navLinks.map((link) => (
 <div 
 key={link.name}
 className="relative"
 onMouseEnter={() => setActiveDropdown(link.name)}
 onMouseLeave={() => setActiveDropdown(null)}
 >
 <button
  onClick={() => !link.dropdown && navigate(link.path)}
  className={`px-4 py-2 text-[11px] font-black tracking-[0.2em] uppercase transition-all flex items-center gap-1.5 ${
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
 className={`absolute top-full left-0 pt-4 ${link.isMega ? '-left-48 w-[600px]' : 'w-64'}`}
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
 {/* Logic to only show icon if it exists */}
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
  {/* Logic to only show description if it exists */}
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

 {/* CTA */}
  <button
  onClick={() => navigate('/contact')}
  className={`ml-6 px-6 py-3 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all shadow-xl ${
    isLight ? 'bg-neutral-900 text-white hover:bg-cyan-600' : 'bg-white text-black hover:bg-cyan-400'
  }`}
  >
 Get in Touch
 </button>
 </div>

 {/* MOBILE TRIGGER */}
  <button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className={`lg:hidden relative z-[110] p-3 rounded-xl border transition-all ${
    isLight 
      ? 'bg-neutral-900/5 border-neutral-900/10 text-neutral-800' 
      : 'bg-white/5 border-white/10 text-white'
  }`}
  >
 {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
 </button>
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

 <div className="mt-auto pt-12 pb-8">
 <button
 onClick={() => navigate('/contact')}
 className="w-full py-5 bg-white text-black rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl"
 >
 Contact Our Team
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </nav>
 );
}