import { Link } from 'react-router';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { ODILogo } from './ODILogo';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Work', href: '/work' },
      { name: 'Services', href: '/services' },
      { name: 'Products', href: '/products' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'WIP', href: '/wip' },
      { name: 'ODI Kids', href: '/odi-kids' },
    ]
  }
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D1B2A] border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <Link to="/" className="block mb-8 w-[140px] md:w-[160px] transition-transform hover:scale-105 origin-left">
              <ODILogo color="white" />
            </Link>
            <p className="text-white/70 mb-8 max-w-md leading-relaxed text-lg font-light">
              Oceaniek Dimension Industries is pioneering the future of visual experiences through innovative 2D to 3D conversion and immersive media design.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#06B6D4] hover:to-[#7C3AED] hover:border-transparent hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-white font-semibold text-lg tracking-wide mb-6">{group.title}</h4>
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-white/60 hover:text-white transition-colors duration-300 flex items-center group font-light"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] mr-0 group-hover:mr-3 transition-all duration-300 ease-out" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-lg tracking-wide mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-white/60 font-light group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#06B6D4]/20 group-hover:border-[#06B6D4]/50 transition-colors shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#06B6D4]" />
                </div>
                <span className="leading-relaxed">4th Floor, SM Heights, C-205, NH 5, Phase 8B, Industrial Area, Sector 74, Mohali, Punjab 160071</span>
              </li>
              <li className="flex items-center gap-4 text-white/60 font-light group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#7C3AED]/20 group-hover:border-[#7C3AED]/50 transition-colors shrink-0">
                  <Phone className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <span>+91 9876907266</span>
              </li>
              <li className="flex items-center gap-4 text-white/60 font-light group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#FF6B9D]/20 group-hover:border-[#FF6B9D]/50 transition-colors shrink-0">
                  <Mail className="w-4 h-4 text-[#FF6B9D]" />
                </div>
                <span>hello@odi.design</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm font-light">
            © {new Date().getFullYear()} Oceaniek Dimension Industries. All rights reserved.
          </p>
          
          <div className="flex gap-8 text-sm text-white/40 font-light">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium uppercase tracking-wider">Back to top</span>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-[#06B6D4] group-hover:to-[#7C3AED] group-hover:border-transparent transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
