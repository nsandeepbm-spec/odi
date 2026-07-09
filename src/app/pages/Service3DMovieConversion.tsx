import { motion } from 'motion/react';
import { Layers, Scissors, Sliders, PenTool, Focus, CheckCircle, ArrowRight, Play, ArrowDown } from 'lucide-react';
import { Link } from 'react-router';

// ─── PLACEHOLDER COMPONENT ───────────────────────────────────────────────────
function ImagePlaceholder({ height = 400, label = 'Image Placeholder' }: { height?: number; label?: string }) {
  return (
    <div 
      className="w-full flex items-center justify-center rounded-3xl bg-neutral-50/50 border-2 border-dashed border-neutral-200"
      style={{ height }}
    >
      <span className="text-sm font-bold tracking-widest uppercase text-neutral-400">{label}</span>
    </div>
  );
}

export default function Service3DMovieConversion() {
 return (
 <div className="min-h-screen bg-white text-neutral-900 pt-24 md:pt-32 pb-24 selection:bg-indigo-100 font-sans">
 
  {/* ────────────────────────────────────────────────────────────────────────
      HERO SECTION
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 mb-32">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">Stereo Conversion</span>
          <div className="h-px bg-indigo-500/30 w-12"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.05]">
          Bring Every Frame Into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Real Depth.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed mb-10 max-w-lg">
          Stereo conversion transforms standard 2D footage into a natural stereoscopic 3D experience. Every shot is carefully rebuilt with accurate depth, making scenes feel larger, closer, and more immersive without changing the original story.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link to="/contact" className="px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-black tracking-widest uppercase text-xs transition-all shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
            Start Your Project <ArrowRight className="w-4 h-4"/>
          </Link>
          <Link to="/work" className="px-8 py-4 bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-full font-black tracking-widest uppercase text-xs transition-all flex items-center gap-2">
            <Play className="w-4 h-4"/> See Our Work
          </Link>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img src="/3d conversion hero.png" alt="Stereo Conversion Hero" className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      WHAT IS STEREO CONVERSION
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="bg-neutral-50 py-32 border-y border-neutral-100">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
      <div className="grid lg:grid-cols-12 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5"
        >
          <div className="w-full rounded-3xl overflow-hidden shadow-xl border border-neutral-100 bg-white">
            <img src="/What is Stereo Conversion.png" alt="What is Stereo Conversion" className="w-full h-auto object-cover" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">What is Stereo Conversion?</h2>
          <div className="space-y-6 text-xl text-neutral-500 font-medium leading-relaxed">
            <p>
              Stereo conversion is the process of rebuilding depth from existing 2D footage to create a stereoscopic 3D version suitable for cinemas, museums, and immersive displays.
            </p>
            <p>
              Every frame is treated individually to preserve scale, perspective, and visual comfort.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      WHAT WE DELIVER (FEATURE GRID)
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="py-32 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">What We Deliver</h2>
      <p className="text-xl text-neutral-500 font-medium">Precision at every step of the process.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
      {[
        { title: 'Accurate Depth Creation', desc: 'Natural stereo depth designed shot by shot.', icon: Layers },
        { title: 'Rotoscoping', desc: 'Precise object isolation for clean depth separation.', icon: Scissors },
        { title: 'Depth Grading', desc: 'Balanced depth that feels comfortable to watch.', icon: Sliders },
        { title: 'Stereo Paint', desc: 'Clean-up of hidden areas revealed during conversion.', icon: PenTool },
        { title: 'Edge Refinement', desc: 'Smooth silhouettes with stable stereo alignment.', icon: Focus },
        { title: 'Quality Control', desc: 'Every shot reviewed for consistency and viewer comfort.', icon: CheckCircle },
      ].map((feature, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
        >
          <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
            <feature.icon className="w-6 h-6 text-neutral-400 group-hover:text-indigo-500" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-neutral-900 tracking-tight">{feature.title}</h3>
          <p className="text-neutral-500 font-medium leading-relaxed">{feature.desc}</p>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl overflow-hidden shadow-2xl mt-12 border border-neutral-100 bg-white"
    >
      <img src="/What We Deliver.png" alt="What We Deliver" className="w-full h-auto object-cover" />
    </motion.div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      INDUSTRIES
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="bg-neutral-900 text-white py-32 border-y border-neutral-800">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 text-center">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">Industries We Serve</h2>
      
      <div className="flex flex-wrap justify-center gap-4 mb-20 max-w-4xl mx-auto">
        {[
          'Movies', 'Streaming Platforms', 'Documentaries', 
          'Museums', 'Planetariums', 'Advertising', 'Education'
        ].map((industry, i) => (
          <motion.span 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="px-6 py-3 rounded-full bg-white/10 border border-white/20 font-black tracking-widest uppercase text-xs hover:bg-white hover:text-neutral-900 transition-colors cursor-default"
          >
            {industry}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl overflow-hidden shadow-2xl mt-12 border border-neutral-800 bg-black max-w-5xl mx-auto"
      >
        <img src="/Industries We Serve.png" alt="Industries We Serve" className="w-full h-auto object-cover opacity-90" />
      </motion.div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      OUR WORKFLOW
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="py-32 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Our Workflow</h2>
      <p className="text-xl text-neutral-500 font-medium">A systematic pipeline for perfect depth.</p>
    </div>

    <div className="max-w-4xl mx-auto mb-20 relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 -translate-x-1/2 hidden md:block"></div>
      
      {[
        'Discovery', 'Shot Planning', 'Depth Design', 
        'Stereo Conversion', 'Stereo Paint', 'Quality Review', 'Delivery'
      ].map((step, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          <div className="md:w-1/2 flex justify-center md:justify-end w-full">
             <div className={`text-2xl font-black tracking-tight text-neutral-900 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
               {step}
             </div>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-neutral-900 border-4 border-white shadow-md flex items-center justify-center shrink-0 z-10 text-white font-black text-sm">
            {i + 1}
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-start w-full opacity-30 hidden md:block">
            {/* Optional subtext or icon could go here on the opposite side */}
          </div>
        </motion.div>
      ))}
    </div>

  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      FINAL CTA
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="py-32 bg-neutral-50 text-center border-t border-neutral-100">
    <div className="max-w-3xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight text-neutral-900">
          Ready to Start 3D Conversion?
        </h2>
        <p className="text-xl text-neutral-500 font-medium leading-relaxed mb-12">
          Whether it's a feature film, commercial, museum experience, or immersive installation, we help transform flat imagery into natural stereoscopic storytelling.
        </p>
        <Link to="/contact" className="inline-flex px-10 py-5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-black tracking-widest uppercase text-sm transition-all shadow-xl hover:-translate-y-0.5 items-center gap-3">
          Let's Talk <ArrowRight className="w-4 h-4"/>
        </Link>
      </motion.div>
    </div>
  </section>

 </div>
 );
}
