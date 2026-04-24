import { motion } from 'motion/react';
import { ODILogo } from '../components/ODILogo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white">
              ABOUT <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">ODI</span>
            </h1>
            
            <div className="space-y-6 text-lg md:text-xl text-white/70 leading-relaxed">
              <p>
                <strong className="text-white font-semibold">ODI</strong> is a creative technology studio focused on building depth-driven visual experiences.
              </p>
              <p>
                We work at the intersection of design, storytelling, and emerging media to bring imagination into a spatial reality.
              </p>
              
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#06B6D4] to-[#7C3AED]" />
                <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                <p className="text-[#06B6D4] font-medium text-xl">
                  "To redefine how visual content is experienced in the future."
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 via-[#7C3AED]/20 to-[#FF6B9D]/20 rounded-[3rem] blur-3xl" />
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-[#1B263B]/50 border border-white/10 backdrop-blur-xl">
              <img 
                src="https://www.apple.com/newsroom/videos/media/eyesight/posters/Apple-WWDC23-Vision-Pro-EyeSight-230605.jpg.large_2x.jpg" 
                alt="Spatial Visual Technology" 
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
