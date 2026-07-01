import React from 'react';
import { motion } from 'framer-motion';
import {
 Target, Lightbulb, Clock, Award, Users, Rocket,
 Clapperboard, Play, Sparkles, Music, FileText,
 ShieldCheck, Zap
} from 'lucide-react';

// --- Shared Components ---

const ODIBadge = ({ className =""}: { className?: string }) => (
 <div className={`inline-flex items-center px-4 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.1)] ${className}`}>
 <span className="text-cyan-400 font-bold text-xs tracking-[0.2em]">STUDIO™</span>
 </div>
);

// --- Data ---

const partners = [
 { icon: Clapperboard, label: 'Film Studios' },
 { icon: Play, label: 'OTT Platforms' },
 { icon: Users, label: 'Creators' },
 { icon: Sparkles, label: 'Agencies' },
 { icon: Music, label: 'Music Labels' },
 { icon: FileText, label: 'Documentaries' },
];

const drivesUs = [
 {
 icon: Clock,
 title:"14 YEARS OF EXCELLENCE",
 desc:"A decade of pioneering depth conversion and stereoscopic workflows for global cinema."
 },
 {
 icon: Award,
 title:"FRAME-PERFECT QUALITY",
 desc:"Every individual frame treated with surgical precision and artistic intention."
 },
 {
 icon: ShieldCheck,
 title:"TRUSTED PARTNERSHIPS",
 desc:"Collaborating with directors and brands to protect and enhance their creative vision."
 },
 {
 icon: Zap,
 title:"SPATIAL READINESS",
 desc:"Leading the industry in content optimization for Vision Pro and immersive displays."
 }
];

export default function AboutPage() {
 return (
 <div className="min-h-screen bg-[#020617] text-white pt-20 pb-20 overflow-hidden font-sans">

 {/* Background Accent */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_70%)] opacity-30 pointer-events-none"/>

 <div className="max-w-7xl mx-auto px-6 relative z-10">

 {/* MAIN PAGE HEADER */}
 <section className="pt-20 pb-32 text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 >
 <ODIBadge className="mb-6"/>
 <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none mb-8">
 THE STORY BEHIND <br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">THE DEPTH</span>
 </h1>
 <p className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl font-medium leading-relaxed">
 We are a team of spatial engineers and visual storytellers dedicated to
 redefining the boundaries of how we experience digital media.
 </p>
 </motion.div>
 </section>

 {/* SECTION 1: OUR MISSION */}
 <section className="py-24 border-t border-white/5">
 <div className="grid lg:grid-cols-2 gap-20 items-center">
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <div className="flex items-center gap-3 mb-6 text-cyan-400">
 <Target className="w-5 h-5"/>
 <span className="text-xs font-black tracking-[0.3em] uppercase">Our Mission</span>
 </div>
 <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight uppercase leading-tight">
 BRINGING REALITY <br />BACK TO THE SCREEN
 </h2>
 <div className="space-y-6 text-white/60 text-lg leading-relaxed">
 <p>
  The mission of <span className="text-white font-bold">our studio</span> is to restore the natural dimension that traditional flat screens have stripped away from visual storytelling.
 </p>
 <p>
 With over 14 years of experience in high-end cinema and digital media, we reveal the hidden depth in every frame to create experiences that resonate.
 </p>
 <div className="pt-6 border-t border-white/5">
 <p className="text-white font-medium">
"The world isn't flat, and content shouldn't be either. We exist to bring those layers to life."
 </p>
 </div>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
 >
 <img
 src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"
 alt="Precision Technology"
 className="w-full h-full object-cover brightness-90"
 />
 </motion.div>
 </div>
 </section>

 {/* SECTION 2: OUR VISION */}
 <section className="py-24">
 <div className="grid lg:grid-cols-2 gap-20 items-center">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 order-2 lg:order-1"
 >
 <img
 src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1200"
 alt="3D Spatial Media"
 className="w-full h-full object-cover brightness-75"
 />
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="order-1 lg:order-2"
 >
 <div className="flex items-center gap-3 mb-6 text-cyan-400">
 <Lightbulb className="w-5 h-5"/>
 <span className="text-xs font-black tracking-[0.3em] uppercase">Our Vision</span>
 </div>
 <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight uppercase leading-tight">
 ENGINEERING THE <br /><span className="text-cyan-400">NEXT ERA</span>
 </h2>
 <div className="space-y-6 text-white/60 text-lg leading-relaxed">
 <p>
 We are setting the global standard for immersive visual production. We empower filmmakers and brands to bridge the gap between 2D viewing and spatial computing.
 </p>
 <p>
  As devices like Apple Vision Pro and glass-free 3D displays redefine human interaction, we are engineering content for a future where visuals are truly felt.
 </p>
 </div>
 </motion.div>
 </div>
 </section>

 {/* SECTION 3: PARTNERS GRID */}
 <section className="py-24 mb-10">
 <div className="text-center mb-16">
 <h2 className="text-3xl font-bold uppercase tracking-tight">Who We Work With</h2>
 <p className="text-white/40 text-base mt-2">Trusted by leading studios and creators worldwide</p>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {partners.map((partner, index) => (
 <div
 key={index}
 className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 transition-all"
 >
 <partner.icon className="w-6 h-6 text-cyan-500 mb-3"/>
 <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{partner.label}</span>
 </div>
 ))}
 </div>
 </section>

 {/* SECTION 4: CORE DRIVERS */}
 <section className="py-24">
 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
 {drivesUs.map((item, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="p-10 rounded-[2.5rem] bg-[#0D1B2A]/30 border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
 >
 <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/10">
 <item.icon className="w-5 h-5 text-cyan-400"/>
 </div>
 <h3 className="text-xs font-black tracking-widest uppercase mb-5 text-white leading-tight">{item.title}</h3>
 <p className="text-white/40 text-sm leading-relaxed font-medium">{item.desc}</p>
 </motion.div>
 ))}
 </div>
 </section>

 {/* SECTION 5: COMPACT CTA */}
 <section className="py-20">
 <div className="max-w-5xl mx-auto">
 <div className="relative rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-12 md:p-16 overflow-hidden backdrop-blur-xl">
 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32"/>
 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
 <div className="text-center md:text-left">
 <ODIBadge className="mb-6"/>
 <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-[1.1] mb-4">
 Ready for the <br /><span className="text-cyan-400">Next Dimension?</span>
 </h2>
 <p className="text-white/50 text-base max-w-sm">
 Join the evolution of storytelling. Let's create something unforgettable together.
 </p>
 </div>
 <div className="flex flex-col gap-4 min-w-[240px]">
 <button className="px-10 py-5 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-full hover:bg-cyan-400 transition-all shadow-xl shadow-white/5">
 START A PROJECT
 </button>
 <button className="px-10 py-5 bg-transparent border border-white/20 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-full hover:bg-white/5 transition-all">
 TALK TO AN EXPERT
 </button>
 </div>
 </div>
 </div>
 </div>
 </section>

 </div>
 </div>
 );
}