import React, { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

// ─── FADE UP ──────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── IMAGE PLACEHOLDER ────────────────────────────────────────────────────────
function ImageSlot({ height = 480, label = 'Image', className = '' }: { height?: number; label?: string; className?: string }) {
  return (
    <div
      className={`w-full flex items-center justify-center ${className}`}
      style={{ height, background: T.bgAlt, border: `1px dashed ${T.border}`, borderRadius: 4 }}
    >
      <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: T.border }}>{label}</span>
    </div>
  );
}

// ─── POLYGON SHARD ────────────────────────────────────────────────────────────
function Shard({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke={T.border} strokeWidth="1" />
      <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill={T.border} opacity="0.06" />
    </svg>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const LearnMorePage: React.FC = () => {
  const navigate = useNavigate();
  const nextCollectionScrollRef = useRef<HTMLDivElement>(null);

  const scrollCollection = (direction: 'left' | 'right') => {
    if (nextCollectionScrollRef.current) {
      const { scrollLeft } = nextCollectionScrollRef.current;
      const offset = direction === 'left' ? -380 : 380;
      nextCollectionScrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <main style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          01 · HERO
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{ minHeight: '100vh', background: T.bg }} className="relative flex items-center overflow-hidden">
        <Shard size={56} className="absolute top-20 right-[14%] opacity-50" />
        <Shard size={32} className="absolute bottom-28 right-[30%] opacity-30" />
        <Shard size={44} className="absolute top-[45%] left-[2%] opacity-20" />

        <div className="w-full max-w-screen-xl mx-auto px-8 lg:px-16 grid grid-cols-12 gap-8 items-center py-24">
          {/* Left */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            
            <FadeUp delay={0.08}>
              <h1 className="font-black leading-none tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
                Space<br />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Explorer.
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.14}>
              <h2 className="text-xl lg:text-2xl font-bold tracking-tight mb-5" style={{ color: T.text }}>
                Look Up. The Universe is Waiting.
              </h2>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-base mb-10 leading-relaxed max-w-sm" style={{ color: T.sub }}>
                We wanted kids to feel what it's like to step into the stars. No screens, no batteries—just a real, beautifully made stereo 3D book that pulls them right into orbit.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex flex-wrap gap-3 mb-12">
                <button onClick={() => navigate('/checkout?product=space-explorer')}
                  className="px-7 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5"
                  style={{ background: T.text, color: T.bg }}>Buy Now</button>
                <button className="px-7 py-3.5 text-sm font-semibold tracking-wide border transition-transform hover:-translate-y-0.5"
                  style={{ background: 'transparent', color: T.text, borderColor: T.border }}>Watch Preview</button>
              </div>
            </FadeUp>
            <FadeUp delay={0.26}>
              <div className="flex flex-wrap gap-8" style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                {[['24', 'Pages'], ['Hard', 'Cover'], ['3D Glasses', 'Included'], ['Ages', '5+']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-sm font-bold">{v}</div>
                    <div className="text-[10px] tracking-wide uppercase mt-0.5" style={{ color: T.sub }}>{l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right — Hero Image */}
          <div className="col-span-12 lg:col-span-7 flex items-center justify-center">
            <FadeUp delay={0.2} className="w-full flex justify-center">
              <img
                src="/hero_section_Learnmore.png"
                alt="Space Explorer Book and 3D Glasses"
                className="max-h-[520px] w-auto object-contain rounded-2xl"
              />
            </FadeUp>
          </div>
        </div>
        <div className="absolute bottom-0 left-8 right-8 lg:left-16 lg:right-16 h-px" style={{ background: T.border }} />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          02 · MORE THAN A BOOK
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="more" style={{ background: T.bgAlt, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <h2 className="font-black leading-none tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
              A Real{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Adventure.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-base mb-16 max-w-lg leading-relaxed" style={{ color: T.sub }}>
              We believe magic happens when kids can touch, turn, and dive into a story. We crafted this to be something they'll remember holding long after they grow up.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ border: `1px solid ${T.border}` }}>
            {[
              { label: 'Learn', desc: 'Real stories about the cosmos, written just for them.', img: '/Learn_learnmore.png' },
              { label: 'Play', desc: 'Put on the glasses and watch the pages pull you in.', img: '/Play_Learnmore.png' },
              { label: 'Discover', desc: 'Little secrets waiting to be found in every corner.', img: '/Discover_leanmore.png' },
            ].map((c, i) => (
              <FadeUp key={c.label} delay={i * 0.09}>
                <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex flex-col p-6 cursor-pointer"
                  style={{ background: T.bg, borderRight: `1px solid ${T.border}` }}>
                  <div className="w-full aspect-[16/10] mb-6 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-black mb-3 tracking-tight" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>{c.label}</div>
                  <p className="text-sm leading-relaxed" style={{ color: T.sub }}>{c.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          03 · SEE THE DIFFERENCE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="difference" style={{ background: T.bg, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <h2 className="font-black leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
              It Actually{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Pops Out.
              </span>
            </h2>
            <p className="text-base mb-12 max-w-md leading-relaxed" style={{ color: T.sub }}>
              Slip on the 3D glasses, and the flat page suddenly turns into a deep, breathing world.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div
                  className="w-full h-[450px] rounded-2xl border border-neutral-200/40"
                  style={{
                    backgroundImage: 'url("/See the Picture.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <p className="text-xs font-semibold tracking-widest uppercase mt-4" style={{ color: T.sub }}>See the Picture</p>
              </div>
              <div>
                <div
                  className="w-full h-[450px] rounded-2xl border border-neutral-200/40"
                  style={{
                    backgroundImage: 'url("/Step Into the Picture.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <p className="text-xs font-semibold tracking-widest uppercase mt-4" style={{ color: T.text }}>Step Into the Picture</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          04 · PAGE GALLERY
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="gallery" style={{ background: T.bgAlt, padding: '80px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: T.sub }}>The Art</p>
            <h2 className="font-black leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
              Every Page,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                A World Of Its Own.
              </span>
            </h2>
            <p className="text-sm max-w-md leading-relaxed mb-12" style={{ color: T.sub }}>
              A look at the stereoscopic scenes crafted to bring cosmic learning directly to life.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Saturn', img: '/saturn.png' },
              { title: 'Rocket Launch', img: '/rocket.png' },
              { title: 'Planet Earth', img: '/earth.png' },
              { title: 'Asteroid Field', img: '/astroid.png' },
              { title: 'The Moon', img: '/moon.png', size: 'w-[90%] h-[90%]', scale: 'group-hover:scale-[1.7]' },
              { title: 'Space Station', img: '/iss.png' }
            ].map((item, i) => {
              const imgSize = item.size || 'w-[68%] h-[68%]';
              const hoverScale = item.scale || 'group-hover:scale-[1.65]';
              return (
                <FadeUp key={item.title} delay={i * 0.06}>
                  <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="cursor-pointer group relative z-0 hover:z-10">
                    <div className="w-full aspect-[16/8.5] overflow-visible rounded-2xl bg-white shadow-sm border border-neutral-200/60 flex items-center justify-center relative transition-colors duration-500 group-hover:bg-black group-hover:border-black">
                      {/* Space stars visible on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[15%] left-[15%]" />
                        <div className="absolute w-1 h-1 bg-white rounded-full top-[25%] right-[20%] opacity-80 animate-pulse" />
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full bottom-[20%] left-[25%]" />
                        <div className="absolute w-1 h-1 bg-white rounded-full bottom-[30%] right-[15%] opacity-90 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[55%] left-[10%]" />
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[70%] right-[35%]" />
                      </div>
                      <img src={item.img} alt={item.title} className={`${imgSize} object-contain transition-transform duration-500 ${hoverScale} relative z-10`} />
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase mt-4 px-1" style={{ color: T.text }}>{item.title}</p>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          05 · WHAT'S INSIDE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="inside" style={{ background: T.bg, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>Packaging & Details</p>
            <h2 className="font-black leading-none tracking-tight mb-16"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
              What's in the{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Box.
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 border-t border-neutral-100 pt-12">
            {[
              { label: 'The Book', sub: '24 pages. Hardcover. Built to survive bedtime.', img: '/book cover.jpg' },
              { label: 'The Glasses', sub: 'Carefully made so the magic actually works.', img: '/3d glasses.png' },
              { label: 'Collector Cards', sub: '12 planet cards they\'ll want to trade.', img: '/3D_Card.png' },
              { label: 'The Box', sub: 'A beautiful box, because first impressions matter.', img: '/book box.png' },
            ].map((item, i) => (
              <FadeUp key={item.label} delay={i * 0.08}>
                <div className="flex flex-col group cursor-pointer">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-full aspect-[4/3] bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-5 overflow-hidden border border-neutral-200/40 p-4 md:p-6"
                  >
                    <img
                      src={item.img}
                      alt={item.label}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.07)] group-hover:scale-[1.05] transition-all duration-300"
                    />
                  </motion.div>
                  <div className="px-1 text-center md:text-left">
                    <h3 className="font-bold text-sm mb-1.5" style={{ color: T.text }}>{item.label}</h3>
                    <p className="text-xs leading-relaxed max-w-[200px] mx-auto md:mx-0" style={{ color: T.sub }}>{item.sub}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          06 · DESIGNED FOR CURIOUS MINDS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="curious" style={{ background: T.bgAlt, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <img
              src="/Made for the Kids.png"
              alt="Made for the kids"
              className="w-full h-auto max-h-[520px] object-cover rounded-2xl shadow-sm border border-neutral-200/40"
            />
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-6" style={{ color: T.sub }}>Big Questions</p>
            <h2 className="font-black leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', letterSpacing: '-0.03em' }}>
              Made for the Kids<br />Asking{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                "Why?"
              </span>
            </h2>
            <p className="text-base mb-12 leading-relaxed max-w-sm" style={{ color: T.sub }}>
              We don't want kids just memorizing facts. We want them to get lost in the details and ask big questions.
            </p>
            <div className="flex flex-col gap-5">
              {['Seeing things for themselves', 'Sparking big ideas', 'Noticing the little things', 'Falling in love with science', 'Telling their own stories'].map((feat, i) => (
                <FadeUp key={feat} delay={0.2 + i * 0.06}>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-px" style={{ background: T.text }} />
                    <span className="text-sm font-semibold tracking-wide">{feat}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          08 · WATCH IT COME ALIVE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="video" style={{ background: T.bgAlt, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <h2 className="font-black leading-none tracking-tight mb-12"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
              See How It{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Feels.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-neutral-200/50 shadow-md bg-black">
              <video
                src="/ODI_SS1.mp4"
                controls
                className="w-full h-full object-contain"
                playsInline
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          09 · COMING NEXT
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="coming-next" style={{ background: T.bg, padding: '96px 0', overflow: 'hidden' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <FadeUp>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>The Collection</p>
              <h2 className="font-black leading-none tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
                What's{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Next.
                </span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1} className="flex gap-3 mt-6 md:mt-0">
              <button
                onClick={() => scrollCollection('left')}
                className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => scrollCollection('right')}
                className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </FadeUp>
          </div>

          <div
            ref={nextCollectionScrollRef}
            className="flex gap-6 overflow-x-auto pb-10 pt-4 px-1 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {[
              {
                title: 'Ocean Explorer',
                img: '/Ocean Explorer.png',
                vol: 'VOL. 02',
                teaser: 'Dive into glowing coral reefs and swim with ocean giants.',
                gradient: 'from-blue-50/70 to-cyan-100/40',
                border: 'border-blue-100/40',
                glow: 'group-hover:shadow-[0_24px_48px_-15px_rgba(56,189,248,0.25)]'
              },
              {
                title: 'Dinosaur Explorer',
                img: '/Dinosaur Explorer.png',
                vol: 'VOL. 03',
                teaser: 'Walk with the Triceratops and watch pre-historic worlds come alive.',
                gradient: 'from-emerald-50/70 to-teal-100/40',
                border: 'border-emerald-100/40',
                glow: 'group-hover:shadow-[0_24px_48px_-15px_rgba(52,211,153,0.25)]'
              },
              {
                title: 'Human Body',
                img: '/Human Body.png',
                vol: 'VOL. 04',
                teaser: 'Journey through the bloodstream and explore the heartbeat.',
                gradient: 'from-rose-50/70 to-orange-100/40',
                border: 'border-rose-100/40',
                glow: 'group-hover:shadow-[0_24px_48px_-15px_rgba(251,113,133,0.25)]'
              },
              {
                title: 'Wildlife',
                img: '/Wildlife.png',
                vol: 'VOL. 05',
                teaser: 'Track hidden predators across savannas and arctic tundras.',
                gradient: 'from-amber-50/70 to-lime-100/40',
                border: 'border-amber-100/40',
                glow: 'group-hover:shadow-[0_24px_48px_-15px_rgba(245,158,11,0.22)]'
              },
              {
                title: 'Ancient Egypt',
                img: '/Ancient Egypt.png',
                vol: 'VOL. 06',
                teaser: 'Decipher hieroglyphs and explore the tombs of the pharaohs.',
                gradient: 'from-yellow-50/70 to-amber-100/40',
                border: 'border-yellow-200/40',
                glow: 'group-hover:shadow-[0_24px_48px_-15px_rgba(217,119,6,0.22)]'
              },
              {
                title: 'Deep Ocean',
                img: '/Deep Ocean.png',
                vol: 'VOL. 07',
                teaser: 'Descend into total darkness to witness bizarre bioluminescent life.',
                gradient: 'from-indigo-50/70 to-purple-100/40',
                border: 'border-indigo-100/40',
                glow: 'group-hover:shadow-[0_24px_48px_-15px_rgba(129,140,248,0.25)]'
              }
            ].map((item, i) => (
              <div
                key={item.title}
                className="flex-shrink-0 w-[240px] md:w-[290px] snap-start"
              >
                <div className={`group flex flex-col h-full bg-white p-4 rounded-3xl border border-neutral-200/50 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-transparent ${item.glow}`}>
                  {/* Aspect ratio frame with custom pastel theme background */}
                  <div className={`w-full aspect-[3/4] bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center relative overflow-hidden border ${item.border} p-0 [perspective:1000px]`}>
                    
                    {/* Book mockup with 3D rotation on hover */}
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover filter drop-shadow-[2px_10px_20px_rgba(0,0,0,0.12)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:[transform:rotateY(-15deg)_rotateX(6deg)_scale(1.06)_translateZ(10px)]"
                    />

                    {/* Subtle book spine shadow on the left side of book to create 3D realism */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none bg-gradient-to-r from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Text details below card */}
                  <div className="mt-4 px-1 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-bold text-sm text-neutral-900 tracking-tight">{item.title}</h3>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed flex-1 mb-4">
                      {item.teaser}
                    </p>
                    <div className="w-full h-px bg-neutral-100/80 mb-3" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors duration-300">
                      Notify Me &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          10 · BUY NOW
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="buy" style={{ background: T.bgAlt, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <FadeUp className="w-full">
            <div
              className="w-full h-[440px] rounded-3xl border border-neutral-200/40 shadow-sm"
              style={{
                backgroundImage: 'url("/Book Mockup3.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: T.sub }}>ODI Kids · Space Explorer</p>
            <h2 className="font-black leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', letterSpacing: '-0.03em' }}>
              Space{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Explorer.
              </span>
            </h2>
            <p className="text-sm mb-8 leading-relaxed max-w-sm" style={{ color: T.sub }}>
              A real-world experience for your child. Comes with the book, the glasses, and the cards, all tucked securely into a beautiful box.
            </p>
            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-black" style={{ fontSize: '2rem' }}>₹1299</span>
              <span className="text-sm" style={{ color: T.sub }}>+ Free shipping</span>
            </div>
            <div className="flex gap-3 mb-10">
              <button onClick={() => navigate('/checkout?product=space-explorer')}
                className="flex-1 py-4 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5"
                style={{ background: T.text, color: T.bg }}>Buy Now</button>
              <button className="flex-1 py-4 text-sm font-semibold tracking-wide border transition-transform hover:-translate-y-0.5"
                style={{ background: 'transparent', color: T.text, borderColor: T.border }}>Add To Cart</button>
            </div>
            <div className="flex flex-wrap gap-6" style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
              {['Premium Quality', 'Fast Shipping', 'Secure Checkout'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: T.text }} />
                  <span className="text-xs font-semibold" style={{ color: T.sub }}>{t}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>


    </main>
  );
};

export default LearnMorePage;
