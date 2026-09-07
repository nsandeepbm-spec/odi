import { motion } from 'motion/react';
import { HomeFeatures } from '../components/HomeFeatures';
import { PageCTA } from '../components/PageCTA';
import { Target, Lightbulb, Clock, Award, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function AboutPage() {
  return (
    <>
      <div className="bg-white text-neutral-900 font-sans min-h-screen selection:bg-indigo-100 overflow-x-hidden">

        {/* ────────────────────────────────────────────────────────
            HERO
        ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center border-b border-neutral-100 bg-neutral-50 overflow-hidden pt-24 pb-16">
          {/* Subtle background gradient */}
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 80% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

          <div className="max-w-screen-xl w-full mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-indigo-600 font-semibold tracking-widest text-xs uppercase">About ODI Studio</span>
                  <div className="h-px bg-indigo-200 w-12" />
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter leading-[1.05] text-neutral-900">
                  The Story<br />Behind The<br />
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Depth.</span>
                </h1>

                <p className="text-xl text-neutral-600 leading-relaxed mb-10 max-w-lg font-medium">
                  We are a team of spatial engineers and visual storytellers dedicated to redefining how people experience digital media — one frame at a time.
                </p>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">14+</div>
                    <div className="text-xs text-neutral-500 font-medium tracking-wide uppercase mt-1">Years</div>
                  </div>
                  <div className="w-px h-10 bg-neutral-200" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">200+</div>
                    <div className="text-xs text-neutral-500 font-medium tracking-wide uppercase mt-1">Projects</div>
                  </div>
                  <div className="w-px h-10 bg-neutral-200" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">40+</div>
                    <div className="text-xs text-neutral-500 font-medium tracking-wide uppercase mt-1">Partners</div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Hero image */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 group">
                  <img
                    src="/about-image/hero-about.png"
                    alt="ODI Studio — Spatial Media"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">ODI Studio · Established 2011</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
            01 — OUR MISSION
        ──────────────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 border-b border-neutral-100">
          <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease }}
              >
                <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 group relative">
                  <img
                    src="/about-image/hero 2.png"
                    alt="Our Mission"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Our Focus</span>
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.12, ease }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">01</span>
                  <div className="h-px w-8 bg-neutral-300" />
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Our Mission</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter text-neutral-900 leading-[1.1]">
                  Restoring the natural<br />dimension of story.
                </h2>
                <div className="space-y-5 text-neutral-600 text-lg font-medium leading-relaxed">
                  <p>
                    The mission of <span className="text-neutral-900 font-bold">ODI Studio</span> is to restore the natural dimension that traditional flat screens have stripped away from visual storytelling.
                  </p>
                  <p>
                    With over 14 years of experience in high-end cinema and digital media, we reveal the hidden depth in every frame to create experiences that resonate on a visceral level.
                  </p>
                </div>
                <div className="mt-10 pt-8 border-t border-neutral-100">
                  <p className="text-indigo-600 font-semibold italic text-xl leading-relaxed">
                    "The world isn't flat, and content shouldn't be either."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
            02 — CORE DRIVERS
        ──────────────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-neutral-50 border-b border-neutral-100">
          <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">

            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">02</span>
                <div className="h-px w-8 bg-neutral-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Core Drivers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 leading-[1.1]">
                What we stand for.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Clock, title: '14 Years Excellence', desc: 'A decade of pioneering depth conversion workflows for cinema and digital media.', image: '/about-image/Card 01.png' },
                { icon: Award, title: 'Frame Perfect', desc: 'Every individual frame treated with surgical precision and artistry.', image: '/about-image/Card 02.png' },
                { icon: ShieldCheck, title: 'Trusted Partners', desc: 'Collaborating with leading brands to protect and elevate their creative vision.', image: '/about-image/Card 03.png' },
                { icon: Zap, title: 'Spatial Ready', desc: 'Leading the industry in content built for immersive spatial displays.', image: '/about-image/Card 04.png' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease }}
                  className="group cursor-pointer relative overflow-hidden aspect-[3/4] rounded-[2rem] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/25 transition-colors">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold tracking-tight mb-2 text-white leading-tight">{item.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────
            03 — OUR VALUES
        ──────────────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 border-b border-neutral-100">
          <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">03</span>
                <div className="h-px w-8 bg-neutral-300" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Our Values</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 leading-[1.1] max-w-xl">
                Principles that guide every frame.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Lightbulb, label: 'Curiosity First', body: 'We begin every project by asking what would make this feel truly alive — not just technically correct.' },
                { icon: ShieldCheck, label: 'Creative Integrity', body: "We never alter the director's intent. Depth is added, never imposed. The story always comes first." },
                { icon: Zap, label: 'Craft at Scale', body: 'From a single short to a full library of thousands of titles, our pipeline delivers consistent quality at any volume.' },
              ].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease }}
                  className="p-8 rounded-[2rem] border border-neutral-200/60 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <v.icon className="w-5 h-5 text-neutral-600 group-hover:text-indigo-600 transition-colors" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-neutral-900">{v.label}</h3>
                  <p className="text-neutral-500 leading-relaxed font-medium">{v.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* HomeFeatures component */}
      <HomeFeatures />

      {/* CTA */}
      <PageCTA
        heading="Ready to work with us?"
        subtext="Whether you're converting a feature film, a content library, or a single campaign — we'd love to hear about your project."
        showServices={true}
        showOrder={false}
        showContact={true}
      />
    </>
  );
}