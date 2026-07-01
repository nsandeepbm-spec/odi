import { motion } from 'motion/react';
import { Film, Sparkles } from 'lucide-react';

export default function Service3DShortFilms() {
 return (
 <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
 
 {/* 1. Hero Section */}
 <motion.section 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="relative overflow-hidden rounded-[2rem] bg-[#0A111A]/80 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center"
 >
 <div className="p-10 md:p-16 lg:w-1/2 relative z-10">
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 flex items-center justify-center mb-8 border border-[#06B6D4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
 <Film className="w-8 h-8 text-[#06B6D4]"strokeWidth={1.5} />
 </div>
 
 <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase">
 3D Short Films
 </h1>
 
 <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-6 leading-snug">
 1-30 minute short films changed for the better into immersive 3D experiences
 </h2>
 
 <p className="text-white/60 text-lg leading-relaxed font-light mb-10">
 Perfect for festival submissions, art installations, and premium streaming platforms. We bring depth and dimension to short-form storytelling, ensuring every frame improves and refines the narrative without overwhelming the director's vision.
 </p>

 <button className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.3)]">
 Get Started
 </button>
 </div>
 
 <div className="w-full lg:w-1/2 h-[400px] md:h-full relative min-h-[400px]">
 {/* Glowing gradient behind the image */}
 <div className="absolute inset-0 bg-gradient-to-l from-[#0A111A] to-transparent z-10 md:bg-gradient-to-l md:from-transparent md:to-[#0A111A]/80"/>
 <img 
 src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
 alt="3D Short Films"
 className="absolute inset-0 w-full h-full object-cover object-center"
 />
 </div>
 </motion.section>

 {/* 2. Transforming Atmosphere Banner */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="relative overflow-hidden rounded-[2rem] border border-white/5 h-[450px] shadow-2xl flex items-end"
 >
 <img 
 src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
 alt="Transforming Atmosphere"
 className="absolute inset-0 w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[#0A111A] via-[#0A111A]/70 to-transparent"/>
 
 <div className="relative z-10 p-10 md:p-16 max-w-3xl">
 <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight uppercase">
 Transforming Atmosphere Through Depth
 </h2>
 <p className="text-white/70 text-lg leading-relaxed font-light">
 3D conversion doesn't just add dimension—it transforms the entire atmosphere of your film. Watch as flat scenes gain cinematic depth, lighting becomes more dynamic, and every layer of your composition comes alive with spatial presence.
 </p>
 </div>
 </motion.section>

 {/* 3. Why Choose Our Short Film Service */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="py-12"
 >
 <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase text-center">
 Why Choose Our Short Film Service
 </h2>
 
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 { title:"1-30 minute runtime", desc:"Perfect length for festivals"},
 { title:"Festival-ready quality", desc:"DCP and streaming formats"},
 { title:"Artistic depth grading", desc:"Enhances your vision"},
 { title:"Fast turnaround", desc:"1-3 weeks typical"},
 { title:"Student-friendly pricing", desc:"Accessible rates"},
 { title:"Creative consultation", desc:"Included with every project"}
 ].map((feature, index) => (
 <div key={index} className="p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
 <Sparkles className="w-6 h-6 text-[#06B6D4] mb-4"/>
 <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
 <p className="text-white/50 font-light text-sm">{feature.desc}</p>
 </div>
 ))}
 </div>
 </motion.section>

 {/* 4. From Vision To Reality (Process) */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-16 shadow-lg"
 >
 <h2 className="text-2xl md:text-3xl font-bold mb-12 tracking-wide uppercase">
 From Vision To Reality
 </h2>
 
 <div className="space-y-8 max-w-4xl">
 {[
 { title:"Creative Brief", desc:"Understand your vision, festival goals, and artistic intent."},
 { title:"Depth Design", desc:"Custom depth grading that amplifies your story's emotional core."},
 { title:"Conversion & Refinement", desc:"High-quality conversion with attention to every detail."},
 { title:"Director Collaboration", desc:"Iterative review and refinement based on your feedback."},
 { title:"Festival-Ready Delivery", desc:"Optimized for projection, streaming, and VR platforms."}
 ].map((step, index) => (
 <div key={index} className="flex gap-6 items-start">
 <div className="w-8 h-8 rounded-full bg-[#06B6D4]/10 flex items-center justify-center shrink-0 border border-[#06B6D4]/30 font-bold text-[#06B6D4] text-sm mt-1">
 {index + 1}
 </div>
 <div>
 <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
 <p className="text-white/60 font-light leading-relaxed">{step.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </motion.section>

 {/* 5. Bottom Call To Action */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-[#0A111A] border border-white/5 p-10 md:p-16 shadow-lg text-center"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide uppercase">
 Ready to Transform Your Short Film?
 </h2>
 <p className="text-white/60 text-lg leading-relaxed font-light max-w-3xl mx-auto mb-12">
 Receive your complete 3D short film package including festival DCP, web/streaming versions, side-by-side 3D format, and social media clips.
 </p>
 
 <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
 <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center min-w-[200px]">
 <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Pricing</span>
 <span className="text-xl font-bold">Contact for Quote</span>
 </div>
 <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center min-w-[200px]">
 <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Timeline</span>
 <span className="text-xl font-bold">1-10 Weeks</span>
 </div>
 </div>

 <button className="px-10 py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-lg">
 Start Your Project
 </button>
 </motion.section>
 
 </div>
 </div>
 );
}
