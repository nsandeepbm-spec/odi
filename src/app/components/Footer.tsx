import { Link } from 'react-router';
import { Instagram, Linkedin, Youtube, Facebook, ArrowRight } from 'lucide-react';
import { ODILogo } from './ODILogo';

const exploreLinks = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'About', to: '/about' },
  { name: 'Industries', to: '/industries' },
  { name: 'Careers', to: '/careers' },
] as const;

const serviceLinks = [
  { name: 'Services', to: '/services' },
  { name: 'Stereo Conversion', to: '/services/3d-movie-conversion' },
  { name: '3D Books', to: '/services/3d-books' },
] as const;

const resourceLinks = [
  { name: 'Learn More', to: '/learn-more' },
  { name: 'Contact', to: '/contact' },
] as const;

const socialLinks = [
  { Icon: Instagram, href: 'https://www.instagram.com/odi3dstudio/', label: 'Instagram' },
  {
    Icon: Facebook,
    href: 'https://www.facebook.com/people/Oceaniek-Dimension-Industries/61589448369192/',
    label: 'Facebook',
  },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/odistudioglobal', label: 'LinkedIn' },
  { Icon: Youtube, href: 'https://www.youtube.com/@ODI.STUDIO', label: 'YouTube' },
] as const;

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-[#B8B8B8] text-sm font-light hover:text-white transition-colors duration-300"
    >
      <span className="w-0 h-px bg-[#00C8FF] transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-[#080808] text-white pt-20 pb-8 border-t border-white/10"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] max-w-5xl rounded-full bg-[#00C8FF]/[0.06] blur-3xl"
      />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <Link to="/" className="block mb-8 w-[140px]">
              <ODILogo color="white" />
            </Link>

            <div className="w-8 h-px bg-[#00C8FF] mb-6" />

            <h3 className="text-xl md:text-2xl font-light leading-snug mb-5 text-white/90">
              We create stereoscopic
              <br />
              experiences that bring
              <br />
              stories, ideas and visions
              <br />
              closer to life.
            </h3>

            <p className="text-[#B8B8B8] text-sm leading-relaxed mb-10 font-light max-w-sm">
              From concept to final frame, we craft depth that feels natural, immersive and unforgettable.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/55 hover:text-white hover:border-[#00C8FF]/50 hover:bg-[#00C8FF]/10 transition-all duration-300"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links — real pages only */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-6 pt-2">
            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">Explore</h4>
              <ul className="space-y-3.5">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <FooterLink to={link.to}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">What We Do</h4>
              <ul className="space-y-3.5">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <FooterLink to={link.to}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">Resource</h4>
              <ul className="space-y-3.5">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <FooterLink to={link.to}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA card */}
          <div className="lg:col-span-3 pt-2">
            <div className="border border-white/10 rounded-xl overflow-hidden h-full flex flex-col relative group bg-[#0c0c0c]">
              <div className="h-44 overflow-hidden relative bg-[#111]">
                <img
                  src="/Footer.png"
                  alt="ODI Studio workspace with a stereoscopic 3D render, rocket model and anaglyph glasses"
                  className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/20 to-transparent" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between -mt-6 relative z-10">
                <div>
                  <h4 className="text-lg font-light mb-2 leading-snug">
                    Let&apos;s create something
                    <br />
                    with real depth.
                  </h4>
                  <p className="text-[#B8B8B8] text-[11px] leading-relaxed mb-5">
                    Have a project in mind? We&apos;d love to hear from you.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="w-full py-3 border border-[#00C8FF]/35 text-[#00C8FF] text-[10px] uppercase tracking-[0.2em] flex items-center justify-between px-4 hover:bg-[#00C8FF] hover:text-[#080808] transition-colors duration-300 rounded-sm"
                >
                  <span>Start a Project</span>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Soft watermark — brand atmosphere, not competing with links */}
        <div className="relative py-8 md:py-12 mb-8 overflow-hidden flex items-center justify-center border-t border-white/[0.06]">
          <div
            aria-hidden="true"
            className="pointer-events-none select-none flex items-baseline justify-center whitespace-nowrap font-black uppercase tracking-tight leading-none text-[18vw] md:text-[8rem] lg:text-[9.5rem] text-white/15"
          >
            <span>ODI</span>
            <span className="inline-block w-[0.28em] md:w-[0.4em]" />
            <span>STUDIO</span>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#B8B8B8] text-[11px] font-light">
            © {new Date().getFullYear()} ODI Studio. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[#B8B8B8] text-[11px] font-light">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies Policy
            </Link>
          </div>

          <p className="text-[#B8B8B8] text-[11px] font-light">
            Crafted with depth in India. Delivered worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
