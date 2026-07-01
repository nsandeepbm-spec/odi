import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Layers, Cuboid, MonitorPlay, BookImage,
  Blocks, Glasses, ArrowRight, Clapperboard,
  Play, Users, Sparkles, Music, FileText,
  Smartphone, Eye, Bot, History, CheckCircle2,
  Maximize, MonitorSmartphone,
  type LucideIcon
} from 'lucide-react';

// --- Interfaces ---
interface PartnerItem {
  icon: LucideIcon;
  label: string;
}

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

// --- Data ---
const partners: PartnerItem[] = [
  { icon: Clapperboard, label: 'Film Studios' },
  { icon: Play, label: 'OTT Platforms' },
  { icon: Users, label: 'Creators' },
  { icon: Sparkles, label: 'Agencies' },
  { icon: Music, label: 'Music Labels' },
  { icon: FileText, label: 'Documentaries' },
];

const services: FeatureItem[] = [
  { icon: Clapperboard, title: '3D MOVIE CONVERSION', desc: 'Feature-length cinematic depth conversion with frame-by-frame precision for global studios.' },
  { icon: Smartphone, title: '3D REELS & VERTICAL CONTENT', desc: 'Transforming short-form social media into immersive spatial experiences for mobile.' },
  { icon: Eye, title: 'IMMERSIVE ADVERTISING', desc: 'High-impact brand films that leverage spatial depth to drive 3x more engagement.' },
  { icon: Layers, title: 'DEPTH COMPOSITING', desc: 'Advanced stereo cleanup, rotoscoping, and high-fidelity depth map generation.' },
  { icon: Bot, title: 'SPATIAL OPTIMIZATION', desc: 'Content engineered specifically for Apple Vision Pro and next-gen spatial headsets.' },
  { icon: MonitorPlay, title: 'OTT INTEGRATION', desc: 'End-to-end pipelines for delivering 3D content directly to streaming platforms.' },
];

const products: FeatureItem[] = [
  { icon: Blocks, title: '3D LEARNING KITS', desc: 'Interactive physical and digital tools designed for immersive classroom environments.' },
  { icon: BookImage, title: 'KIDS 3D BOOKS', desc: 'Educational storytelling that leaps off the page through proprietary 3D print technology.' },
  { icon: Glasses, title: 'ANAGLYPH SOLUTIONS', desc: 'Modern depth-mapping applied to classic formats for accessible immersive viewing.' },
];

const whyUsData = [
  { icon: History, title: '14 YEARS OF EXCELLENCE', desc: 'A decade of pioneering depth conversion and stereoscopic workflows for global cinema.' },
  { icon: Maximize, title: 'SCALABLE SOLUTIONS', desc: 'Flexible pipelines that handle everything from viral social reels to 4K feature films.' },
  { icon: CheckCircle2, title: 'FRAME-PERFECT QUALITY', desc: 'Surgical precision in every frame, ensuring zero visual fatigue and maximum immersion.' },
  { icon: MonitorSmartphone, title: 'VISION PRO READY', desc: 'Native optimization for Apple Vision Pro and the next generation of spatial displays.' },
];

// --- Sub-Components ---

