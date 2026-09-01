import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const WHATSAPP_NUMBER = '919876907266';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function HeroIntro() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollDown = () => {    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-1000"
        >
          <source src="/ODI_SS1.mp4" type="video/mp4" />
        </video>
        {/* Dark Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/70 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
      </div>

      {/* Main Overlay Content */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 h-full flex flex-col justify-between pt-24 pb-8 md:pt-32 md:pb-10 min-h-screen">
        {/* Spacer */}
        <div className="flex-grow w-full" />

        {/* Hero Text / CTAs Layout (Samsung Style - Bottom/Center-Left) */}
        <div className="flex flex-col items-start text-left max-w-xl mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-2xl md:text-3xl lg:text-[40px] font-black tracking-tight text-white uppercase leading-[1.05] mb-4"
            >
              Step Into Real 3D.<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Space Explorer
              </span>
            </h1>

            <p
              className="text-xs md:text-sm lg:text-[15px] text-white/80 font-medium max-w-md leading-[1.5] tracking-wide mb-6"
            >
              A stereoscopic adventure where every page reveals a new world of depth. Put on your 3D glasses and experience space like never before.
            </p>

            {/* CTA Container */}
            <div className="flex flex-row items-center gap-6">
              {/* Afacad Flux Variable Weight Flex Button */}
              <motion.button
                onClick={() => navigate('/checkout?product=space-explorer')}
                whileHover={{
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.55)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  fontFamily: '"Afacad Flux", sans-serif',
                  fontWeight: 400
                }}
                className="px-6 py-3 bg-white text-black border border-white rounded-full text-[11px] tracking-wider uppercase cursor-pointer hover:bg-cyan-400 hover:border-cyan-400 transition-colors duration-300 font-bold shadow-md"
              >
                Buy Now
              </motion.button>

              <button
                onClick={() => navigate('/learn-more')}
                className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors duration-200"
              >
                <span className="border-b border-white/40 group-hover:border-white transition-all pb-0.5">
                  Learn more
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar: Play/Pause controls & Minimal Scroll Line */}
        <div className="w-full flex items-center justify-between pt-6 md:pt-10">
          {/* Circular Play/Pause (Samsung Mockup style) */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 z-30"
            title={isPlaying ? 'Pause Background' : 'Play Background'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Minimal line scroll indicator */}
          <div className="hidden md:flex flex-col items-center gap-2 cursor-pointer" onClick={scrollDown}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Scroll Down</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
          </div>

          <div className="w-11 h-11" /> {/* Spacer alignment */}
        </div>
      </div>

      {/* WhatsApp click-to-chat */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group"
      >
        <WhatsAppIcon className="w-7 h-7" />
        <span className="absolute right-16 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold tracking-widest text-white px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>
    </section>
  );
}