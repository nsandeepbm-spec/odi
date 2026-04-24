import { motion } from 'motion/react';
import { BookOpen, Map, PawPrint, Waves, Glasses, Cuboid } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B9D]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7C3AED] via-[#FF6B9D] to-[#FFB800] bg-clip-text text-transparent">
            PRODUCTS
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Discover our premium 3D learning books and kits designed for immersive education.
          </p>
        </motion.div>

        {/* ODI Kids Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-8 justify-center">
            <BookOpen className="w-8 h-8 text-[#FF6B9D]" />
            <h2 className="text-3xl font-bold">ODI Kids</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Map, title: 'Space Explorer', color: 'from-blue-500 to-cyan-400' },
              { icon: PawPrint, title: 'Dino World', color: 'from-green-500 to-emerald-400' },
              { icon: Waves, title: 'Ocean Depths', color: 'from-blue-600 to-indigo-500' }
            ].map((product) => (
              <motion.div
                key={product.title}
                whileHover={{ y: -10 }}
                className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 text-center group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <product.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Offerings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">
            Additional Offerings
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-6 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <Glasses className="w-10 h-10 text-[#06B6D4] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Anaglyph Visual Content</h3>
                <p className="text-white/60">Classic anaglyph visual experiences tailored for impactful learning.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
              <Cuboid className="w-10 h-10 text-[#7C3AED] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Interactive 3D Experiences</h3>
                <p className="text-white/60">Next-generation immersive kits that engage and educate.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
