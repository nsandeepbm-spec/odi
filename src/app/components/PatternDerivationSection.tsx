import { motion } from 'motion/react';

export function PatternDerivationSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#7C3AED]/10 to-[#06B6D4]/10 rounded-full text-sm font-medium mb-6 border border-gray-200">
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">06 — Graphic Elements</span>
          </span>
          <h3 className="text-5xl md:text-6xl mb-6 font-bold text-gray-900">
            Geometric Patterns
          </h3>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl leading-relaxed">
            Every graphic element in the ODI system is mathematically derived from the logo's core geometry—
            creating a cohesive visual language.
          </p>
        </motion.div>

        {/* Pattern Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Split-O Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border-2 border-gray-200 rounded-2xl p-8 bg-white hover:shadow-xl transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-[#06B6D4]/10 to-[#7C3AED]/10 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
              <svg className="w-32 h-32" viewBox="0 0 194.875 194.873" fill="none">
                <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="#06B6D4"/>
                <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="#06B6D4"/>
              </svg>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Split-O Element</h4>
            <p className="text-sm text-gray-600">Core geometric shape derived from logo signature</p>
          </motion.div>

          {/* Circular Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-2 border-gray-200 rounded-2xl p-8 bg-white hover:shadow-xl transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-[#7C3AED]" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
                <div className="absolute inset-4 rounded-full border-4 border-[#06B6D4]" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
              </div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Concentric Rings</h4>
            <p className="text-sm text-gray-600">Spatial audio waves and dimensional depth</p>
          </motion.div>

          {/* Arc Pattern */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-2 border-gray-200 rounded-2xl p-8 bg-white hover:shadow-xl transition-all"
          >
            <div className="aspect-square bg-gradient-to-br from-[#06B6D4]/10 to-[#7C3AED]/10 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <path d="M 10 50 A 40 40 0 0 1 50 10" stroke="#06B6D4" strokeWidth="4" fill="none" />
                <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="#7C3AED" strokeWidth="4" fill="none" />
                <path d="M 90 50 A 40 40 0 0 1 50 90" stroke="#06B6D4" strokeWidth="4" fill="none" />
                <path d="M 50 90 A 40 40 0 0 1 10 50" stroke="#7C3AED" strokeWidth="4" fill="none" />
              </svg>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Arcs</h4>
            <p className="text-sm text-gray-600">Motion and sound wave representation</p>
          </motion.div>
        </div>

        {/* Application Examples */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-2 border-gray-200 rounded-3xl p-12 bg-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#7C3AED]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#06B6D4]/5 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-gray-900 mb-8">Pattern Applications</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Background Pattern */}
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {[...Array(6)].map((_, i) => (
                      <g key={i} transform={`translate(${(i % 3) * 140}, ${Math.floor(i / 3) * 140})`}>
                        <path d="M 30 10 V 30 C 30 31 29 32 28 32 C 20 38 15 47 15 57 C 15 67 20 76 28 82 C 29 83 30 84 30 85 V 105" stroke="white" strokeWidth="2" fill="none" />
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="relative z-10 text-white">
                  <h5 className="text-lg font-semibold mb-2">Background Graphics</h5>
                  <p className="text-sm text-white/80">Subtle pattern overlays for depth</p>
                </div>
              </div>

              {/* Accent Elements */}
              <div className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
                  </svg>
                </div>
                <div className="relative z-10 text-white">
                  <h5 className="text-lg font-semibold mb-2">Accent Details</h5>
                  <p className="text-sm text-white/80">Decorative elements for emphasis</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}