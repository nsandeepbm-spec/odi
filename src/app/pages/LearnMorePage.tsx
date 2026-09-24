import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };
const shell = 'w-full max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-16';
const sectionY = 'py-16 sm:py-20 lg:py-28';

// ─── FADE UP ──────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── POLYGON SHARD ────────────────────────────────────────────────────────────
function Shard({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke={T.border} strokeWidth="1" />
      <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill={T.border} opacity="0.06" />
    </svg>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const LearnMorePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main
      className="overflow-x-hidden"
      style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}
    >

      {/* ═══════════════════════════════════════════════════════════════════════
          01 · HERO
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        style={{ background: T.bg }}
        className="relative flex items-center overflow-hidden min-h-[auto] lg:min-h-screen"
      >
        <Shard size={56} className="absolute top-20 right-[14%] opacity-50 hidden md:block" />
        <Shard size={32} className="absolute bottom-28 right-[30%] opacity-30 hidden lg:block" />
        <Shard size={44} className="absolute top-[45%] left-[2%] opacity-20 hidden lg:block" />

        <div className={`${shell} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-20 pb-14 sm:pt-24 sm:pb-16 lg:py-24`}>
          <div className="lg:col-span-5 flex flex-col order-2 lg:order-1">
            <FadeUp delay={0.08}>
              <h1
                className="font-black leading-none tracking-tight mb-4 sm:mb-6"
                style={{ fontSize: 'clamp(2.25rem, 8vw, 4rem)', letterSpacing: '-0.03em' }}
              >
                Space<br />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Explorer.
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.14}>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight mb-4 sm:mb-5" style={{ color: T.text }}>
                Look Up. The Universe is Waiting.
              </h2>
            </FadeUp>
            <FadeUp delay={0.18}>
              <p className="text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed max-w-sm" style={{ color: T.sub }}>
                We wanted kids to feel what it's like to step into the stars. No screens, no batteries—just a real, beautifully made stereo 3D book that pulls them right into orbit.
              </p>
            </FadeUp>
            <FadeUp delay={0.22}>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10 sm:mb-12">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5"
                  style={{ background: T.text, color: T.bg }}
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold tracking-wide border transition-transform hover:-translate-y-0.5"
                  style={{ background: 'transparent', color: T.text, borderColor: T.border }}
                >
                  Contact Us
                </button>
              </div>
            </FadeUp>
            <FadeUp delay={0.26}>
              <div
                className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-5 sm:gap-8"
                style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}
              >
                {[['24', 'Pages'], ['Hard', 'Cover'], ['3D Glasses', 'Included'], ['6–99', 'Ages']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-sm font-bold">{v}</div>
                    <div className="text-[10px] tracking-wide uppercase mt-0.5" style={{ color: T.sub }}>{l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center order-1 lg:order-2">
            <FadeUp delay={0.12} className="w-full flex justify-center">
              <img
                src="/learn_more.png"
                alt="Space Explorer Book and 3D Glasses"
                className="w-full max-w-md sm:max-w-lg lg:max-w-none max-h-[280px] sm:max-h-[380px] lg:max-h-[520px] h-auto object-contain rounded-xl sm:rounded-2xl"
              />
            </FadeUp>
          </div>
        </div>
        <div className="absolute bottom-0 left-5 right-5 sm:left-8 sm:right-8 lg:left-16 lg:right-16 h-px" style={{ background: T.border }} />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          02 · MORE THAN A BOOK
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="more" style={{ background: T.bgAlt }} className={sectionY}>
        <div className={shell}>
          <FadeUp>
            <h2
              className="font-black leading-[1.05] tracking-tight mb-4 sm:mb-5"
              style={{ fontSize: 'clamp(1.85rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
            >
              A Real{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Adventure.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-sm sm:text-base mb-10 sm:mb-14 lg:mb-16 max-w-lg leading-relaxed" style={{ color: T.sub }}>
              We believe magic happens when kids can touch, turn, and dive into a story. We crafted this to be something they'll remember holding long after they grow up.
            </p>
          </FadeUp>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-xl md:rounded-none"
            style={{ border: `1px solid ${T.border}` }}
          >
            {[
              { label: 'Learn', desc: 'Real stories about the cosmos, written just for them.', img: '/Learn_learnmore.png' },
              { label: 'Play', desc: 'Put on the glasses and watch the pages pull you in.', img: '/Play_Learnmore.png' },
              { label: 'Discover', desc: 'Little secrets waiting to be found in every corner.', img: '/Discover_leanmore.png' },
            ].map((c, i) => (
              <FadeUp key={c.label} delay={i * 0.09}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex flex-col p-5 sm:p-6 h-full"
                  style={{
                    background: T.bg,
                  }}
                >
                  <div className="w-full aspect-[16/10] mb-5 sm:mb-6 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-black mb-2 sm:mb-3 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3vw, 2rem)' }}>
                    {c.label}
                  </div>
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
      <section id="difference" style={{ background: T.bg }} className={sectionY}>
        <div className={shell}>
          <FadeUp>
            <h2
              className="font-black leading-[1.05] tracking-tight mb-3 sm:mb-4"
              style={{ fontSize: 'clamp(1.85rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
            >
              It Actually{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Pops Out.
              </span>
            </h2>
            <p className="text-sm sm:text-base mb-8 sm:mb-12 max-w-md leading-relaxed" style={{ color: T.sub }}>
              Slip on the 3D glasses, and the flat page suddenly turns into a deep, breathing world.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {[
                { src: '/See the Picture.png', label: 'See the Picture', muted: true },
                { src: '/Step Into the Picture.png', label: 'Step Into the Picture', muted: false },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    className="w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-auto md:min-h-[320px] lg:min-h-[420px] rounded-xl sm:rounded-2xl border border-neutral-200/40 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url("${item.src}")` }}
                  />
                  <p
                    className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase mt-3 sm:mt-4"
                    style={{ color: item.muted ? T.sub : T.text }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          04 · PAGE GALLERY
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="gallery" style={{ background: T.bgAlt }} className={sectionY}>
        <div className={shell}>
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: T.sub }}>The Art</p>
            <h2
              className="font-black leading-[1.05] tracking-tight mb-3 sm:mb-4"
              style={{ fontSize: 'clamp(1.85rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
            >
              Every Page,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                A World Of Its Own.
              </span>
            </h2>
            <p className="text-sm max-w-md leading-relaxed mb-8 sm:mb-12" style={{ color: T.sub }}>
              A look at the stereoscopic scenes crafted to bring cosmic learning directly to life.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[
              { title: 'Saturn', img: '/saturn.png' },
              { title: 'Rocket Launch', img: '/rocket.png' },
              { title: 'Planet Earth', img: '/earth.png' },
              { title: 'Asteroid Field', img: '/astroid.png' },
              { title: 'The Moon', img: '/moon.png', size: 'w-[90%] h-[90%]', scale: 'md:group-hover:scale-[1.7]' },
              { title: 'Space Station', img: '/iss.png' },
            ].map((item, i) => {
              const imgSize = item.size || 'w-[68%] h-[68%]';
              const hoverScale = item.scale || 'md:group-hover:scale-[1.65]';
              return (
                <FadeUp key={item.title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="cursor-pointer group relative z-0 hover:z-10"
                  >
                    <div className="w-full aspect-[16/9] sm:aspect-[16/8.5] overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-sm border border-neutral-200/60 flex items-center justify-center relative transition-colors duration-500 md:group-hover:bg-black md:group-hover:border-black">
                      <div className="absolute inset-0 opacity-0 md:group-hover:opacity-70 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[15%] left-[15%]" />
                        <div className="absolute w-1 h-1 bg-white rounded-full top-[25%] right-[20%] opacity-80 animate-pulse" />
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full bottom-[20%] left-[25%]" />
                        <div className="absolute w-1 h-1 bg-white rounded-full bottom-[30%] right-[15%] opacity-90 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[55%] left-[10%]" />
                        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[70%] right-[35%]" />
                      </div>
                      <img
                        src={item.img}
                        alt={item.title}
                        className={`${imgSize} object-contain transition-transform duration-500 ${hoverScale} relative z-10`}
                      />
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase mt-3 sm:mt-4 px-1" style={{ color: T.text }}>
                      {item.title}
                    </p>
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
      <section id="inside" style={{ background: T.bg }} className={sectionY}>
        <div className={shell}>
          <FadeUp className="max-w-2xl mb-8 sm:mb-10 lg:mb-12">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 sm:mb-4" style={{ color: T.sub }}>
              Packaging & Details
            </p>
            <h2
              className="font-black leading-[1.05] tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.85rem, 6vw, 3.75rem)', letterSpacing: '-0.03em' }}
            >
              What's in the{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Box.
              </span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: T.sub }}>
              Everything arrives together—ready for the first unboxing, the first page turn, and the first “whoa.”
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Box — primary */}
            <FadeUp className="lg:col-span-7">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="h-full rounded-2xl sm:rounded-3xl border border-neutral-200/60 overflow-hidden flex flex-col"
                style={{ background: T.bgAlt }}
              >
                <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 sm:py-14 min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]">
                  <img
                    src="/Artboard.png"
                    alt="ODI Kids Space Explorer box"
                    className="w-full max-w-md lg:max-w-lg h-auto max-h-[300px] sm:max-h-[360px] lg:max-h-[400px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                  />
                </div>
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: T.sub }}>01</p>
                  <h3 className="font-black text-xl sm:text-2xl tracking-tight mb-2" style={{ color: T.text }}>The Box</h3>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: T.sub }}>
                    A beautiful box, because first impressions matter.
                  </p>
                </div>
              </motion.div>
            </FadeUp>

            {/* Book + Glasses stacked */}
            <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
              <FadeUp delay={0.06} className="flex-1">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="h-full rounded-2xl sm:rounded-3xl border border-neutral-200/60 overflow-hidden flex flex-col bg-white"
                >
                  <div className="flex-1 flex items-center justify-center px-5 py-8 min-h-[200px] sm:min-h-[220px]" style={{ background: '#FAFAFA' }}>
                    <img
                      src="/product-image/5.jpg"
                      alt="Space Explorer 3D book"
                      className="w-full max-w-xs h-auto max-h-[170px] sm:max-h-[190px] object-contain"
                    />
                  </div>
                  <div className="px-5 sm:px-6 py-5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5" style={{ color: T.sub }}>02</p>
                    <h3 className="font-bold text-base sm:text-lg tracking-tight mb-1" style={{ color: T.text }}>The Book</h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: T.sub }}>
                      24 pages. Hardcover. Built to survive bedtime.
                    </p>
                  </div>
                </motion.div>
              </FadeUp>

              <FadeUp delay={0.1} className="flex-1">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="h-full rounded-2xl sm:rounded-3xl border border-neutral-200/60 overflow-hidden flex flex-col bg-white"
                >
                  <div
                    className="flex-1 flex items-center justify-center px-5 py-8 min-h-[200px] sm:min-h-[220px]"
                    style={{ background: '#F3F3F5' }}
                  >
                    <img
                      src="/product-image/2.png"
                      alt="3D glasses"
                      className="w-full max-w-xs h-auto max-h-[150px] sm:max-h-[170px] object-contain rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="px-5 sm:px-6 py-5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5" style={{ color: T.sub }}>
                      03
                    </p>
                    <h3 className="font-bold text-base sm:text-lg tracking-tight mb-1" style={{ color: T.text }}>
                      The Glasses
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: T.sub }}>
                      Carefully made so the magic actually works.
                    </p>
                  </div>
                </motion.div>
              </FadeUp>
            </div>

            {/* Collector cards — wide */}
            <FadeUp delay={0.12} className="lg:col-span-12">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="rounded-2xl sm:rounded-3xl border border-neutral-200/60 overflow-hidden bg-white"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center px-5 sm:px-8 py-8 sm:py-10">
                  <div
                    className="md:col-span-8 flex items-center justify-center rounded-xl sm:rounded-2xl px-4 py-6"
                    style={{ background: '#F3F3F5' }}
                  >
                    <img
                      src="/product-image/3.png"
                      alt="Collector cards"
                      className="w-full max-w-3xl h-auto max-h-[160px] sm:max-h-[200px] lg:max-h-[220px] object-contain"
                    />
                  </div>
                  <div className="md:col-span-4 md:pl-2">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: T.sub }}>
                      04
                    </p>
                    <h3 className="font-black text-xl sm:text-2xl tracking-tight mb-2" style={{ color: T.text }}>
                      Collector Cards
                    </h3>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: T.sub }}>
                      12 planet cards they'll want to trade, collect, and keep.
                    </p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          06 · DESIGNED FOR CURIOUS MINDS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="curious" style={{ background: T.bgAlt }} className="py-12 sm:py-16 lg:py-20">
        <div className={shell}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14 items-center">
            <FadeUp className="w-full">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-200/50 shadow-sm bg-neutral-950">
                <img
                  src="/Made for the Kids.png"
                  alt="Child exploring a stereo 3D book with rockets, planets, and dinosaurs"
                  className="w-full h-auto max-h-[280px] sm:max-h-[340px] lg:max-h-[380px] object-cover object-center block"
                />
              </div>
            </FadeUp>

            <FadeUp delay={0.1} className="w-full">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: T.sub }}>
                Big Questions
              </p>
              <h2
                className="font-black leading-[1.1] tracking-tight mb-3"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.35rem)', letterSpacing: '-0.03em' }}
              >
                Made for the Kids Asking{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  "Why?"
                </span>
              </h2>
              <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: T.sub }}>
                We don't want kids just memorizing facts. We want them to get lost in the details and ask big questions.
              </p>

              <ul className="space-y-0 border-t" style={{ borderColor: T.border }}>
                {[
                  'Seeing things for themselves',
                  'Sparking big ideas',
                  'Noticing the little things',
                  'Falling in love with science',
                  'Telling their own stories',
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-3 py-2.5 border-b text-sm font-medium"
                    style={{ borderColor: T.border, color: T.text }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: T.text }} />
                    {feat}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          08 · WATCH IT COME ALIVE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="video" style={{ background: T.bg }} className={sectionY}>
        <div className={shell}>
          <FadeUp>
            <h2
              className="font-black leading-[1.05] tracking-tight mb-8 sm:mb-10 lg:mb-12"
              style={{ fontSize: 'clamp(1.85rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
            >
              See How It{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Feels.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/50 shadow-md bg-black">
              <video
                src="/ODI_Website_Hero Section_v001.mp4"
                controls
                className="w-full h-full object-contain"
                playsInline
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          09 · BUY NOW
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="buy" style={{ background: T.bgAlt }} className={`${sectionY} relative overflow-hidden`}>
        <Shard size={48} className="absolute top-16 right-[8%] opacity-40 hidden lg:block" />
        <Shard size={28} className="absolute bottom-24 left-[6%] opacity-25 hidden lg:block" />

        <div className={`${shell} grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-stretch`}>
          <FadeUp className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 border border-neutral-200/30 shadow-sm">
              <img
                src="/product-image/4.png"
                alt="ODI Kids Space Explorer kit — book, collector cards, and 3D glasses"
                className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 md:p-6"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-6 w-full">
            <div className="flex flex-col justify-between h-full gap-6 lg:gap-0 lg:aspect-[4/3]">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-3 sm:mb-4" style={{ color: T.sub }}>
                  ODI Kids · Space Explorer
                </p>
                <h2
                  className="font-black leading-[1.05] tracking-tight mb-3 sm:mb-4"
                  style={{ fontSize: 'clamp(2rem, 6vw, 3.75rem)', letterSpacing: '-0.03em' }}
                >
                  Ready when{' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    they are.
                  </span>
                </h2>
                <p className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: T.sub }}>
                  One complete kit: hardcover stereo 3D book, glasses, collector cards, and a box built for the first unboxing.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['The Book', '3D Glasses', 'Collector Cards', 'The Box'].map((item) => (
                  <span
                    key={item}
                    className="text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full border"
                    style={{ color: T.text, borderColor: T.border, background: T.bg }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div>
                <div className="mb-5 sm:mb-6 flex items-baseline gap-3 flex-wrap">
                  <span className="font-black tracking-tight" style={{ fontSize: 'clamp(1.85rem, 5vw, 2.5rem)' }}>
                    ₹1,399
                  </span>
                  <span className="text-sm font-medium" style={{ color: T.sub }}>
                    Ages 6–99
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => navigate('/checkout?product=space-explorer')}
                    className="w-full sm:flex-1 py-3.5 sm:py-4 px-7 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5"
                    style={{ background: T.text, color: T.bg }}
                  >
                    Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className="w-full sm:flex-1 py-3.5 sm:py-4 px-7 text-sm font-semibold tracking-wide border transition-transform hover:-translate-y-0.5"
                    style={{ background: 'transparent', color: T.text, borderColor: T.border }}
                  >
                    View Products
                  </button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  );
};

export default LearnMorePage;
