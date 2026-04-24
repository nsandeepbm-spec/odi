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
    <footer className="bg-[#0D1B2A] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#FF6B9D] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ODILogo className="w-6 h-6" color="white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ODI</span>
            </Link>
            <p className="text-white/60 mb-8 max-w-xs leading-relaxed">
              Oceaniek Dimension Industries is pioneering the future of visual experiences through innovative 2D to 3D conversion and immersive design.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#06B6D4] hover:to-[#3B82F6] hover:border-transparent transition-all duration-300"
                >
                  <Icon className="w-5 h-5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-bold mb-6">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-[#06B6D4] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[#06B6D4] mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-[#FF6B9D] shrink-0 mt-0.5" />
                <span>4th Floor, SM Heights, C-205, NH 5, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160071</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-[#FF6B9D] shrink-0" />
                <span>+91 9876907266</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="w-5 h-5 text-[#FF6B9D] shrink-0" />
                <span>hello@odi.design</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Oceaniek Dimension Industries. All rights reserved.
          </p>
          
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <span className="text-sm">Back to top</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#06B6D4] group-hover:border-transparent transition-all">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