const ODIBadge = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center px-4 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.15)] ${className}`}>
    <span className="text-cyan-400 font-black text-xs tracking-[0.3em]">STUDIO</span>
  </div>
);

const Card = ({ item, index, delay = 0.1, isActive = false }: { item: FeatureItem, index: number, delay?: number, isActive?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * delay }}
    className={`group p-10 rounded-[2rem] border transition-all duration-500 relative overflow-hidden backdrop-blur-md ${
      isActive 
        ? "bg-[#091524]/80 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.25)] scale-[1.02]" 
        : "bg-[#040815]/50 border-white/5 hover:bg-[#091524]/60 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:scale-[1.02]"
    }`}
  >
    {/* Glowing background card element */}
    <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full bg-cyan-500/10 blur-[50px] transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
    
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 border transition-all duration-500 ${
      isActive ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "bg-cyan-500/5 border-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 group-hover:text-cyan-300"
    }`}>
      <item.icon className="w-6 h-6" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-black mb-4 tracking-tight uppercase text-white leading-tight">{item.title}</h3>
    <p className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${isActive ? "text-white/70" : "text-white/40 group-hover:text-white/70"}`}>{item.desc}</p>
  </motion.div>
);

// --- Main Page Component ---

export function HomeFeatures() {
  const [activeService, setActiveService] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const serviceInterval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 3000);

    const productInterval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => {
      clearInterval(serviceInterval);
      clearInterval(productInterval);
    };
  }, []);

  return (
    <>
    <section className="py-24 bg-[#020617] text-white relative overflow-hidden font-sans">
    {/* Dynamic Background Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_70%)] opacity-30 pointer-events-none"/>

    <div className="max-w-7xl mx-auto px-6 relative z-10">

     {/* SECTION 1: WHO WE WORK WITH */}
     <div className="mb-40">
       <div className="text-center mb-16">
         <span className="text-cyan-500 text-xs font-black tracking-[0.4em] uppercase mb-3 block">COLLABORATION</span>
         <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight text-white leading-tight">Who We Work With</h2>
         <p className="text-white/60 text-base md:text-lg font-medium max-w-2xl mx-auto">
           Partnering with visionary storytellers, platforms, and brands to create immersive experiences that move audiences.
         </p>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         {[
           {
             id: '01',
             label: 'FILM STUDIOS',
             desc: 'Collaborating with leading studios to bring stories to life with depth and realism.',
             image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600'
           },
           {
             id: '02',
             label: 'OTT PLATFORMS',
             desc: 'Powering immersive streaming experiences for global audiences.',
             image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600'
           },
           {
             id: '03',
             label: 'CREATORS',
             desc: 'Empowering creators to express their vision with stereoscopic storytelling.',
             image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600'
           },
           {
             id: '04',
             label: 'AGENCIES',
             desc: 'Partnering with agencies to deliver campaigns that stand out in any frame.',
             image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600'
           },
           {
             id: '05',
             label: 'MUSIC LABELS',
             desc: 'Creating immersive visuals that amplify music and connect with fans.',
             image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600'
           },
           {
             id: '06',
             label: 'DOCUMENTARIES',
             desc: 'Enhancing real stories with immersive depth and authenticity.',
             image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600'
           }
         ].map((partner, index) => (
           <motion.div
             key={index}
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: index * 0.08 }}
             whileHover={{ y: -8, scale: 1.03 }}
             className="relative overflow-hidden rounded-xl border border-white/10 aspect-[9/16] bg-black/40 group transition-all duration-500 cursor-pointer shadow-lg hover:shadow-cyan-950/20 hover:border-cyan-500/30"
           >
             {/* Background Image */}
             <div className="absolute inset-0 overflow-hidden">
               <img
                 src={partner.image}
                 alt={partner.label}
                 className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.45] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-[0.6]"
               />
             </div>
 
             {/* Dark Overlay Gradient */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
 
             {/* Content */}
             <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end h-full">
               <span className="text-xl font-serif text-cyan-400 font-medium tracking-wide mb-1 block transition-colors duration-300">
                 {partner.id}
               </span>
               
               {/* Divider line that animates/expands on hover */}
               <div className="w-16 h-[1px] bg-cyan-500/40 mb-4 group-hover:w-full transition-all duration-500 ease-out" />
 
               <h3 className="text-base font-bold text-white tracking-wider mb-2 uppercase leading-tight">
                 {partner.label}
               </h3>
               
               <p className="text-[11px] text-white/50 leading-relaxed font-medium transition-colors duration-300 group-hover:text-white/70">
                 {partner.desc}
               </p>
             </div>
           </motion.div>
         ))}
       </div>
     </div>
 
 
 
    {/* SECTION 3: CONTENT THAT LEAPS OFF SCREEN (Refined Hero) */}
    <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-40 relative group"
    >
    <div className="rounded-[3.5rem] bg-gradient-to-br from-[#0D121F] to-[#020617] border border-white/10 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
    <div className="grid md:grid-cols-2 items-stretch">
    <div className="relative h-full min-h-[500px] overflow-hidden">
    <img
    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"
    alt="Spatial Technology"
    className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 transition-transform duration-1000 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020617]"/>
    <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay"/>
    </div>
    <div className="p-12 lg:p-20 flex flex-col justify-center bg-[#020617]/40 backdrop-blur-md">
    <span className="text-cyan-500 text-xs font-black tracking-[0.4em] uppercase mb-6 block">Spatial Evolution</span>
    <h2 className="text-5xl lg:text-6xl font-black leading-tight mb-8 tracking-tighter uppercase overflow-visible pr-4">
    Content that <span className="text-cyan-400">Leaps</span> the Screen
    </h2>
    <div className="space-y-6 text-white/50 text-lg font-medium leading-relaxed max-w-lg">
    <p>We transform standard 2D media into the next era of viewing — where <span className="text-white">glass-free 3D</span> creates unforgettable depth on mobile devices.</p>
    <p>Our proprietary AI-driven conversion pipeline ensures cinematic immersion without the need for hardware accessories.</p>
    </div>
    <button className="mt-10 flex items-center justify-center gap-3 w-fit px-10 py-5 bg-white text-black hover:bg-cyan-400 transition-all rounded-full font-black text-xs tracking-widest uppercase group/btn shadow-xl shadow-white/5">
    View Our Portfolio <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"/>
    </button>
    </div>
    </div>
    </div>
    </motion.div>
 
    {/* SECTION 2: WHAT WE DO */}
    <div className="mb-40">
    <div className="text-center mb-20">
    <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase leading-tight overflow-visible pr-4">
    WHAT WE <span className="text-cyan-400 bg-clip-text bg-gradient-to-b from-white to-white/20 p-4">DO</span>
    </h2>
    <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto">Exceptional depth and immersive workflows for the next generation of media.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {services.map((item, index) => (
    <Card key={index} item={item} index={index} isActive={index === activeService} />
    ))}
    </div>
    </div>
 
    {/* SECTION 4: OUR STORY (The Story) */}
    <div className="mb-40">
    <div className="grid lg:grid-cols-2 gap-20 items-center">
    <div>
    <div className="flex items-center mb-10">
    <h2 className="text-7xl font-black tracking-tight overflow-visible pr-4">OUR STORY</h2>
    </div>
    <div className="space-y-8 text-white/50 text-xl leading-relaxed">
    <p className="font-bold text-white">14 years of depth expertise. A team dedicated to the art of spatial storytelling.</p>
    <p>From Hollywood feature films to the next generation of mobile creators, we have been at the forefront of the 3D revolution. We don't just add depth; we bring dimension back to your vision.</p>
    <div className="pt-4">
    <button className="text-cyan-400 font-black text-sm tracking-widest uppercase border-b-2 border-cyan-400/20 hover:border-cyan-400 transition-all pb-1">
    Discover Our History
    </button>
    </div>
    </div>
    </div>
    <div className="relative aspect-square">
    <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"/>
    <div className="relative h-full w-full rounded-[3rem] overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-2xl">
    <img
    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
    alt="The Team"
    className="w-full h-full object-cover rounded-[2.5rem] grayscale brightness-50"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60"/>
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-3/4 aspect-video border border-cyan-500/30 rounded-2xl bg-cyan-950/40 backdrop-blur-2xl flex items-center justify-center">
    <div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center mb-2">
    <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#06b6d4]"/>
    </div>
    <span className="text-[10px] font-black tracking-widest text-cyan-400">PROCESSING DEPTH</span>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
 
    {/* SECTION 5: OUR PRODUCTS */}
    <div className="mb-40">
    <div className="flex flex-col items-center text-center mb-24">
    <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase leading-tight overflow-visible pr-4">
    OUR <span className="text-cyan-500">PRODUCTS</span>
    </h2>
    <div className="h-1.5 w-24 bg-cyan-500 rounded-full"/>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
    {products.map((item, index) => (
    <Card key={index} item={item} index={index} delay={0.2} isActive={index === activeProduct} />
    ))}
    </div>
    </div>

  {/* SECTION 6: WHY US */}
  <div className="py-24 border-t border-white/10">
  <div className="text-center mb-24">
  <div className="flex items-center justify-center gap-6 mb-6">
  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase overflow-visible pr-4">WHY US</h2>
  </div>
 <p className="text-white/40 text-xl font-medium tracking-tight">The trusted choice for premium immersive and spatial content.</p>
 </div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {whyUsData.map((item, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-500"
 >
 <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/10 group-hover:scale-110 transition-all">
 <item.icon className="w-6 h-6 text-cyan-400"strokeWidth={1} />
 </div>
 <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-5 text-white leading-tight">{item.title}</h3>
 <p className="text-white/40 text-sm leading-relaxed font-medium">{item.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>

  {/* Large Background Branding Watermark */}
  <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-[0.03] select-none">
  <h1 className="text-[30rem] font-black">STUDIO</h1>
  </div>

 </div>
 </section>

 {/* SECTION 7: COMPACT CALL TO ACTION */}
 <section className="py-12 relative z-10">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="max-w-5xl mx-auto px-6"
 >
 <div className="relative rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-10 md:p-14 overflow-hidden backdrop-blur-xl">

 {/* Subtle background glow */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32"/>

 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">

 {/* Text Content */}
 <div className="text-center md:text-left max-w-xl">
 <ODIBadge className="mb-4"/>
 <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[1.1] mb-4 overflow-visible pr-4">
 <span className="text-white">READY FOR</span> <br />
 <span className="text-cyan-400">THE NEXT DIMENSION?</span>
 </h2>
 <p className="text-white/50 text-base font-medium">
 Join leading studios worldwide. Let's transform your
 content into a premium spatial experience today.
 </p>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col gap-3 min-w-[220px]">
 <button className="px-8 py-4 bg-white text-black font-black text-[10px] tracking-[0.2em] uppercase rounded-full hover:bg-cyan-400 transition-all shadow-lg shadow-white/5">
 START A PROJECT
 </button>
 <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-full hover:bg-white/5 transition-all">
 TALK TO AN EXPERT
 </button>
 </div>

 </div>
 </div>
 </motion.div>
 </section>
 </>
 );
}
