import { motion } from 'motion/react';
import { Layers, Check, ArrowRight } from 'lucide-react';

export default function ServiceDepthCompositing() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-14">

        {/* ─────────────────────────────────────────────── */}
        {/* 1. HERO — text left, image right                */}
        {/* ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#0A111A]/80 border border-white/5 shadow-2xl flex flex-col md:flex-row items-stretch min-h-[440px]"
        >
          <div className="p-10 md:p-16 lg:w-3/5 relative z-10 flex flex-col justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 flex items-center justify-center mb-8 border border-[#06B6D4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Layers className="w-7 h-7 text-[#06B6D4]" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
              Depth Compositing & Stereo Cleanup
            </h1>
            <h2 className="text-xl text-white/80 font-medium mb-6 leading-snug">
              Professional stereo refinement and technical quality assurance for any 3D project
            </h2>
            <p className="text-white/55 text-lg leading-relaxed font-light mb-10 max-w-xl">
              Already have 3D content but need expert cleanup or technical QA? ODI's depth compositing and stereo cleanup services ensure your content meets the highest technical and artistic standards — whether for theatrical release, streaming, or archival.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                Request Technical Assessment
              </button>
              <button className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/70 hover:text-white transition-colors">
                View Process <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="w-full lg:w-2/5 h-[300px] lg:h-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A111A] via-[#0A111A]/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Depth Compositing Studio"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────── */}
        {/* 2. METRICS STRIP — horizontal numbers bar       */}
        {/* ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 divide-x divide-white/5 rounded-[2rem] bg-[#0A111A]/60 border border-white/5 overflow-hidden"
        >
          {[
            { value: '14+', label: 'Years of Experience', sub: 'In stereo 3D production' },
            { value: '500+', label: 'Projects Cleaned', sub: 'Feature films to short-form' },
            { value: '100%', label: 'QA Verified', sub: 'Every frame, every delivery' },
          ].map((m, i) => (
            <div key={i} className="p-8 md:p-12 text-center flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-white mb-2">{m.value}</span>
              <span className="text-white/80 font-bold text-sm md:text-base mb-1">{m.label}</span>
              <span className="text-white/40 text-xs font-light hidden md:block">{m.sub}</span>
            </div>
          ))}
        </motion.section>

        {/* ─────────────────────────────────────────────── */}
        {/* 3. FULL-WIDTH CINEMATIC BANNER                  */}
        {/* ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 h-[420px] shadow-2xl flex items-end"
        >
          <img
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
            alt="Technical Excellence"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060E18] via-[#060E18]/50 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-end justify-between w-full gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight uppercase">
                Technical Excellence in Every Frame
              </h2>
              <p className="text-white/70 text-lg leading-relaxed font-light">
                From fixing stereo issues to preparing content for theatrical distribution, our technical team ensures flawless playback across all platforms.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
              <span className="text-white font-semibold text-sm whitespace-nowrap">ODI Stereo QA Pipeline</span>
            </div>
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────── */}
        {/* 4. CAPABILITIES — asymmetric split layout       */}
        {/* ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left: large text heading */}
          <div className="lg:w-2/5 flex flex-col justify-between p-10 md:p-14 rounded-[2rem] bg-gradient-to-br from-[#06B6D4]/5 to-[#3B82F6]/5 border border-[#06B6D4]/10 shadow-lg">
            <div>
              <span className="text-[#06B6D4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">What We Fix & Enhance</span>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-6">
                Technical<br />Capabilities
              </h2>
              <p className="text-white/55 font-light leading-relaxed">
                Our stereo engineering team handles every category of depth and alignment issue — from ghosting artefacts to full convergence recalibration.
              </p>
            </div>
            <div className="mt-10 relative h-[200px] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Post Production"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/60 to-transparent" />
            </div>
          </div>

          {/* Right: numbered capability list */}
          <div className="lg:w-3/5 rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-14 shadow-lg">
            <div className="space-y-0 divide-y divide-white/5">
              {[
                { num: '01', title: 'Stereo Alignment Correction', desc: 'Fix horizontal and vertical misalignment across all frames.' },
                { num: '02', title: 'Ghosting Elimination', desc: 'Remove ghosting and crosstalk artefacts from any 3D format.' },
                { num: '03', title: 'Depth Map Refinement', desc: 'Improve depth quality for more natural, comfortable viewing.' },
                { num: '04', title: 'Convergence Calibration', desc: 'Precise convergence tuning for theatrical and home viewing.' },
                { num: '05', title: 'VFX Depth Integration', desc: 'Seamlessly blend 3D VFX elements with native depth.' },
                { num: '06', title: 'Technical QA Services', desc: 'Comprehensive quality assurance and compliance verification.' },
                { num: '07', title: 'Format Conversion', desc: 'Convert between 3D formats: SBS, OU, anaglyph, MVC, MV-HEVC.' },
                { num: '08', title: 'Archive Restoration', desc: 'Restore and upgrade legacy 3D content for modern platforms.' },
              ].map((cap, i) => (
                <div key={i} className="group flex items-start gap-6 py-5 hover:bg-white/[0.02] transition-colors -mx-2 px-2 rounded-xl">
                  <span className="text-[#06B6D4]/40 font-black text-sm w-8 shrink-0 mt-0.5 group-hover:text-[#06B6D4]/70 transition-colors">{cap.num}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-1 group-hover:text-[#06B6D4] transition-colors">{cap.title}</h3>
                    <p className="text-white/45 text-sm font-light leading-relaxed">{cap.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-[#06B6D4] transition-all shrink-0 mt-1 group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────── */}
        {/* 5. WORKFLOW — horizontal numbered stepper       */}
        {/* ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-14 shadow-lg"
        >
          <div className="mb-12">
            <span className="text-[#06B6D4] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">How It Works</span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide">Technical Workflow</h2>
          </div>

          {/* Connector line + steps */}
          <div className="relative">
            {/* Horizontal line (desktop) */}
            <div className="hidden lg:block absolute top-5 left-5 right-5 h-px bg-gradient-to-r from-[#06B6D4]/30 via-[#3B82F6]/30 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {[
                { title: 'Technical Analysis', desc: 'Full review of existing 3D content, formats, and issues.' },
                { title: 'Issue Identification', desc: 'Precise breakdown of every stereo problem found.' },
                { title: 'Cleanup & Refinement', desc: 'Frame-by-frame correction of alignment and depth.' },
                { title: 'Quality Verification', desc: 'Multi-stage QC — automated and manual.' },
                { title: 'Final Delivery', desc: 'Corrected masters with full technical documentation.' },
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col lg:pt-12">
                  <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/40 flex items-center justify-center font-black text-[#06B6D4] text-sm mb-4 shrink-0 relative z-10">
                    {i + 1}
                  </div>
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-white/45 text-sm font-light leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─────────────────────────────────────────────── */}
        {/* 6. DELIVERABLES + PRICING — bottom split       */}
        {/* ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Deliverables — wider */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg"
          >
            <span className="text-[#06B6D4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">What You Receive</span>
            <h2 className="text-xl font-black mb-8 uppercase tracking-wide">Deliverables Package</h2>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {[
                'Cleaned stereo masters',
                'Before/after comparison reel',
                'Technical QA reports',
                'Depth-fix inventory sheet',
                'Alignment correction files',
                'Referential comparison files',
                'Archive-ready export files',
                'Issue resolution notes',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center shrink-0 group-hover:bg-[#06B6D4]/20 transition-colors">
                    <Check className="w-3 h-3 text-[#06B6D4]" strokeWidth={3} />
                  </div>
                  <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Pricing CTA — narrower */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 rounded-[2rem] bg-gradient-to-b from-[#06B6D4]/5 to-[#0A111A] border border-[#06B6D4]/10 p-10 shadow-lg flex flex-col"
          >
            <span className="text-[#06B6D4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Investment</span>
            <h2 className="text-3xl md:text-4xl font-black mb-5">Custom<br />Quote</h2>
            <p className="text-white/55 font-light leading-relaxed mb-auto">
              Pricing is based on content length, issue complexity, and required quality level. Every project is assessed individually to give you an accurate estimate.
            </p>

            <div className="mt-10 space-y-3">
              <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-lg">
                Request Technical Assessment
              </button>
              <button className="w-full py-3.5 rounded-xl font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                View Sample QA Report
              </button>
            </div>
          </motion.section>
        </div>

      </div>
    </div>
  );
}
