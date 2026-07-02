import React from 'react';
import { Target, Lightbulb, Clock, Award, ShieldCheck, Zap, ArrowRight, Play } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen p-8 md:p-16">
      
      {/* Hero Section */}
      <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-white/10 pb-24 items-center mt-12">
        <div className="md:w-1/2">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium tracking-widest text-sm">ABOUT US</span>
            <div className="h-px bg-cyan-500/50 w-12"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-wide leading-tight">The Story<br />Behind The<br /><span className="font-bold">Depth.</span></h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-md">
            We are a team of spatial engineers and visual storytellers dedicated to
            redefining the boundaries of how we experience digital media.
          </p>
        </div>
        <div className="md:w-1/2 relative">
            <div className="aspect-[4/3] rounded-sm overflow-hidden relative group border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1200" alt="3D Spatial Media" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border border-cyan-500/20 mix-blend-overlay"></div>
            </div>
            
            <div className="absolute -bottom-12 -left-12 aspect-square w-56 rounded-sm overflow-hidden relative group border border-white/10 hidden md:block z-10 shadow-2xl bg-black">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" alt="Precision Technology" className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent mix-blend-overlay"></div>
            </div>
        </div>
      </section>

      {/* Section 01: Our Mission */}
      <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-white/10 pb-24">
        <div className="md:w-1/3">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium">01</span>
            <div className="h-px bg-cyan-500/50 w-8"></div>
          </div>
          <h2 className="text-4xl font-light mb-6 tracking-wide">Our<br />Mission.</h2>
        </div>
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 text-white/60 text-sm leading-relaxed">
                <p>
                  The mission of <span className="text-white font-bold">our studio</span> is to restore the natural dimension that traditional flat screens have stripped away from visual storytelling.
                </p>
                <p>
                 With over 14 years of experience in high-end cinema and digital media, we reveal the hidden depth in every frame to create experiences that resonate.
                </p>
                <div className="pt-6 border-t border-white/10">
                 <p className="text-cyan-500 font-medium italic">
                "The world isn't flat, and content shouldn't be either. We exist to bring those layers to life."
                 </p>
                </div>
            </div>
            <div className="relative aspect-video border border-white/10 rounded-sm overflow-hidden group bg-black">
                <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" alt="Cinema" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Target className="w-4 h-4 text-cyan-500" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Focus</span>
                </div>
            </div>
        </div>
      </section>

      {/* Section 02: Core Drivers */}
      <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-white/10 pb-24">
        <div className="md:w-1/4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium">02</span>
            <div className="h-px bg-cyan-500/50 w-8"></div>
          </div>
          <h2 className="text-4xl font-light mb-12 tracking-wide">Core<br />Drivers.</h2>
        </div>
        <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
             {
             icon: Clock,
             title:"14 YEARS OF EXCELLENCE",
             desc:"A decade of pioneering depth conversion and stereoscopic workflows for global cinema.",
             image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400"
             },
             {
             icon: Award,
             title:"FRAME-PERFECT QUALITY",
             desc:"Every individual frame treated with surgical precision and artistic intention.",
             image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=400"
             },
             {
             icon: ShieldCheck,
             title:"TRUSTED PARTNERSHIPS",
             desc:"Collaborating with directors and brands to protect and enhance their creative vision.",
             image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
             },
             {
             icon: Zap,
             title:"SPATIAL READINESS",
             desc:"Leading the industry in content optimization for Vision Pro and immersive displays.",
             image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400"
             }
          ].map((item, i) => (
             <div key={i} className="group cursor-pointer relative overflow-hidden border border-white/10 aspect-[3/4] bg-black/50 rounded-sm">
               <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
               
               <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                 <item.icon className="w-5 h-5 text-cyan-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                 <h3 className="text-sm font-bold mb-2 text-white leading-tight">{item.title}</h3>
                 <p className="text-[10px] text-white/50 leading-relaxed">{item.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Pagination dots at the bottom */}
      <div className="flex justify-center gap-2 mt-12 pb-8">
         <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
      </div>
    </div>
  );
}