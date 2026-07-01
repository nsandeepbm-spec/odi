import { motion } from 'motion/react';
import { Headset, Eye, Layers, Zap, Check, Globe } from 'lucide-react';

export default function ServiceVRVisionPro() {
 return (
 <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">

 {/* 1. Hero Section */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="relative overflow-hidden rounded-[2rem] bg-[#0A111A]/80 border border-white/5 shadow-2xl flex flex-col md:flex-row items-stretch min-h-[420px]"
 >
 {/* Left content */}
 <div className="p-10 md:p-16 lg:w-1/2 relative z-10 flex flex-col justify-center">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 flex items-center justify-center mb-8 border border-[#06B6D4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
 <Headset className="w-7 h-7 text-[#06B6D4]"strokeWidth={1.5} />
 </div>
 <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
 VR / Vision Pro Content Prep
 </h1>
 <h2 className="text-xl text-white/80 font-medium mb-6 leading-snug">
 Content built for the next era of spatial computing and immersive displays
 </h2>
 <p className="text-white/60 text-lg leading-relaxed font-light mb-10">
 As spatial video, Apple Vision Pro, and next-generation VR devices redefine how people experience content, ODI ensures your visuals are perfectly prepared. We optimise depth, format, and stereo parameters so your content feels native to every platform — from Vision Pro to Meta Quest and beyond.
 </p>
 <div className="flex flex-wrap gap-4">
 <button className="px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.3)]">
 Prepare My Content
 </button>
 <button className="px-7 py-3 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
 View Platforms
 </button>
 </div>
 </div>

 {/* Right image */}
 <div className="w-full lg:w-1/2 h-[340px] lg:h-auto relative">
 <div className="absolute inset-0 bg-gradient-to-r from-[#0A111A] via-[#0A111A]/30 to-transparent z-10"/>
 <img
 src="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
 alt="VR Vision Pro"
 className="absolute inset-0 w-full h-full object-cover object-center"
 />
 </div>
 </motion.section>

 {/* 2. Platform Support Badges */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-8 md:p-12 shadow-lg"
 >
 <h2 className="text-xl font-bold mb-8 text-center tracking-wide uppercase text-white/80">
 Supported Platforms
 </h2>
 <div className="flex flex-wrap justify-center gap-4">
 {['Apple Vision Pro', 'Meta Quest 3', 'YouTube VR', 'Netflix 3D', 'SteamVR', 'Disney+ Immersive', 'Theatrical 3D', 'Spatial Video'].map((p) => (
 <span key={p} className="px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/70 font-medium text-sm hover:text-white hover:border-[#06B6D4]/40 transition-colors">
 {p}
 </span>
 ))}
 </div>
 </motion.section>

 {/* 3. Immersive Banner */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="relative overflow-hidden rounded-[2rem] border border-white/5 h-[440px] shadow-2xl flex items-end"
 >
 <img
 src="https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
 alt="Spatial Experience"
 className="absolute inset-0 w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[#0A111A] via-[#0A111A]/60 to-transparent"/>
 <div className="relative z-10 p-10 md:p-16 max-w-3xl">
 <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight uppercase">
 The World is 3D. Your Content Should Be Too.
 </h2>
 <p className="text-white/70 text-lg leading-relaxed font-light">
 Spatial computing is no longer the future — it's here. ODI prepares your content for spatial displays, immersive headsets, and stereoscopic screens so you're ready for the audiences of today and tomorrow.
 </p>
 </div>
 </motion.section>

 {/* 4. Key Capabilities – 3 cards */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="grid md:grid-cols-3 gap-6"
 >
 {[
 { icon: Eye, title: 'Vision Pro Optimised', desc:"Spatial depth tuned for Apple Vision Pro's immersive display"},
 { icon: Globe, title: 'Multi-Platform Output', desc: 'Single source delivered across all major XR platforms' },
 { icon: Zap, title: 'Fast Turnaround', desc: 'Conversion and optimisation in 3–7 days' },
 ].map((item, i) => (
 <div key={i} className="rounded-[1.5rem] bg-[#0A111A]/80 border border-white/5 p-8 hover:border-[#06B6D4]/30 transition-colors group">
 <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center mb-5 group-hover:bg-[#06B6D4]/20 transition-colors">
 <item.icon className="w-6 h-6 text-[#06B6D4]"strokeWidth={1.5} />
 </div>
 <h3 className="text-xl font-bold mb-2">{item.title}</h3>
 <p className="text-white/50 font-light text-sm leading-relaxed">{item.desc}</p>
 </div>
 ))}
 </motion.section>

 {/* 5. What We Prepare + Image split */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl flex flex-col lg:flex-row"
 >
 {/* Left: image */}
 <div className="lg:w-2/5 relative min-h-[360px]">
 <img
 src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
 alt="Spatial Production"
 className="absolute inset-0 w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A111A]/80"/>
 </div>

 {/* Right: checklist */}
 <div className="lg:w-3/5 bg-[#0A111A] p-10 md:p-14 flex flex-col justify-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase">What We Prepare</h2>
 <div className="grid md:grid-cols-2 gap-y-5 gap-x-10">
 {[
 'Apple Vision Pro spatial video',
 'Meta Quest SBS format',
 'MV-HEVC encoding',
 'Stereo depth calibration',
 'FOV & convergence optimisation',
 'Spatial audio alignment',
 'Frame-rate & resolution matching',
 'Platform-specific QA sign-off',
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-5 h-5 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center shrink-0">
 <Check className="w-3 h-3 text-[#06B6D4]"strokeWidth={3} />
 </div>
 <span className="text-white/70 font-medium text-sm">{item}</span>
 </div>
 ))}
 </div>
 </div>
 </motion.section>

 {/* 6. Process Steps */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-14 shadow-lg"
 >
 <h2 className="text-2xl md:text-3xl font-bold mb-12 tracking-wide uppercase text-center">
 Content Prep Process
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
 {[
 { num: '1', title: 'Content Audit', desc: 'Assess source material & platform targets' },
 { num: '2', title: 'Depth Analysis', desc: 'Evaluate stereo depth parameters' },
 { num: '3', title: 'Conversion', desc: 'Optimise for each platform' },
 { num: '4', title: 'Device Testing', desc: 'QA on target hardware' },
 { num: '5', title: 'Final Delivery', desc: 'All formats ready to publish' },
 ].map((step, i) => (
 <div key={i} className="flex flex-col p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-[#06B6D4]/30 transition-colors group">
 <span className="text-3xl font-black text-[#06B6D4]/40 group-hover:text-[#06B6D4]/60 transition-colors mb-4">{step.num}</span>
 <h3 className="text-white font-bold mb-2 text-base">{step.title}</h3>
 <p className="text-white/50 text-sm font-light leading-relaxed">{step.desc}</p>
 </div>
 ))}
 </div>
 </motion.section>

 {/* 7. Deliverables + CTA */}
 <div className="grid lg:grid-cols-2 gap-8">
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg"
 >
 <h2 className="text-xl font-bold mb-8 uppercase tracking-wide">Deliverables Package</h2>
 <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
 {[
 'Vision Pro-ready file',
 'Meta Quest SBS file',
 'Standard streaming master',
 'Theatrical 3D DCP',
 'QA certification report',
 'Platform-specific specs sheet',
 'Side-by-side preview file',
 'Archival source export',
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-[#06B6D4] shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.5)]"/>
 <span className="text-white/70 text-sm font-medium">{item}</span>
 </div>
 ))}
 </div>
 </motion.section>

 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.15 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg flex flex-col justify-between"
 >
 <div>
 <Layers className="w-10 h-10 text-[#06B6D4] mb-6"strokeWidth={1.5} />
 <h2 className="text-3xl font-black mb-4">Ready for the Spatial Era?</h2>
 <p className="text-white/60 font-light leading-relaxed mb-10">
 Get your content prepared for Apple Vision Pro and all major VR platforms. Pricing is based on content type, duration, and number of target platforms.
 </p>
 </div>
 <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-lg">
 Get Your Spatial Estimate
 </button>
 </motion.section>
 </div>

 </div>
 </div>
 );
}
