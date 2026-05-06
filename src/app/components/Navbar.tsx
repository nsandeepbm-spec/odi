import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ODILogo } from './ODILogo';
import { useNavigate, useLocation } from 'react-router';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { 
    name: 'Services', 
    path: '/services',
    dropdown: [
      { name: '3D Movie Conversion', path: '/services/3d-movie-conversion' },
      { name: '3D Short Films', path: '/services/3d-short-films' },
      { name: '3D Reels & Vertical Content', path: '/services/3d-reels-vertical' },
      { name: 'Immersive Advertising', path: '/services/immersive-advertising' },
      { name: 'Depth Compositing & Cleanup', path: '/services/depth-compositing' },
      { name: 'VR / Vision Pro Content Prep', path: '/services/vr-vision-pro' },
    ]
  },
  { name: 'Products', path: '/wip' },
  { name: 'Work', path: '/work' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0D1B2A]/80 backdrop-blur-lg border-b border-white/10 py-3 shadow-lg' 
          : 'bg-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer w-[100px] md:w-[130px] relative z-50 transition-transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            <ODILogo color="white" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <div key={link.name} className="relative group">
                  <button
                    onClick={() => navigate(link.path)}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />}
                    
                    {/* Hover Line */}
                    <span 
                      className={`absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] origin-left transition-transform duration-300 rounded-full ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} 
                    />
                  </button>

                  {/* Desktop Dropdown */}
                  {link.dropdown && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                      <div className="w-64 py-2 rounded-xl bg-[#0D1B2A]/95 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col">
                        {link.dropdown.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => navigate(subItem.path)}
                            className="text-left px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Call to action button */}
            <button
              onClick={() => navigate('/contact')}
              className="ml-4 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)]"
            >
              Get in Touch
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden relative z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors bg-white/5 rounded-md border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#0D1B2A]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4 flex flex-col h-full overflow-y-auto">
              {navLinks.map((link, index) => (
                <div key={link.name}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      if (link.dropdown) {
                        setMobileDropdownOpen(mobileDropdownOpen === link.name ? null : link.name);
                      } else {
                        navigate(link.path);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 text-xl font-medium rounded-lg transition-colors ${
                      location.pathname === link.path && !link.dropdown
                        ? 'text-white bg-white/10 border border-white/5' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {link.dropdown && (
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdownOpen === link.name ? 'rotate-180' : ''}`} />
                    )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {link.dropdown && mobileDropdownOpen === link.name && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-8 pr-4 py-2 flex flex-col space-y-2 overflow-hidden"
                      >
                        {link.dropdown.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => {
                              navigate(subItem.path);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left py-2 text-white/60 hover:text-white text-base transition-colors"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-8"
              >
                <button
                  onClick={() => {
                    navigate('/contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] hover:opacity-90 transition-opacity text-center shadow-lg"
                >
                  Get in Touch
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
