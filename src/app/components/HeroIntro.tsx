import { motion } from 'motion/react';
import { ODILogo } from './ODILogo';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';

export function HeroIntro() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white flex items-center justify-center relative overflow-hidden px-4 md:px-6 lg:px-8">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-br from-[#7C3AED] to-[#9333EA] opacity-20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[350px] h-[350px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] bg-gradient-to-br from-[#06B6D4] to-[#0891B2] opacity-20 rounded-full blur-3xl"
        />
      </div>

      {/* ODI Logo reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2,
          delay: 0.3,
          ease: [0.25, 0.1, 0.25, 1] 
        }}
        className="relative z-10 flex flex-col items-center w-full max-w-2xl"
      >
        {/* <div className="inline-flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-[#7C3AED]/10 to-[#06B6D4]/10 backdrop-blur-md rounded-full border border-white/10 mb-8 md:mb-10 lg:mb-12">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-full animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-white/90">Brand Guidelines 2026</span>
        </div> */}

        <div className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[500px] h-auto mb-6 md:mb-8">
          <ODILogo color="white" />
        </div>
        
        {/* Company tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-white/90 text-2xl md:text-4xl lg:text-5xl font-bold uppercase mb-4 md:mb-6 text-center px-4 tracking-widest bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
        >
          SEE BEYOND THE FRAME
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 1.7
          }}
          className="text-base md:text-lg lg:text-xl text-white/80 font-medium text-center px-4 mb-10 md:mb-12 max-w-[500px]"
        >
          We create depth-driven visual experiences for next-generation media.
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          onClick={() => navigate('/wip')}
          className="group relative px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center gap-2 md:gap-3 text-white">
            ODI kids Vision
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
          </span>
        </motion.button>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#06B6D4]/0 via-[#7C3AED]/10 to-[#06B6D4]/0 pointer-events-none blur-3xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/50 uppercase tracking-wider">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 md:h-16 bg-gradient-to-b from-[#06B6D4] via-[#7C3AED] to-transparent"
        />
      </motion.div>
    </section>
  );
}