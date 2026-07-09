import { motion } from 'motion/react';
import { Zap, Sparkles, Palette, CheckCircle2 } from 'lucide-react';
import { ODILogo } from './ODILogo';

export function ColorSection() {
 return (
 <section className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] py-24 px-8">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-100px' }}
 transition={{ duration: 0.8 }}
 >
 <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/10">
 <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">03 — Color System</span>
 </span>
 <h3 className="text-5xl md:text-6xl mb-6 font-bold text-white">
 Cyan. Purple. Cinematic.
 </h3>
 <p className="text-xl text-white/70 mb-20 max-w-3xl leading-relaxed">
 Two powerful colors define ODI's visual identity—Cyan for technology and innovation,
 Purple for premium cinema experiences and creative excellence.
 </p>
 </motion.div>

 {/* Two Primary Colors */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
 {/* Cyan */}
 <motion.div
 initial={{ opacity: 0, x: -40 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="group"
 >
 <div className="bg-gradient-to-br from-[#06B6D4] via-[#0891B2] to-[#0E7490] rounded-3xl p-12 relative overflow-hidden border-2 border-[#06B6D4]/50 hover:scale-[1.02] transition-transform duration-500">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>
 <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"/>
 
 <div className="relative z-10">
 <div className="w-full max-w-md mx-auto mb-12">
 <ODILogo color="white"/>
 </div>
 
 <div className="space-y-4 text-white">
 <h4 className="text-4xl font-bold mb-3">Cyan Tech</h4>
 <div className="space-y-2">
 <p className="font-mono text-2xl font-bold">#06B6D4</p>
 <p className="text-white/80 text-sm">RGB 6, 182, 212</p>
 <p className="text-white/80 text-sm">HSL 187°, 94%, 43%</p>
 </div>
 <div className="pt-6 border-t border-white/20 mt-6">
 <p className="text-white/90 leading-relaxed text-lg">
 Primary brand color representing innovation, technology precision, and digital excellence.
 Used for hero sections, primary CTAs, and technology features.
 </p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Purple */}
 <motion.div
 initial={{ opacity: 0, x: 40 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.4 }}
 className="group"
 >
 <div className="bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] rounded-3xl p-12 relative overflow-hidden border-2 border-[#7C3AED]/50 hover:scale-[1.02] transition-transform duration-500">
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>
 <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"/>
 
 <div className="relative z-10">
 <div className="w-full max-w-md mx-auto mb-12">
 <ODILogo color="white"/>
 </div>
 
 <div className="space-y-4 text-white">
 <h4 className="text-4xl font-bold mb-3">Cinematic Purple</h4>
 <div className="space-y-2">
 <p className="font-mono text-2xl font-bold">#7C3AED</p>
 <p className="text-white/80 text-sm">RGB 124, 58, 237</p>
 <p className="text-white/80 text-sm">HSL 262°, 83%, 58%</p>
 </div>
 <div className="pt-6 border-t border-white/20 mt-6">
 <p className="text-white/90 leading-relaxed text-lg">
 Accent color representing premium experiences, creative power, and cinema excellence.
 Used for highlights, special features, and brand moments.
 </p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>

 {/* Premium Gradients */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.6 }}
 className="mb-20"
 >
 <h4 className="text-3xl font-bold text-white mb-8">Premium Gradients</h4>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Cyan to Purple */}
 <div className="bg-gradient-to-br from-[#06B6D4] via-[#8B5CF6] to-[#7C3AED] rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden border border-white/10">
 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50"/>
 <div className="w-32 relative z-10">
 <ODILogo color="white"/>
 </div>
 </div>

 {/* Cyan to Dark */}
 <div className="bg-gradient-to-br from-[#06B6D4] to-[#0D1B2A] rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden border border-[#06B6D4]/30">
 <div className="absolute inset-0 bg-gradient-to-tr from-[#06B6D4]/20 via-transparent to-transparent"/>
 <div className="w-32 relative z-10">
 <ODILogo color="white"/>
 </div>
 </div>

 {/* Purple to Dark */}
 <div className="bg-gradient-to-br from-[#7C3AED] to-[#0D1B2A] rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden border border-[#7C3AED]/30">
 <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 via-transparent to-transparent"/>
 <div className="w-32 relative z-10">
 <ODILogo color="white"/>
 </div>
 </div>
 </div>
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
 <p className="text-sm text-white/60">Cyan → Violet → Purple<br/>Hero sections, premium features, brand highlights</p>
 <p className="text-sm text-white/60">Cyan → Dark<br/>Technology showcases, digital interfaces, product UI</p>
 <p className="text-sm text-white/60">Purple → Dark<br/>Cinematic moments, special features, premium content</p>
 </div>
 </motion.div>

 {/* Color Applications */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.8 }}
 >
 <h4 className="text-3xl font-bold text-white mb-8">Color in Action</h4>
 
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
 {/* Dark theme UI */}
 <div className="bg-[#0D1B2A] border-2 border-white/10 rounded-2xl p-8 space-y-4">
 <p className="text-xs text-white/50 uppercase tracking-wider mb-6">Dark Theme</p>
 
 {/* Nav */}
 <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
 <div className="w-24">
 <ODILogo color="white"/>
 </div>
 <div className="flex gap-4 text-sm">
 <span className="text-white/60 hover:text-[#06B6D4] transition-colors cursor-pointer">Products</span>
 <span className="text-white/60 hover:text-[#06B6D4] transition-colors cursor-pointer">Solutions</span>
 <span className="text-[#7C3AED] font-medium">Contact</span>
 </div>
 </div>

 {/* Content Card */}
 <div className="bg-gradient-to-br from-[#06B6D4]/10 to-[#7C3AED]/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
 <h5 className="text-lg font-semibold text-white mb-2">Spatial Audio Innovation</h5>
 <p className="text-sm text-white/70 mb-4 leading-relaxed">
 Experience cinema technology with precision-engineered spatial audio systems
 </p>
 <div className="flex gap-3">
 <button className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#06B6D4]/50 transition-all">
 Learn More
 </button>
 <button className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#7C3AED]/50 transition-all">
 Get Started
 </button>
 </div>
 </div>
 </div>

 {/* Light theme UI */}
 <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-4">
 <p className="text-xs text-gray-500 uppercase tracking-wider mb-6">Light Theme</p>
 
 {/* Nav */}
 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
 <div className="w-24">
 <ODILogo color="#06B6D4"/>
 </div>
 <div className="flex gap-4 text-sm">
 <span className="text-gray-600 hover:text-[#06B6D4] transition-colors cursor-pointer">Products</span>
 <span className="text-gray-600 hover:text-[#06B6D4] transition-colors cursor-pointer">Solutions</span>
 <span className="text-[#7C3AED] font-medium">Contact</span>
 </div>
 </div>

 {/* Content Card */}
 <div className="bg-gradient-to-br from-[#06B6D4]/5 to-[#7C3AED]/5 p-6 rounded-xl border border-gray-200">
 <h5 className="text-lg font-semibold text-gray-900 mb-2">Spatial Audio Innovation</h5>
 <p className="text-sm text-gray-600 mb-4 leading-relaxed">
 Experience cinema technology with precision-engineered spatial audio systems
 </p>
 <div className="flex gap-3">
 <button className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-all">
 Learn More
 </button>
 <button className="px-4 py-2 border-2 border-[#7C3AED] text-[#7C3AED] text-sm font-medium rounded-lg hover:bg-[#7C3AED]/5 transition-all">
 Get Started
 </button>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Color Principles */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 1 }}
 className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10"
 >
 <h4 className="text-2xl font-bold text-white mb-8">Color Usage Principles</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex-shrink-0 flex items-center justify-center">
 <Zap className="w-6 h-6 text-white" strokeWidth={2} />
 </div>
 <div>
 <h5 className="text-white font-semibold mb-2">Cyan First</h5>
 <p className="text-white/70 text-sm leading-relaxed">
 Cyan is the primary brand color. Use it for main UI elements, CTAs, and technology features to convey innovation.
 </p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex-shrink-0 flex items-center justify-center">
 <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
 </div>
 <div>
 <h5 className="text-white font-semibold mb-2">Purple for Premium</h5>
 <p className="text-white/70 text-sm leading-relaxed">
 Purple creates cinematic elegance. Use it for highlights, special features, and premium moments that demand attention.
 </p>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4] via-[#8B5CF6] to-[#7C3AED] flex-shrink-0 flex items-center justify-center">
 <Palette className="w-6 h-6 text-white" strokeWidth={2} />
 </div>
 <div>
 <h5 className="text-white font-semibold mb-2">Dynamic Gradients</h5>
 <p className="text-white/70 text-sm leading-relaxed">
 Use gradients for hero sections and premium features. Blend cyan and purple for maximum visual impact and depth.
 </p>
 </div>
 </div>

 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex-shrink-0 flex items-center justify-center">
 <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />
 </div>
 <div>
 <h5 className="text-white font-semibold mb-2">Accessibility First</h5>
 <p className="text-white/70 text-sm leading-relaxed">
 Maintain WCAG AAA contrast standards. Use white text on colored backgrounds, colored text on white backgrounds.
 </p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}