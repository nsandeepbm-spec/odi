import React from 'react';
import { HomeFeatures } from '../components/HomeFeatures';
import { Target, Lightbulb, Clock, Award, ShieldCheck, Zap, ArrowRight, Play } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <div className="bg-white text-neutral-900 font-sans min-h-screen p-8 md:p-16 selection:bg-indigo-100">

        {/* Hero Section */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-neutral-100 pb-24 items-center mt-12 max-w-screen-2xl mx-auto">
          <div className="md:w-1/2">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">About Us</span>
              <div className="h-px bg-indigo-500/30 w-12"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
              The Story<br />Behind The<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Depth.</span>
            </h1>
            <p className="text-neutral-500 text-lg leading-relaxed max-w-md">
              We are a team of spatial engineers and visual storytellers dedicated to
              redefining the boundaries of how we experience digital media.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden relative group border border-neutral-100 shadow-xl">
              <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1200" alt="3D Spatial Media" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="absolute -bottom-12 -left-12 aspect-square w-56 rounded-3xl overflow-hidden relative group border border-white shadow-2xl hidden md:block z-10 bg-neutral-100">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" alt="Precision Technology" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
          </div>
        </section>

        {/* Section 01: Our Mission */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-neutral-100 pb-24 max-w-screen-2xl mx-auto">
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-indigo-500 font-bold tracking-widest text-[11px]">01</span>
              <div className="h-px bg-indigo-500/30 w-8"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-none">Our<br />Mission.</h2>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-neutral-500 text-base leading-relaxed">
              <p>
                The mission of <span className="text-neutral-900 font-bold">our studio</span> is to restore the natural dimension that traditional flat screens have stripped away from visual storytelling.
              </p>
              <p>
                With over 14 years of experience in high-end cinema and digital media, we reveal the hidden depth in every frame to create experiences that resonate.
              </p>
              <div className="pt-8 border-t border-neutral-100 mt-8">
                <p className="text-indigo-600 font-bold italic text-lg leading-relaxed">
                  "The world isn't flat, and content shouldn't be either. We exist to bring those layers to life."
                </p>
              </div>
            </div>
            <div className="relative aspect-video border border-neutral-100 rounded-3xl overflow-hidden group bg-neutral-50 shadow-lg">
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" alt="Cinema" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-sm">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-widest drop-shadow-md">Focus</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Core Drivers */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-neutral-100 pb-24 max-w-screen-2xl mx-auto">
          <div className="md:w-1/4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-indigo-500 font-bold tracking-widest text-[11px]">02</span>
              <div className="h-px bg-indigo-500/30 w-8"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tight leading-none">Core<br />Drivers.</h2>
          </div>
          <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: "14 YEARS EXCELLENCE",
                desc: "A decade of pioneering depth conversion and workflows for cinema.",
                image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400"
              },
              {
                icon: Award,
                title: "FRAME PERFECT",
                desc: "Every individual frame treated with surgical precision.",
                image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=400"
              },
              {
                icon: ShieldCheck,
                title: "TRUSTED PARTNERS",
                desc: "Collaborating with brands to protect their creative vision.",
                image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400"
              },
              {
                icon: Zap,
                title: "SPATIAL READY",
                desc: "Leading the industry in content for immersive displays.",
                image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400"
              }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer relative overflow-hidden border border-neutral-100 aspect-[3/4] bg-neutral-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 mb-4 transform group-hover:scale-110 transition-transform">
                    <item.icon className="w-4 h-4 text-white drop-shadow-sm" />
                  </div>
                  <h3 className="text-[11px] font-black tracking-widest uppercase mb-2 text-white leading-tight drop-shadow-md">{item.title}</h3>
                  <p className="text-xs text-neutral-200 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </section>

      </div>
      <HomeFeatures />
    </>
  );
}