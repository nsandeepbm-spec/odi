import { motion } from 'motion/react';
import { Layers, Cuboid, MonitorPlay, BookOpen, Presentation, Glasses } from 'lucide-react';

const whatWeDo = [
  { icon: Layers, title: 'Stereo 3D Conversion', desc: 'Transforming 2D content into high-quality stereoscopic 3D.' },
  { icon: Cuboid, title: 'Spatial Media', desc: 'Content designed for immersive and future-ready platforms.' },
  { icon: MonitorPlay, title: 'Immersive Content', desc: 'Deeply engaging visual experiences.' },
];

const products = [
  { icon: BookOpen, title: 'ODI Kids 3D Books', desc: 'Premium 3D learning books.' },
  { icon: Presentation, title: '3D Learning Kits', desc: 'Interactive educational kits.' },
  { icon: Glasses, title: 'Anaglyph Content', desc: 'Classic anaglyph visual experiences.' },
];

export function HomeFeatures() {
  return (
    <section className="py-24 bg-[#0D1B2A] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16">
          {/* What We Do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">
              What We Do
            </h2>
            <div className="space-y-6">
              {whatWeDo.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4]/20 to-[#7C3AED]/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#06B6D4]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#7C3AED] to-[#FF6B9D] bg-clip-text text-transparent">
              Products
            </h2>
            <div className="space-y-6">
              {products.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#FF6B9D]/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#FF6B9D]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
