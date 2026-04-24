import { motion } from 'motion/react';
import { Rocket, Target, Zap, Users, ChevronRight } from 'lucide-react';

const benefits = [
  { icon: Rocket, text: 'Work on real projects' },
  { icon: Zap, text: 'Learn fast' },
  { icon: Target, text: 'Build future-ready skills' },
];

const roles = [
  'Designers',
  '3D Artists',
  'Editors',
  'Creative thinkers',
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Join <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">ODI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            Shape the future of spatial media and immersive content.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Why Join Us */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8">Why Join Us?</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4]/20 to-[#7C3AED]/20 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-[#06B6D4]" />
                  </div>
                  <span className="text-xl font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Open Roles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8">We are looking for:</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {roles.map((role) => (
                <div key={role} className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-[#7C3AED]/10 to-transparent border border-white/10 hover:border-[#7C3AED]/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#7C3AED]" />
                    <span className="font-semibold text-lg">{role}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            {/* Apply CTA */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#06B6D4]/10 to-[#7C3AED]/10 border border-white/10 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to build the future?</h3>
              <p className="text-white/60 mb-8">Send us your portfolio and let's talk.</p>
              <button className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                Apply Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
