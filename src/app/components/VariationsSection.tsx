import { motion } from 'motion/react';
import { ODILogo } from './ODILogo';

export function VariationsSection() {
 return (
 <section className="min-h-screen bg-white py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: 0.8 }}
 >
 <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#7C3AED]/10 to-[#06B6D4]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
 <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">02 — Brand Variations</span>
 </span>
 <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-900">
 Usage Guidelines
 </h3>
 <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
 Proper logo application ensures brand consistency across all touchpoints. 
 Follow these guidelines for optimal visual impact and recognition.
 </p>
 </motion.div>

 {/* Full Wordmark vs Icon */}
 <div className="mb-16 md:mb-24 lg:mb-32">
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">When to Use Each Format</h4>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
 {/* Full Wordmark Usage */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="bg-gradient-to-br from-[#06B6D4]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#06B6D4]/20"
 >
 <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center mb-4 md:mb-6">
 <svg className="w-7 h-7 md:w-8 md:h-8"viewBox="0 0 24 24"fill="none"stroke="#06B6D4"strokeWidth="2">
 <rect x="3"y="3"width="18"height="18"rx="2"/>
 <path d="M3 9h18M9 21V9"/>
 </svg>
 </div>
 <h5 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Full Wordmark</h5>
 <div className="bg-white rounded-xl p-6 md:p-8 mb-4 md:mb-6 border border-gray-200">
 <div className="w-full max-w-[180px] md:max-w-[200px] mx-auto">
 <ODILogo color="#06B6D4"/>
 </div>
 </div>
 <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0"></div>
 <p>Primary brand identification</p>
 </div>
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0"></div>
 <p>Marketing materials and presentations</p>
 </div>
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0"></div>
 <p>Website headers and hero sections</p>
 </div>
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0"></div>
 <p>When space allows (min. 120px width)</p>
 </div>
 </div>
 </motion.div>

 {/* Icon Usage */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="bg-gradient-to-br from-[#7C3AED]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#7C3AED]/20"
 >
 <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-4 md:mb-6">
 <svg className="w-7 h-7 md:w-8 md:h-8"viewBox="0 0 24 24"fill="none"stroke="#7C3AED"strokeWidth="2">
 <circle cx="12"cy="12"r="10"/>
 <path d="M12 2v20"/>
 </svg>
 </div>
 <h5 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Icon Mark Only</h5>
 <div className="bg-white rounded-xl p-6 md:p-8 mb-4 md:mb-6 border border-gray-200">
 <svg className="w-20 md:w-24 mx-auto"viewBox="0 0 194.875 194.873">
 <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z"fill="#7C3AED"/>
 <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z"fill="#06B6D4"/>
 </svg>
 </div>
 <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0"></div>
 <p>App icons and favicons</p>
 </div>
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0"></div>
 <p>Social media profile images</p>
 </div>
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0"></div>
 <p>Small or square spaces</p>
 </div>
 <div className="flex items-start gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0"></div>
 <p>When brand is already established in context</p>
 </div>
 </div>
 </motion.div>
 </div>
 </div>

 {/* Clear Space Requirements */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mb-16 md:mb-24 lg:mb-32"
 >
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Clear Space Requirements</h4>
 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-6 md:p-12 lg:p-16 border-2 border-gray-200">
 <div className="max-w-4xl mx-auto">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center mb-8 md:mb-10 lg:mb-12">
 <div className="relative bg-white rounded-xl p-8 md:p-10 lg:p-12 border-2 border-gray-300 overflow-x-auto">
 <div className="relative inline-block min-w-[280px] md:min-w-0">
 <div className="w-48 md:w-56 lg:w-64">
 <ODILogo color="#1F2937"/>
 </div>
 {/* Clear space box */}
 <div className="absolute -inset-8 md:-inset-10 lg:-inset-12 border-2 border-dashed border-[#06B6D4]"></div>
 {/* Measurement indicators */}
 <div className="absolute -top-14 md:-top-16 lg:-top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
 <div className="w-px h-6 md:h-8 bg-[#06B6D4]"></div>
 <div className="bg-[#06B6D4] text-white text-xs px-2 md:px-3 py-1 rounded-full font-mono whitespace-nowrap">
 x ="I"height
 </div>
 </div>
 <div className="absolute -left-14 md:-left-16 lg:-left-20 top-1/2 transform -translate-y-1/2 flex items-center">
 <div className="h-px w-6 md:w-8 bg-[#06B6D4]"></div>
 <div className="bg-[#06B6D4] text-white text-xs px-2 md:px-3 py-1 rounded-full font-mono">x</div>
 </div>
 </div>
 </div>

 <div>
 <h5 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">The"I"Rule</h5>
 <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 md:mb-6">
 Maintain clear space equal to the height of the letter"I"on all sides of the logo. 
 This ensures the logo has room to breathe and maintains maximum visual impact.
 </p>
 <div className="space-y-2 md:space-y-3">
 <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
 <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#06B6D4] mt-1.5 flex-shrink-0"></div>
 <div>
 <p className="font-semibold text-gray-900 text-sm md:text-base">All Sides Equal</p>
 <p className="text-xs md:text-sm text-gray-600">Apply the same spacing top, bottom, left, and right</p>
 </div>
 </div>
 <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
 <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0"></div>
 <div>
 <p className="font-semibold text-gray-900 text-sm md:text-base">Keep Clear</p>
 <p className="text-xs md:text-sm text-gray-600">No text, graphics, or other elements in this zone</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Minimum Sizes */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 >
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Minimum Size Requirements</h4>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
 {/* Digital */}
 <div className="bg-gradient-to-br from-[#06B6D4]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200">
 <div className="flex items-center gap-4 mb-4 md:mb-6">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
 <svg className="w-6 h-6 md:w-7 md:h-7"viewBox="0 0 24 24"fill="none"stroke="#06B6D4"strokeWidth="2">
 <rect x="2"y="3"width="20"height="14"rx="2"/>
 <line x1="8"y1="21"x2="16"y2="21"/>
 <line x1="12"y1="17"x2="12"y2="21"/>
 </svg>
 </div>
 <div>
 <h5 className="text-lg md:text-xl font-bold text-gray-900">Digital / Screen</h5>
 <p className="text-xs md:text-sm text-gray-600">Web, apps, presentations</p>
 </div>
 </div>
 
 <div className="bg-white rounded-xl p-6 md:p-8 mb-4 md:mb-6 border border-gray-200">
 <div className="flex items-center justify-center mb-4">
 <div style={{ width: '120px' }}>
 <ODILogo color="#1F2937"/>
 </div>
 </div>
 <div className="text-center space-y-1">
 <p className="font-mono text-base md:text-lg font-bold text-gray-900">120px minimum width</p>
 <p className="text-xs text-gray-600">40px minimum height</p>
 </div>
 </div>
 
 <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
 Below 120px width, the split-O detail becomes difficult to perceive. 
 <strong className="text-gray-900"> Use the icon mark instead for smaller applications.</strong>
 </p>
 </div>

 {/* Print */}
 <div className="bg-gradient-to-br from-[#7C3AED]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200">
 <div className="flex items-center gap-4 mb-4 md:mb-6">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
 <svg className="w-6 h-6 md:w-7 md:h-7"viewBox="0 0 24 24"fill="none"stroke="#7C3AED"strokeWidth="2">
 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
 <polyline points="14 2 14 8 20 8"/>
 <line x1="16"y1="13"x2="8"y2="13"/>
 <line x1="16"y1="17"x2="8"y2="17"/>
 </svg>
 </div>
 <div>
 <h5 className="text-lg md:text-xl font-bold text-gray-900">Print</h5>
 <p className="text-xs md:text-sm text-gray-600">Documents, merchandise, signage</p>
 </div>
 </div>
 
 <div className="bg-white rounded-xl p-6 md:p-8 mb-4 md:mb-6 border border-gray-200">
 <div className="flex items-center justify-center mb-4">
 <div style={{ width: '100px' }}>
 <ODILogo color="#1F2937"/>
 </div>
 </div>
 <div className="text-center space-y-1">
 <p className="font-mono text-base md:text-lg font-bold text-gray-900">1 inch / 25mm minimum</p>
 <p className="text-xs text-gray-600">Maintains legibility in print</p>
 </div>
 </div>
 
 <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
 Always use vector formats (.SVG, .EPS, .AI) for print applications. 
 <strong className="text-gray-900"> This ensures crisp reproduction at any size.</strong>
 </p>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}
