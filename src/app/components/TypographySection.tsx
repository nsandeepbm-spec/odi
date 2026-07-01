import { motion } from 'motion/react';

export function TypographySection() {
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
 <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">04 — Typography</span>
 </span>
 <h3 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6">
 <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Google Sans Flex</span>
 </h3>
 <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
 A modern, variable font system that embodies ODI's commitment to precision and innovation. 
 Google Sans Flex provides exceptional flexibility and clarity across all brand communications.
 </p>
 </motion.div>

 {/* Font Overview */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mb-16 md:mb-24 lg:mb-32"
 >
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
 {/* Font Details */}
 <div className="bg-gradient-to-br from-[#7C3AED]/5 via-white to-[#06B6D4]/5 rounded-xl md:rounded-2xl p-6 md:p-10 lg:p-12 border-2 border-gray-200">
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6 font-medium">Primary Typeface</h4>
 <p className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
 Google Sans Flex
 </p>
 
 <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
 <div className="flex items-start gap-2 md:gap-3">
 <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#06B6D4] mt-1.5 md:mt-2 flex-shrink-0"></div>
 <div>
 <p className="font-semibold text-gray-900 text-sm md:text-base">Variable Font</p>
 <p className="text-xs md:text-sm text-gray-600">Smooth weight adjustments from 100-900</p>
 </div>
 </div>
 <div className="flex items-start gap-2 md:gap-3">
 <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#7C3AED] mt-1.5 md:mt-2 flex-shrink-0"></div>
 <div>
 <p className="font-semibold text-gray-900 text-sm md:text-base">Geometric Sans-Serif</p>
 <p className="text-xs md:text-sm text-gray-600">Clean, modern letterforms with technical precision</p>
 </div>
 </div>
 <div className="flex items-start gap-2 md:gap-3">
 <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#06B6D4] mt-1.5 md:mt-2 flex-shrink-0"></div>
 <div>
 <p className="font-semibold text-gray-900 text-sm md:text-base">Optimized Readability</p>
 <p className="text-xs md:text-sm text-gray-600">Designed for both display and body text</p>
 </div>
 </div>
 </div>
 
 <div className="pt-4 md:pt-6 border-t border-gray-200">
 <p className="text-xs md:text-sm text-gray-500 mb-2">Available Weights</p>
 <p className="text-xs md:text-sm text-gray-900 font-mono">300 • 400 • 500 • 600 • 700 • 800</p>
 </div>
 </div>

 {/* Alphabet Display */}
 <div className="bg-gradient-to-br from-gray-900 via-[#1B263B] to-black rounded-xl md:rounded-2xl p-6 md:p-10 lg:p-12 border-2 border-gray-800 flex flex-col justify-center">
 <div className="mb-6 md:mb-8">
 <p className="text-xs md:text-sm text-white/50 mb-3 md:mb-4 uppercase tracking-wider">Uppercase</p>
 <p className="text-lg md:text-xl lg:text-2xl text-white font-medium tracking-wide leading-relaxed break-words">
 ABCDEFGHIJKLM<br/>NOPQRSTUVWXYZ
 </p>
 </div>
 <div className="mb-6 md:mb-8">
 <p className="text-xs md:text-sm text-white/50 mb-3 md:mb-4 uppercase tracking-wider">Lowercase</p>
 <p className="text-lg md:text-xl lg:text-2xl text-white font-medium tracking-wide leading-relaxed break-words">
 abcdefghijklm<br/>nopqrstuvwxyz
 </p>
 </div>
 <div>
 <p className="text-xs md:text-sm text-white/50 mb-3 md:mb-4 uppercase tracking-wider">Numbers & Symbols</p>
 <p className="text-lg md:text-xl lg:text-2xl text-white font-medium tracking-wide">
 0123456789 !@#$%&*()
 </p>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Type Scale System */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mb-16 md:mb-24 lg:mb-32"
 >
 <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-8 font-medium">Type Scale</h4>
 <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
 {/* Display */}
 <div className="p-6 md:p-10 lg:p-12 border-b-2 border-gray-200 bg-gradient-to-r from-[#7C3AED]/5 to-[#06B6D4]/5">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
 <p className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent leading-none">
 ODI
 </p>
 <div className="md:text-right md:pb-2">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">96px / 6rem</p>
 <p className="text-xs text-gray-500">Display • Bold • 700</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Large hero sections, landing pages, major announcements</p>
 </div>

 {/* Heading 1 */}
 <div className="p-6 md:p-10 lg:p-12 border-b border-gray-200">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
 <p className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
 Spatial Cinema Technology
 </p>
 <div className="md:text-right md:pb-2 flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">60px / 3.75rem</p>
 <p className="text-xs text-gray-500">H1 • Bold • 700</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Page titles, section headers, primary headings</p>
 </div>

 {/* Heading 2 */}
 <div className="p-6 md:p-8 lg:p-10 border-b border-gray-200 bg-gray-50">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
 <p className="text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-[#06B6D4] to-[#0891B2] bg-clip-text text-transparent leading-tight">
 Engineered Precision
 </p>
 <div className="md:text-right md:pb-2 flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">48px / 3rem</p>
 <p className="text-xs text-gray-500">H2 • Semibold • 600</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Sub-sections, feature titles, component headers</p>
 </div>

 {/* Heading 3 */}
 <div className="p-6 md:p-8 lg:p-10 border-b border-gray-200">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
 <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
 Next-Generation Visual Systems
 </p>
 <div className="md:text-right md:pb-2 flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">36px / 2.25rem</p>
 <p className="text-xs text-gray-500">H3 • Semibold • 600</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Card titles, content headings, navigation items</p>
 </div>

 {/* Heading 4 */}
 <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50">
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
 <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900">
 Immersive 3D Conversion Pipeline
 </p>
 <div className="md:text-right md:pb-2 flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">24px / 1.5rem</p>
 <p className="text-xs text-gray-500">H4 • Medium • 500</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Smaller headings, list titles, emphasized content</p>
 </div>

 {/* Body Large */}
 <div className="p-6 md:p-8 border-b border-gray-200">
 <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
 <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
 ODI delivers cinema-grade stereo 3D conversion and spatial visual media solutions, 
 transforming flat content into immersive dimensional experiences.
 </p>
 <div className="md:text-right flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">20px / 1.25rem</p>
 <p className="text-xs text-gray-500">Body Large • Regular • 400</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Intro paragraphs, callouts, important body text</p>
 </div>

 {/* Body */}
 <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50">
 <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
 <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-2xl">
 Our advanced algorithms analyze depth information, object boundaries, and motion vectors 
 to create precise left and right eye views. Every frame is engineered for authentic spatial perception.
 </p>
 <div className="md:text-right flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">16px / 1rem</p>
 <p className="text-xs text-gray-500">Body • Regular • 400</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Standard body copy, descriptions, interface text</p>
 </div>

 {/* Small */}
 <div className="p-6 md:p-8">
 <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-2xl">
 Technical specifications: 2K-8K resolution support • Frame-accurate synchronization • 
 Real-time preview capabilities • Cinema DCP export • HDR color grading integration
 </p>
 <div className="md:text-right flex-shrink-0">
 <p className="text-xs md:text-sm font-mono font-black text-gray-900">14px / 0.875rem</p>
 <p className="text-xs text-gray-500">Small • Regular • 400</p>
 </div>
 </div>
 <p className="text-xs md:text-sm text-gray-600">Captions, metadata, footnotes, labels</p>
 </div>
 </div>
 </motion.div>

 {/* Font Weights Showcase */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mb-16 md:mb-24 lg:mb-32"
 >
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Weight Variations</h4>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
 {/* Light */}
 <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-[#06B6D4]/30 transition-colors">
 <p className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-3 md:mb-4">Aa</p>
 <p className="text-xs md:text-sm font-mono text-gray-900 font-semibold mb-2">Light • 300</p>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 Elegant and minimal. Use for large display text where a lighter aesthetic is needed.
 </p>
 </div>

 {/* Regular */}
 <div className="bg-gradient-to-br from-[#06B6D4]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#06B6D4]/20">
 <p className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 mb-3 md:mb-4">Aa</p>
 <p className="text-xs md:text-sm font-mono bg-gradient-to-r from-[#06B6D4] to-[#0891B2] bg-clip-text text-transparent font-semibold mb-2">Regular • 400</p>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 <strong className="text-gray-900">Primary weight</strong> for body text, descriptions, and standard content.
 </p>
 </div>

 {/* Medium */}
 <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-[#7C3AED]/30 transition-colors">
 <p className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-3 md:mb-4">Aa</p>
 <p className="text-xs md:text-sm font-mono text-gray-900 font-semibold mb-2">Medium • 500</p>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 Subtle emphasis for buttons, navigation, and moderately important content.
 </p>
 </div>

 {/* Semibold */}
 <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-[#06B6D4]/30 transition-colors">
 <p className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-3 md:mb-4">Aa</p>
 <p className="text-xs md:text-sm font-mono text-gray-900 font-semibold mb-2">Semibold • 600</p>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 Strong hierarchy for subheadings, section titles, and emphasized content.
 </p>
 </div>

 {/* Bold */}
 <div className="bg-gradient-to-br from-[#7C3AED]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#7C3AED]/20">
 <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-3 md:mb-4">Aa</p>
 <p className="text-xs md:text-sm font-mono bg-gradient-to-r from-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent font-semibold mb-2">Bold • 700</p>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 <strong className="text-gray-900">Headlines and titles.</strong> Creates maximum visual impact and attention.
 </p>
 </div>

 {/* Extra Bold */}
 <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-[#7C3AED]/30 transition-colors">
 <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-3 md:mb-4">Aa</p>
 <p className="text-xs md:text-sm font-mono text-gray-900 font-semibold mb-2">Extra Bold • 800</p>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
 High-impact display text for special cases and brand moments.
 </p>
 </div>
 </div>
 </motion.div>

 {/* Typography in Action */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mb-16 md:mb-24 lg:mb-32"
 >
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Real-World Application</h4>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
 {/* Light Background Example */}
 <div className="bg-white rounded-xl md:rounded-2xl p-8 md:p-10 lg:p-12 border-2 border-gray-200">
 <h5 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] bg-clip-text text-transparent">
 Stereo 3D Conversion
 </h5>
 <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-4 md:mb-6 leading-relaxed">
 Transform flat footage into immersive dimensional experiences
 </p>
 <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
 Our proprietary algorithms analyze every frame to generate precise depth maps, 
 creating authentic left and right eye views that deliver true stereoscopic depth.
 </p>
 <div className="flex flex-col sm:flex-row gap-3">
 <button className="px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-semibold rounded-lg text-sm md:text-base">
 Learn More
 </button>
 <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg text-sm md:text-base">
 View Demo
 </button>
 </div>
 <p className="text-xs text-gray-500 mt-4 md:mt-6 uppercase tracking-wider">Light Background Usage</p>
 </div>

 {/* Dark Background Example */}
 <div className="bg-gradient-to-br from-gray-900 via-[#1B263B] to-black rounded-xl md:rounded-2xl p-8 md:p-10 lg:p-12 border-2 border-gray-800">
 <h5 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent">
 Cinema-Grade Quality
 </h5>
 <p className="text-base md:text-lg lg:text-xl text-white mb-4 md:mb-6 leading-relaxed">
 Precision engineering for theatrical exhibition
 </p>
 <p className="text-sm md:text-base text-white/70 mb-6 md:mb-8 leading-relaxed">
 Every project undergoes rigorous quality control with frame-by-frame analysis, 
 ensuring flawless convergence and zero visual artifacts for the big screen.
 </p>
 <div className="flex flex-col sm:flex-row gap-3">
 <button className="px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-semibold rounded-lg text-sm md:text-base">
 Our Process
 </button>
 <button className="px-6 py-3 border-2 border-white/20 text-white font-medium rounded-lg hover:border-white/40 transition-colors text-sm md:text-base">
 Case Studies
 </button>
 </div>
 <p className="text-xs text-white/50 mt-4 md:mt-6 uppercase tracking-wider">Dark Background Usage</p>
 </div>
 </div>
 </motion.div>

 {/* Typography Rules */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 >
 <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Typography Guidelines</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
 <div className="bg-gradient-to-br from-[#06B6D4]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#06B6D4]/20">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center mb-4 md:mb-6">
 <svg className="w-6 h-6 md:w-7 md:h-7"viewBox="0 0 24 24"fill="none"stroke="#06B6D4"strokeWidth="2">
 <path d="M12 2v20M2 12h20"/>
 </svg>
 </div>
 <h5 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Line Height</h5>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3 md:mb-4">
 Use 1.5× for body text (24px line height for 16px text) and 1.2× for headings to ensure optimal readability.
 </p>
 <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
 <p className="text-xs text-gray-500 mb-2 font-mono">Example: 16px / 24px</p>
 <p className="text-xs md:text-sm text-gray-700"style={{ lineHeight: '1.5' }}>
 Proper line height creates rhythm and improves reading comprehension across all devices.
 </p>
 </div>
 </div>

 <div className="bg-gradient-to-br from-[#7C3AED]/5 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#7C3AED]/20">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-4 md:mb-6">
 <svg className="w-6 h-6 md:w-7 md:h-7"viewBox="0 0 24 24"fill="none"stroke="#7C3AED"strokeWidth="2">
 <rect x="3"y="3"width="18"height="18"rx="2"/>
 <path d="M9 3v18M15 3v18"/>
 </svg>
 </div>
 <h5 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Letter Spacing</h5>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3 md:mb-4">
 Default tracking for body text. Increase to +0.05em for uppercase labels and small text.
 </p>
 <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200 space-y-2 md:space-y-3">
 <div>
 <p className="text-xs text-gray-500 mb-1 font-mono">Normal: 0em</p>
 <p className="text-xs md:text-sm text-gray-700">Standard Body Text</p>
 </div>
 <div>
 <p className="text-xs text-gray-500 mb-1 font-mono">Wide: +0.05em</p>
 <p className="text-xs text-gray-700 uppercase tracking-wider">Labels & Small Caps</p>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4 md:mb-6">
 <svg className="w-6 h-6 md:w-7 md:h-7"viewBox="0 0 24 24"fill="none"stroke="#374151"strokeWidth="2">
 <path d="M4 7h16M4 12h16M4 17h10"/>
 </svg>
 </div>
 <h5 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Paragraph Width</h5>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3 md:mb-4">
 Limit line length to 60-75 characters (approximately 600-700px) for optimal reading comfort.
 </p>
 <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
 <p className="text-xs text-gray-500 mb-2">Recommended max-width</p>
 <p className="text-xs md:text-sm font-mono text-gray-900">640px - 720px</p>
 </div>
 </div>

 <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-gray-200">
 <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4 md:mb-6">
 <svg className="w-6 h-6 md:w-7 md:h-7"viewBox="0 0 24 24"fill="none"stroke="#374151"strokeWidth="2">
 <circle cx="12"cy="12"r="10"/>
 <path d="M12 6v6l4 2"/>
 </svg>
 </div>
 <h5 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Hierarchy</h5>
 <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3 md:mb-4">
 Use size, weight, and color to create clear visual hierarchy. Limit to 3-4 levels per screen.
 </p>
 <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 space-y-1.5 md:space-y-2">
 <p className="text-sm md:text-base font-bold text-gray-900">Primary Level</p>
 <p className="text-xs md:text-sm font-semibold text-gray-700">Secondary Level</p>
 <p className="text-xs md:text-sm text-gray-600">Tertiary Level</p>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}