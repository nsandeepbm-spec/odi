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
 <div className="min-h-screen bg-white text-neutral-900 selection:bg-indigo-100 font-sans">
 
  {/* ────────────────────────────────────────────────────────────────────────
      HERO SECTION
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="bg-neutral-50 min-h-screen flex items-center pt-32 pb-24 border-b border-neutral-200">
    <div className="max-w-screen-xl w-full mx-auto px-6 md:px-12 lg:px-16">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col text-center lg:text-left items-center lg:items-start"
        >
          <div className="flex items-center gap-4 mb-6 text-indigo-600 font-semibold tracking-wide uppercase text-sm">
            <span>Stereo Conversion</span>
            <div className="h-px bg-indigo-200 w-12"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter leading-[1.05] text-neutral-900">
          Bring Every Frame Into <br className="hidden lg:block"/>
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Real Depth.</span>
        </h1>
          
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0 font-medium">
            Stereo conversion transforms standard 2D footage into a natural stereoscopic 3D experience. Every shot is carefully rebuilt with accurate depth, making scenes feel larger, closer, and more immersive.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link to="/contact" className="px-10 py-4 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-semibold text-lg transition-transform hover:scale-105 shadow-xl shadow-neutral-900/20 flex items-center justify-center gap-2 w-full sm:w-auto">
              Start Your Project <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="w-full flex items-center justify-center lg:justify-end"
        >
          <img 
            src="/3d conversion hero.png" 
            alt="Stereo Conversion Hero" 
            className="w-full max-w-[600px] xl:max-w-[700px] max-h-[600px] object-contain drop-shadow-2xl" 
          />
        </motion.div>
      </div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      WHAT IS STEREO CONVERSION
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="bg-white py-32 border-t border-neutral-200">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-100 bg-white ring-1 ring-black/5">
            <img src="/What is Stereo Conversion.png" alt="What is Stereo Conversion" className="w-full h-auto object-cover" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter text-neutral-900">What is Stereo Conversion?</h2>
          <div className="space-y-6 text-xl text-neutral-600 font-medium leading-relaxed max-w-lg">
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
      WHAT WE DELIVER
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="py-32 bg-neutral-50 border-t border-neutral-200">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-neutral-900">What We Deliver</h2>
        <p className="text-xl text-neutral-600 font-medium">Precision at every step of the process.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-10 rounded-[2rem] bg-white border border-neutral-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors duration-300">
              <feature.icon className="w-6 h-6 text-neutral-600 group-hover:text-indigo-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-900">{feature.title}</h3>
            <p className="text-neutral-600 font-medium leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-[2rem] overflow-hidden shadow-2xl mt-12 border border-neutral-200/60 bg-white ring-1 ring-black/5"
      >
        <img src="/What We Deliver.png" alt="What We Deliver" className="w-full h-auto object-cover" />
      </motion.div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      INDUSTRIES
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="bg-neutral-900 text-white py-32 border-t border-neutral-800">
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 text-center">
      <motion.h2
        className="text-4xl md:text-5xl font-bold tracking-tighter mb-16 text-white"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >Industries We Serve</motion.h2>
      
      <div className="flex flex-wrap justify-center gap-3 mb-24 max-w-4xl mx-auto">
        {[
          'Movies', 'Streaming Platforms', 'Documentaries', 
          'Museums', 'Planetariums', 'Advertising', 'Education'
        ].map((industry, i) => (
          <motion.span 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="px-6 py-3 rounded-full bg-white/10 border border-white/20 font-medium text-white hover:bg-white hover:text-neutral-900 transition-colors text-lg cursor-default shadow-sm"
          >
            {industry}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-[2rem] overflow-hidden shadow-2xl mt-12 border border-neutral-800 bg-black max-w-5xl mx-auto ring-1 ring-white/10"
      >
        <img src="/Industries We Serve.png" alt="Industries We Serve" className="w-full h-auto object-cover opacity-80" />
      </motion.div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      OUR WORKFLOW
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="py-32 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
    <motion.div
      className="text-center mb-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-neutral-900">Our Workflow</h2>
      <p className="text-xl text-neutral-600 font-medium">A systematic pipeline for perfect stereo output.</p>
    </motion.div>

    <div className="relative max-w-5xl mx-auto">
      {/* Animated Horizontal Line connecting nodes (desktop only) */}
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
        className="absolute left-[7%] right-[7%] top-8 h-0.5 bg-neutral-300 hidden lg:block origin-left z-0" 
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-12 lg:gap-y-0 relative z-10">
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
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-white border-2 border-neutral-300 shadow-md flex items-center justify-center text-neutral-600 font-bold text-xl mb-6 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all duration-300">
              {i + 1}
            </div>
            <div className="text-sm font-semibold tracking-tight text-neutral-600 px-2 group-hover:text-neutral-900 transition-colors">
              {step}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* ────────────────────────────────────────────────────────────────────────
      FINAL CTA
      ──────────────────────────────────────────────────────────────────────── */}
  <section className="py-32 bg-neutral-50 text-center border-t border-neutral-200">
    <div className="max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter text-neutral-900 leading-[1.05]">
          Ready to Start <br className="hidden md:block"/> 3D Conversion?
        </h2>
        <p className="text-xl md:text-2xl text-neutral-600 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
          Whether it's a feature film, commercial, museum experience, or immersive installation, we help transform flat imagery into natural stereoscopic storytelling.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/contact" className="inline-flex px-12 py-5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-neutral-900/20 items-center gap-3">
            Let's Talk <ArrowRight className="w-5 h-5"/>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>

 </div>
 );
}
