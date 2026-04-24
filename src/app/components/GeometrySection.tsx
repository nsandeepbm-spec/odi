import { motion } from 'motion/react';
import { ODILogo } from './ODILogo';

export function GeometrySection() {
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
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">03 — Logo Construction</span>
          </span>
          <h3 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Engineered Geometry
          </h3>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl leading-relaxed">
            The ODI wordmark is built on geometric precision with a signature split-O detail that represents spatial audio technology.
          </p>
        </motion.div>

        {/* Full Logo Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="border-2 border-gray-200 rounded-3xl p-16 mb-16 bg-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#06B6D4]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#7C3AED]/10 to-transparent rounded-full blur-3xl" />
          
          <div className="flex items-center justify-center mb-8 relative z-10">
            <div className="w-full max-w-2xl">
              <ODILogo color="#1F2937" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            The complete ODI wordmark — geometric typography with signature split-O detail
          </p>
        </motion.div>

        {/* The Signature Feature */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border-2 border-[#06B6D4]/30 rounded-2xl p-12 mb-16 bg-gradient-to-br from-[#06B6D4]/5 to-white"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-3xl font-bold text-gray-900 mb-6">
                The Signature: <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">Split-O</span>
              </h4>
              <p className="text-gray-700 leading-relaxed mb-8">
                The defining characteristic of the ODI logo is the split opening on the left side of the O. 
                This isn't decorative—it's functional storytelling that communicates our core technology.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">Dimensional Depth</h5>
                    <p className="text-sm text-gray-600">The opening suggests 3D space and layered audio fields in spatial cinema</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9333EA] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">Stereo Separation</h5>
                    <p className="text-sm text-gray-600">Visual representation of left-right audio channels and spatial separation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] via-[#8B5CF6] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">Sound Wave Portal</h5>
                    <p className="text-sm text-gray-600">Entry point into immersive spatial audio experience and sonic dimension</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-80 bg-white rounded-2xl border-2 border-gray-200 p-12">
                  <ODILogo color="#1F2937" />
                </div>
                {/* Annotation arrow pointing to the split */}
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-mono text-[#06B6D4] font-bold uppercase">Split Detail</p>
                    <p className="text-[10px] text-gray-600">Signature feature</p>
                  </div>
                  <svg width="60" height="2" viewBox="0 0 60 2" className="flex-shrink-0">
                    <line x1="0" y1="1" x2="55" y2="1" stroke="#06B6D4" strokeWidth="2" />
                    <polygon points="60,1 55,0 55,2" fill="#06B6D4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Construction Details */}
        <h4 className="text-2xl font-bold text-gray-900 mb-8">Geometric Construction</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Letter O Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-2 border-gray-200 rounded-2xl p-8 bg-white"
          >
            <div className="aspect-square flex items-center justify-center mb-6 relative bg-gray-50 rounded-xl">
              <svg viewBox="0 0 200 200" className="w-full h-full p-8">
                {/* Grid guides */}
                <circle cx="100" cy="100" r="60" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                
                {/* The O with split */}
                <path
                  d="M 65 12.83 V 54.67 C 65 56.09 64 57.46 63 58.4 C 52 67.88 45 81.86 45 97.45 C 45 113.04 52 127 63 136.49 C 64 137.42 65 138.79 65 140.22 V 182.07 C 65 185.65 61 188.12 58 186.67 C 23 171.56 0 137.29 0 97.44 C 0 57.59 23 23.32 58 8.23 C 61 6.79 65 9.25 65 12.83 Z"
                  transform="translate(55, 5) scale(0.7)"
                  fill="#1F2937"
                />
                <path
                  d="M 194 99.19 C 193 152.68 149 195.72 95 194.86 C 93 194.83 91 194.74 89 194.59 C 87 194.39 85 192.2 85 189.6 V 153.72 C 85 150.72 87 148.39 90 148.76 C 93 149.08 96 149.22 98 149.15 C 125 148.45 147 126.82 149 99.95 C 150 70.23 126 45.7 97 45.7 C 95 45.7 93 45.84 90 46.11 C 87 46.48 85 44.15 85 41.15 V 5.27 C 85 2.68 87 0.49 89 0.29 C 92 0.09 94 0 97 0 C 151 0 195 44.57 194 99.19 Z"
                  transform="translate(5, 5) scale(0.7)"
                  fill="#1F2937"
                />
                
                {/* Split indicator */}
                <line x1="30" y1="85" x2="30" y2="115" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h5 className="font-mono text-2xl mb-2 text-gray-900">O</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Signature Split</strong><br />
              Left-side opening creates dimension. Represents spatial audio separation and stereo field.
            </p>
          </motion.div>

          {/* Letter D Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-2 border-gray-200 rounded-2xl p-8 bg-white"
          >
            <div className="aspect-square flex items-center justify-center mb-6 relative bg-gray-50 rounded-xl">
              <svg viewBox="0 0 200 200" className="w-full h-full p-8">
                {/* Grid guides */}
                <line x1="60" y1="40" x2="60" y2="160" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                <line x1="50" y1="40" x2="150" y2="40" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                <line x1="50" y1="160" x2="150" y2="160" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                
                {/* D letter simplified */}
                <rect x="60" y="50" width="25" height="100" fill="#1F2937" />
                <path d="M 85 50 Q 130 50 130 100 Q 130 150 85 150 Z" fill="#1F2937" />
                
                {/* Dimension indicators */}
                <line x1="130" y1="95" x2="130" y2="105" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h5 className="font-mono text-2xl mb-2 text-gray-900">D</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Bold Form</strong><br />
              Solid construction with balanced curves. Strong, technical presence with geometric precision.
            </p>
          </motion.div>

          {/* Letter I Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-2 border-gray-200 rounded-2xl p-8 bg-white"
          >
            <div className="aspect-square flex items-center justify-center mb-6 relative bg-gray-50 rounded-xl">
              <svg viewBox="0 0 200 200" className="w-full h-full p-8">
                {/* Grid guides */}
                <line x1="85" y1="30" x2="85" y2="170" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                <line x1="115" y1="30" x2="115" y2="170" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                
                {/* I letter */}
                <rect x="85" y="50" width="30" height="100" fill="#1F2937" />
                
                {/* Width indicator */}
                <line x1="85" y1="35" x2="115" y2="35" stroke="#7C3AED" strokeWidth="2" />
                <line x1="85" y1="30" x2="85" y2="40" stroke="#7C3AED" strokeWidth="2" />
                <line x1="115" y1="30" x2="115" y2="40" stroke="#7C3AED" strokeWidth="2" />
                <text x="100" y="28" fontSize="10" fill="#7C3AED" textAnchor="middle">Width</text>
              </svg>
            </div>
            <h5 className="font-mono text-2xl mb-2 text-gray-900">I</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Vertical Bar</strong><br />
              Minimal, precise form. Clean termination and perfect alignment. Used for clear space measurement.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}