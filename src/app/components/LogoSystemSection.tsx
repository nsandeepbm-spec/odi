import { motion } from 'motion/react';
import { Glasses, Box, Layers } from 'lucide-react';
import { ODILogo } from './ODILogo';

export function LogoSystemSection() {
 return (
 <section className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0D1B2A] to-black py-32 px-8">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: 0.8 }}
 >
 <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/10">
 <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent font-medium">01 — Logo System</span>
 </span>
 <h3 className="text-5xl md:text-7xl mb-6 font-bold text-white">
 The <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Split-O</span> Geometry
 </h3>
 <p className="text-xl text-white/70 mb-20 max-w-3xl leading-relaxed">
 At the heart of ODI's identity is the split-O letterform—a geometric symbol representing stereo vision, 
 spatial dimension, and the duality of left and right visual channels in 3D cinema.
 </p>
 </motion.div>

 {/* Large Showcase Logo */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: 1 }}
 className="mb-32 relative"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 via-[#7C3AED]/20 to-transparent blur-3xl"></div>
 <div className="relative bg-gradient-to-br from-[#1B263B] to-black rounded-3xl p-20 border border-white/5">
 <div className="w-full max-w-4xl mx-auto">
 <ODILogo color="white"/>
 </div>
 </div>
 </motion.div>

 {/* The Meaning Section */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="bg-gradient-to-br from-[#06B6D4]/10 to-[#06B6D4]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#06B6D4]/20"
 >
 <div className="w-16 h-16 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center mb-6">
 <Glasses className="w-8 h-8 text-[#06B6D4]" strokeWidth={2} />
 </div>
 <h4 className="text-xl font-bold text-white mb-3">Stereo Vision</h4>
 <p className="text-sm text-white/60 leading-relaxed">
 The vertical split represents the left and right eye perspectives that create depth perception in 3D cinema technology.
 </p>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="bg-gradient-to-br from-[#7C3AED]/10 to-[#7C3AED]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#7C3AED]/20"
 >
 <div className="w-16 h-16 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center mb-6">
 <Box className="w-8 h-8 text-[#7C3AED]" strokeWidth={2} />
 </div>
 <h4 className="text-xl font-bold text-white mb-3">Dimensional Space</h4>
 <p className="text-sm text-white/60 leading-relaxed">
 The circular form symbolizes immersive cinema and complete spatial audio environments that surround viewers.
 </p>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.3 }}
 className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
 >
 <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6">
 <Layers className="w-8 h-8 text-white" strokeWidth={2} />
 </div>
 <h4 className="text-xl font-bold text-white mb-3">Precision Engineering</h4>
 <p className="text-sm text-white/60 leading-relaxed">
 Clean geometric construction reflects ODI's commitment to technical excellence and engineered visual solutions.
 </p>
 </motion.div>
 </div>

 {/* Split-O Close-up with annotation */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mb-32"
 >
 <h4 className="text-sm uppercase tracking-wider text-white/50 mb-8 font-medium">
 The <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Split-O</span> Detail
 </h4>
 <div className="bg-gradient-to-br from-[#1B263B] to-black rounded-2xl p-16 border border-white/10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#06B6D4]/10 to-transparent blur-3xl"></div>
 
 <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
 <div className="flex-1 flex items-center justify-center">
 <svg className="w-64 h-64"viewBox="0 0 194.875 194.873"fill="none">
 <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z"fill="#7C3AED"/>
 <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z"fill="#06B6D4"/>
 
 {/* Annotation lines */}
 <line x1="65"y1="97"x2="85"y2="97"stroke="white"strokeWidth="2"strokeDasharray="4 4"opacity="0.5"/>
 <circle cx="65"cy="97"r="4"fill="white"opacity="0.8"/>
 </svg>
 </div>
 
 <div className="flex-1 space-y-6">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-2 h-2 rounded-full bg-[#7C3AED]"></div>
 <h5 className="text-lg font-bold text-white">Left Channel</h5>
 </div>
 <p className="text-sm text-white/60 leading-relaxed pl-5">
 The left half of the O represents the left eye view in stereo 3D systems, rendered in cinematic purple.
 </p>
 </div>
 
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-2 h-2 rounded-full bg-[#06B6D4]"></div>
 <h5 className="text-lg font-bold text-white">Right Channel</h5>
 </div>
 <p className="text-sm text-white/60 leading-relaxed pl-5">
 The right half represents the right eye view, rendered in cyan tech—together creating depth perception.
 </p>
 </div>

 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-2 h-2 rounded-full bg-white"></div>
 <h5 className="text-lg font-bold text-white">The Split</h5>
 </div>
 <p className="text-sm text-white/60 leading-relaxed pl-5">
 The vertical separation at the center creates visual tension and represents the convergence point where two views merge into dimensional experience.
 </p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Color Applications */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 >
 <h4 className="text-sm uppercase tracking-wider text-white/50 mb-8 font-medium">Primary Applications</h4>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* White on Dark */}
 <div className="group">
 <div className="bg-gradient-to-br from-[#1B263B] to-black rounded-2xl p-12 mb-4 border border-white/10 aspect-square flex items-center justify-center transform transition-all duration-500 hover:scale-[1.02]">
 <div className="w-32">
 <ODILogo color="white"/>
 </div>
 </div>
 <h5 className="text-white font-semibold mb-1">White on Dark</h5>
 <p className="text-xs text-white/50">Primary logo for cinema and premium contexts</p>
 </div>

 {/* Cyan Brand */}
 <div className="group">
 <div className="bg-white rounded-2xl p-12 mb-4 border border-gray-200 aspect-square flex items-center justify-center transform transition-all duration-500 hover:scale-[1.02]">
 <div className="w-32">
 <ODILogo color="#06B6D4"/>
 </div>
 </div>
 <h5 className="text-white font-semibold mb-1">Cyan on Light</h5>
 <p className="text-xs text-white/50">Technology interfaces and digital applications</p>
 </div>

 {/* Purple Premium */}
 <div className="group">
 <div className="bg-white rounded-2xl p-12 mb-4 border border-gray-200 aspect-square flex items-center justify-center transform transition-all duration-500 hover:scale-[1.02]">
 <svg className="w-32"viewBox="0 0 194.875 194.873">
 <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z"fill="#7C3AED"/>
 <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z"fill="#06B6D4"/>
 </svg>
 </div>
 <h5 className="text-white font-semibold mb-1">Split Color</h5>
 <p className="text-xs text-white/50">Special showcase and hero applications</p>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}