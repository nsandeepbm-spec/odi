import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';
import visionProImage from '../images/vision-pro.jpg';

export function HeroIntro() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0D1B2A]">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src={visionProImage}
            alt="Vision Pro Background"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#0D1B2A]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/50 to-[#0D1B2A]/20" />
      </div>

      {/* Animated gradient orbs for extra premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#06B6D4] opacity-20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7C3AED] opacity-20 rounded-full blur-[150px]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="flex flex-col items-center w-full"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase mb-8 flex flex-col items-center leading-none drop-shadow-2xl"
          >
            <span className="font-light tracking-[0.2em] sm:tracking-[0.3em] text-white/90 mb-2 md:mb-4">
              SEE BEYOND
            </span>
            <span className="font-bold tracking-tighter bg-gradient-to-r from-[#06B6D4] via-white to-[#7C3AED] bg-clip-text text-transparent pb-2">
              THE FRAME
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5
            }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/70 font-light tracking-wide mb-12 max-w-3xl leading-relaxed drop-shadow-lg"
          >
            We create <strong className="text-white font-medium">depth-driven visual </strong> for next-generation media.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <button
              onClick={() => navigate('/wip')}
              className="group relative px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-sm md:text-base lg:text-lg transition-all duration-500 hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-3 text-white tracking-wider uppercase">
                ODI kids Vision
                <Sparkles className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="text-xs text-white/60 uppercase tracking-widest font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-16 bg-gradient-to-b from-[#06B6D4] via-[#7C3AED] to-transparent"
        />
      </motion.div>
    </section>
  );
}