import { motion } from 'motion/react';
import { Film, Check } from 'lucide-react';

export default function Service3DMovieConversion() {
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
              <Film className="w-8 h-8 text-[#06B6D4]" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              3D MOVIE CONVERSION
            </h1>
            
            <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-6 leading-snug">
              Feature-length cinematic depth conversion with frame-by-frame precision
            </h2>
            
            <p className="text-white/60 text-lg leading-relaxed font-light">
              Transform your feature films into premium 3D experiences with our conversion process that's a step ahead of the rest. With 14 years of expertise, we deliver theatrical-grade depth that improves and refines storytelling while maintaining the director's original vision.
            </p>
          </div>
          
          <div className="w-full lg:w-1/2 h-[400px] md:h-full relative min-h-[400px]">
            {/* Glowing gradient behind the image */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A111A]/80 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1617802690992-15d93263d3a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="3D Movie Conversion" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </motion.section>

        {/* 2. Theatrical Experience Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 h-[450px] shadow-2xl flex items-end"
        >
          <img 
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Theatrical Experience" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A111A] via-[#0A111A]/60 to-transparent" />
          
          <div className="relative z-10 p-10 md:p-16 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              THE ULTIMATE THEATRICAL EXPERIENCE
            </h2>
            <p className="text-white/70 text-lg leading-relaxed font-light">
              Our 3D conversion brings audiences deeper into the story, creating an immersive cinematic experience that transforms passive viewing into emotional engagement. Every frame is crafted to enhance depth, dimension, and visual storytelling.
            </p>
          </div>
        </motion.section>

        {/* 3. Comprehensive Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-16 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase">
            Comprehensive Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
            {[
              "Frame-by-frame depth analysis",
              "Theatrical grade quality",
              "Director-approved workflows",
              "Full-length features (90-180 min)",
              "Multiple output formats",
              "Quality assurance at every stage",
              "Stereo cleanup included",
              "Archive-ready deliverables"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-6 h-6 rounded-full bg-[#06B6D4]/10 flex items-center justify-center shrink-0 border border-[#06B6D4]/30">
                  <Check className="w-3.5 h-3.5 text-[#06B6D4]" strokeWidth={3} />
                </div>
                <span className="text-white/70 font-medium tracking-wide group-hover:text-white transition-colors">{feature}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 4. Process & Deliverables */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* OUR PROCESS */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase">
              Our Process
            </h2>
            
            <div className="space-y-8">
              {[
                { title: "Analysis & Planning", desc: "Deep dive into your film's visual language, shot complexity, and creative goals." },
                { title: "Depth Grading", desc: "Artistic depth mapping that enhances narrative and emotional beats." },
                { title: "Stereo Conversion", desc: "Frame-by-frame conversion with pixel-perfect rotoscoping and depth refinement." },
                { title: "Quality Control", desc: "Multi-stage QC including stereo alignment, ghosting elimination, and director review." },
                { title: "Final Delivery", desc: "Multiple formats delivered: theatrical DCP, streaming masters, and archival files." }
              ].map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 flex items-center justify-center shrink-0 border border-[#06B6D4]/30 font-bold text-[#06B6D4]">
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

          {/* WHAT YOU GET */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg flex flex-col"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase">
              What You Get
            </h2>
            
            <ul className="space-y-4 mb-12 flex-grow">
              {[
                "Full 3D feature film",
                "Theatrical DCP (if needed)",
                "Streaming-ready masters",
                "Multiple resolution outputs",
                "Stereo alignment reports",
                "Quality assurance documentation",
                "Archival-grade files"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#06B6D4] shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  <span className="text-white/80 font-medium tracking-wide">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8">
              <span className="text-white/50 text-sm font-medium uppercase tracking-wider mb-2 block">Investment</span>
              <h3 className="text-3xl font-black mb-4">Custom Quote</h3>
              <p className="text-white/60 font-light text-sm leading-relaxed mb-8">
                Pricing varies based on film length, complexity, and delivery timeline. Contact us for a detailed estimate.
              </p>
              <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-lg">
                Request Custom Quote
              </button>
            </div>
          </motion.section>
        </div>
        
      </div>
    </div>
  );
}
