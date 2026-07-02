import { Link } from 'react-router';
import { Instagram, Linkedin, Youtube, Video, Mail, ArrowRight, Star, Globe, Monitor } from 'lucide-react';
import { ODILogo } from './ODILogo';

export function Footer() {
  return (
    <footer className="bg-[#080808] text-white pt-20 pb-8 border-t border-white/10" style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Brand & Info (Span 4) */}
          <div className="lg:col-span-4 pr-0 lg:pr-8">
            <Link to="/" className="block mb-8 w-[140px]">
              <ODILogo color="white" />
            </Link>
            
            <div className="w-8 h-px bg-[#00C8FF] mb-6" />
            
            <h3 className="text-xl md:text-2xl font-light leading-snug mb-6 text-white/90">
              We create stereoscopic<br />
              experiences that bring<br />
              stories, ideas and visions<br />
              closer to life.
            </h3>
            
            <p className="text-[#B8B8B8] text-sm leading-relaxed mb-10 font-light">
              From concept to final frame, we craft depth<br />
              that feels natural, immersive and unforgettable.
            </p>
            
            <div className="flex gap-4">
              {[Instagram, Linkedin, Youtube, Video].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all duration-300"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Links Grid (Span 5) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-4 pt-4">
            {/* EXPLORE */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">Explore</h4>
              <ul className="space-y-4">
                {['Experience', 'Work', 'Playground', 'Studio', 'Journal', 'Careers'].map(link => (
                  <li key={link}>
                    <Link to="#" className="text-[#B8B8B8] text-sm font-light hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* WHAT WE DO */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">What We Do</h4>
              <ul className="space-y-4">
                {['Stereo Books', 'Stereo Content', 'Stereo Conversion', '3D Production', 'Depth Consulting'].map(link => (
                  <li key={link}>
                    <Link to="#" className="text-[#B8B8B8] text-sm font-light hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* INDUSTRIES */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">Industries</h4>
              <ul className="space-y-4">
                {['Publishing', 'Cinema & OTT', 'Music & Events', 'Medical & Education', 'Museums & Exhibits', 'Automotive & Retail', 'Architecture & Design', 'Gaming & Animation'].map(link => (
                  <li key={link}>
                    <Link to="#" className="text-[#B8B8B8] text-sm font-light hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* RESOURCE */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#00C8FF] uppercase mb-6">Resource</h4>
              <ul className="space-y-4">
                {['Journal', 'Case Studies', 'Behind the Scenes', 'FAQs', 'Sitemap'].map(link => (
                  <li key={link}>
                    <Link to="#" className="text-[#B8B8B8] text-sm font-light hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Feature Card (Span 3) */}
          <div className="lg:col-span-3 pt-4">
            <div className="border border-white/10 rounded-sm overflow-hidden h-full flex flex-col relative group">
              <div className="h-48 overflow-hidden relative bg-[#111]">
                {/* Fallback image resembling the dark studio with a chair */}
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80" 
                  alt="Studio Chair" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                <div className="absolute top-4 w-full flex justify-center">
                  {/* Subtle logo mark on the chair image */}
                  <span className="text-[10px] tracking-widest text-white/50 uppercase">ODI.STUDIO</span>
                </div>
              </div>
              <div className="p-6 bg-[#080808] flex-1 flex flex-col justify-between -mt-8 relative z-10">
                <div>
                  <h4 className="text-xl font-light mb-3">Let's create something<br/>with real depth.</h4>
                  <p className="text-[#B8B8B8] text-[11px] leading-relaxed mb-6">
                    Have a project in mind or just want to<br/>explore ideas? We'd love to hear from you.
                  </p>
                </div>
                <button className="w-full py-3 border border-[#00C8FF]/40 text-[#00C8FF] text-[10px] uppercase tracking-[0.2em] flex items-center justify-between px-4 hover:bg-[#00C8FF]/10 transition-colors">
                  <span>Start a Project</span>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
          
        </div>

        {/* MIDDLE SECTION (Newsletter & Highlights) */}
        <div className="border border-white/10 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          
          {/* Newsletter */}
          <div className="flex items-start gap-4 lg:w-1/3">
            <Mail className="text-[#00C8FF] shrink-0 mt-1" size={24} strokeWidth={1.2} />
            <div>
              <h5 className="text-[10px] tracking-[0.2em] text-[#00C8FF] font-bold uppercase mb-2">Stay in the loop</h5>
              <p className="text-[#B8B8B8] text-xs font-light mb-4">
                Stories, insights and creative process<br/>delivered to your inbox.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="bg-transparent border border-white/20 px-4 py-2 text-xs w-full focus:outline-none focus:border-white/50 text-white"
                />
                <button className="border border-white/20 border-l-0 px-4 py-2 text-[10px] uppercase tracking-[0.1em] text-[#00C8FF] hover:bg-white/5 transition-colors flex items-center gap-2">
                  Subscribe <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:w-2/3 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8">
            <div className="flex items-start gap-3">
              <Star className="text-[#00C8FF] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
              <div>
                <h6 className="text-[10px] font-bold tracking-wide uppercase mb-1">Award-Winning Work</h6>
                <p className="text-[#B8B8B8] text-[11px] leading-relaxed">International recognition<br/>for immersive excellence.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Globe className="text-[#00C8FF] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
              <div>
                <h6 className="text-[10px] font-bold tracking-wide uppercase mb-1">Global Collaborations</h6>
                <p className="text-[#B8B8B8] text-[11px] leading-relaxed">Trusted by creators and<br/>brands around the world.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Monitor className="text-[#00C8FF] shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
              <div>
                <h6 className="text-[10px] font-bold tracking-wide uppercase mb-1">Built For Every Platform</h6>
                <p className="text-[#B8B8B8] text-[11px] leading-relaxed">Delivering depth for screens,<br/>spaces and experiences.</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#B8B8B8] text-[11px] font-light">
            © {new Date().getFullYear()} ODI Studio. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-[#B8B8B8] text-[11px] font-light">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/20">|</span>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-white/20">|</span>
            <Link to="#" className="hover:text-white transition-colors">Cookies Policy</Link>
          </div>
          
          <p className="text-[#B8B8B8] text-[11px] font-light">
            Crafted with depth in India. Delivered worldwide.
          </p>
        </div>

      </div>
    </footer>
  );
}
