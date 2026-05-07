import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

interface IndustryPageProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  image: string;
}

export function IndustryBasePage({ title, subtitle, description, icon: Icon, features, image }: IndustryPageProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-24 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_70%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link to="/industries" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 mb-12 group transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black tracking-widest uppercase">Back to Industries</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-8 border border-cyan-500/20">
              <Icon className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic leading-[1]">
              {title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{subtitle}</span>
            </h1>

            <p className="text-xl text-white/50 font-medium leading-relaxed mb-10 max-w-xl">
              {description}
            </p>

            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase mb-6">Key Focus Areas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-sm font-bold text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full" />
            <div className="relative aspect-[4/5] lg:aspect-square rounded-[3rem] overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-3xl">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover rounded-[2.5rem] grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
