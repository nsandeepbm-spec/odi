import { useState, type ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowLeftRight, ArrowRight, BookOpen, Film } from 'lucide-react';
import { Link } from 'react-router';
import { PageCTA } from '../components/PageCTA';

const ease = [0.25, 0.1, 0.25, 1] as const;
const view = { once: true, margin: '-80px' as const };
const shell = 'mx-auto w-full max-w-screen-xl px-6 md:px-12 lg:px-16';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
};

const offerings = [
  {
    n: '01',
    icon: Film,
    eyebrow: 'Stereo Conversion',
    title: '2D pictures, rebuilt with natural depth.',
    description:
      'We convert features, series, and campaigns into stereoscopic 3D — accurate spatial structure, cleanup, and masters that hold up in a theatre or on a spatial display.',
    points: ['Feature films', 'OTT libraries', 'Brand films'],
    image: '/3d conversion hero.png',
    imageAlt: 'Stereo conversion — depth breaking out of the frame',
    href: '/services/3d-movie-conversion',
    cta: 'Explore conversion',
    contain: false,
  },
  {
    n: '02',
    icon: BookOpen,
    eyebrow: 'ODI Kids',
    title: 'A 3D book you can hold, not a screen.',
    description:
      'Space Explorer is a stereoscopic learning kit: thick pages, collectible cards, and glasses. Kids step into the story without an app, a battery, or a tablet.',
    points: ['Space Explorer', '3D glasses included', 'More volumes coming'],
    image: '/product-image/5.jpg',
    imageAlt: 'ODI Kids Space Explorer 3D book',
    href: '/services/3d-books',
    cta: 'Explore 3D books',
    contain: true,
  },
];

const steps = [
  { n: '01', title: 'Share the brief', body: 'Footage or a title, the format, the deadline, and where it needs to live — cinema, stream, campaign, or print.' },
  { n: '02', title: 'Design the depth', body: 'We plan spatial structure shot by shot, or page by page, so conversion feels natural — never forced on the original picture.' },
  { n: '03', title: 'Craft & deliver', body: 'Conversion, cleanup, and masters. Or a finished 3D book kit, packed and ready for home and classroom.' },
];

function Chapter({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="text-[11px] font-bold tabular-nums tracking-[0.22em] text-neutral-400">{n}</span>
      <span className="h-px w-10 bg-neutral-300" />
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-400">{label}</span>
    </div>
  );
}

function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-black tracking-tight text-neutral-900 ${className}`}
      style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3rem)', letterSpacing: '-0.035em', lineHeight: 1.12 }}
    >
      {children}
    </h2>
  );
}

export default function AboutPage() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-indigo-100 overflow-x-hidden">

      {/* ── 00 HERO ── */}
      <section className="relative min-h-svh md:h-svh flex flex-col bg-[#F7F7F5] overflow-x-hidden md:overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 70% at 78% 42%, rgba(99,102,241,0.10) 0%, transparent 62%), radial-gradient(ellipse 40% 50% at 8% 85%, rgba(6,182,212,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex-1 grid md:grid-cols-12 items-center min-h-0 pt-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="md:col-span-5 flex flex-col justify-center px-6 md:pl-10 lg:pl-16 xl:pl-20 md:pr-4 py-6 text-center md:text-left items-center md:items-start"
          >
            <motion.h1
              variants={fadeUp}
              className="mb-5 font-black tracking-tight text-neutral-900"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 5.25rem)', letterSpacing: '-0.045em', lineHeight: 1.02 }}
            >
              Stereo craft for
              <br />
              screens and{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                pages.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[15px] md:text-lg text-neutral-500 leading-relaxed mb-7 max-w-[36ch] font-medium"
            >
              Since 2011 we’ve converted pictures into natural stereoscopic 3D — and built ODI Kids books that let children step into a story without a screen.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-transform hover:-translate-y-0.5 shadow-xl shadow-neutral-900/15 w-full sm:w-auto"
              >
                Start a project <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#what-we-do"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-neutral-300/80 bg-white/80 text-neutral-900 font-semibold text-sm hover:border-neutral-900 hover:bg-white transition-colors w-full sm:w-auto"
              >
                What we do
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.12, ease }}
            className="md:col-span-7 relative h-full min-h-[42vh] md:min-h-0 flex items-center justify-center md:justify-end px-4 md:pr-6 lg:pr-10"
          >
            <img
              src="/about-image/hero-about.png"
              alt="ODI Studio — from a flat frame to spatial depth"
              className="w-full h-full max-h-full object-contain object-center md:object-right drop-shadow-[0_32px_80px_rgba(15,23,42,0.12)]"
            />
          </motion.div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative shrink-0 border-t border-neutral-200/80 bg-white/55 backdrop-blur-sm"
        >
          <div className={`${shell} py-4 md:py-5 grid grid-cols-3 divide-x divide-neutral-200`}>
            {[
              ['14+', 'Years in stereo'],
              ['Cinema', 'Features & OTT'],
              ['ODI Kids', '3D learning books'],
            ].map(([value, label]) => (
              <motion.div key={label} variants={fadeUp} className="px-4 first:pl-0 last:pr-0 md:px-8 first:md:pl-0 last:md:pr-0">
                <div className="text-lg md:text-2xl font-black text-neutral-900 tracking-tight">{value}</div>
                <div className="text-[10px] text-neutral-500 font-bold tracking-[0.16em] uppercase mt-0.5">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 01 WHY ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className={shell}>
          <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={view}
              className="md:col-span-6"
            >
              <div className="overflow-hidden rounded-[2rem] bg-[#F7F7F5] border border-[#E8E8E8]">
                <img
                  src="/about-image/hero 2.png"
                  alt="ODI Studio mission — spatial storytelling"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={view}
              className="md:col-span-6"
            >
              <motion.div variants={fadeUp}>
                <Chapter n="01" label="Why we exist" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Heading className="mb-6">
                  The world isn’t flat.
                  <br />
                  Content shouldn’t be either.
                </Heading>
              </motion.div>
              <motion.div variants={fadeUp} className="space-y-4 text-neutral-500 text-lg font-medium leading-relaxed">
                <p>
                  ODI Studio is a stereoscopic lab. We restore the dimension that a flat screen takes out of a picture — for cinema, streaming, advertising, and print.
                </p>
                <p>
                  Fourteen years in high-end conversion taught us the same rule we use on ODI Kids books: depth is added, never imposed. The story still leads.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 02 WHAT WE DO ── */}
      <section id="what-we-do" className="scroll-mt-28 py-24 md:py-32 bg-[#F7F7F5] border-y border-[#E8E8E8]">
        <div className={shell}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={view}
            className="max-w-2xl mb-16 md:mb-20"
          >
            <motion.div variants={fadeUp}>
              <Chapter n="02" label="What we do" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Heading>Two practices. One standard of depth.</Heading>
            </motion.div>
          </motion.div>

          <div className="space-y-20 md:space-y-28">
            {offerings.map((service, index) => {
              const reverse = index % 2 === 1;
              const Icon = service.icon;

              return (
                <div
                  key={service.href}
                  className={`relative flex flex-col gap-10 md:flex-row md:items-center ${reverse ? 'md:flex-row-reverse' : ''}`}
                >
                  <span
                    className="pointer-events-none absolute -top-8 select-none font-black text-neutral-200/80 leading-none hidden md:block"
                    style={{
                      fontSize: 'clamp(5rem, 12vw, 9rem)',
                      letterSpacing: '-0.06em',
                      right: reverse ? 'auto' : 0,
                      left: reverse ? 0 : 'auto',
                    }}
                    aria-hidden="true"
                  >
                    {service.n}
                  </span>

                  <motion.div
                    className="relative z-10 w-full md:w-[56%] shrink-0"
                    variants={reverse ? fadeRight : fadeLeft}
                    initial="hidden"
                    whileInView="show"
                    viewport={view}
                  >
                    <div className={`overflow-hidden rounded-[2rem] border border-[#E8E8E8] ${service.contain ? 'bg-white' : 'bg-white'}`}>
                      <img
                        src={service.image}
                        alt={service.imageAlt}
                        className={`w-full ${service.contain ? 'max-h-[420px] object-contain p-8' : 'h-auto object-contain'}`}
                        loading="lazy"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className={`relative z-10 w-full md:w-[44%] flex flex-col ${reverse ? 'md:pr-6' : 'md:pl-6'}`}
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={view}
                  >
                    <motion.div variants={fadeUp} className="mb-5 flex items-center gap-2.5 text-neutral-400">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                      <span className="h-px w-8 bg-neutral-300" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{service.eyebrow}</span>
                    </motion.div>
                    <motion.h3
                      variants={fadeUp}
                      className="mb-5 font-bold tracking-tight text-neutral-900"
                      style={{ fontSize: 'clamp(1.55rem, 2.6vw, 2.25rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.p variants={fadeUp} className="mb-7 text-base font-medium leading-relaxed text-neutral-500">
                      {service.description}
                    </motion.p>
                    <motion.ul variants={fadeUp} className="mb-8 flex flex-wrap gap-2">
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#E8E8E8] text-[11px] font-bold uppercase tracking-wider text-neutral-600"
                        >
                          {point}
                        </li>
                      ))}
                    </motion.ul>
                    <motion.div variants={fadeUp}>
                      <Link
                        to={service.href}
                        className="group inline-flex items-center gap-2 self-start text-sm font-bold text-neutral-900 hover:text-indigo-600 transition-colors"
                      >
                        {service.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 03 CRAFT ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className={shell}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={view}
              className="max-w-xl"
            >
              <motion.div variants={fadeUp}>
                <Chapter n="03" label="The craft" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Heading>One frame. RGB and a depth map.</Heading>
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={view}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="text-neutral-400 font-bold text-[10px] tracking-[0.2em] uppercase pb-1"
            >
              Drag to compare
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ duration: 0.75, ease }}
            className="relative w-full overflow-hidden select-none rounded-[2rem] bg-neutral-950"
            style={{ height: 'min(56vh, 480px)' }}
          >
            <div className="absolute inset-0">
              <img src="/Rgb.webp" alt="Original RGB frame" className="w-full h-full object-contain" />
              <span
                className="absolute top-5 right-6 text-[10px] font-bold uppercase tracking-widest text-white/80 z-10"
                style={{ opacity: sliderPos > 90 ? 0 : 1 }}
              >
                RGB
              </span>
            </div>
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src="/Depthmap.jpg" alt="Depth map" className="w-full h-full object-contain" />
              <span
                className="absolute top-5 left-6 text-[10px] font-bold uppercase tracking-widest text-indigo-200 z-10"
                style={{ opacity: sliderPos < 10 ? 0 : 1 }}
              >
                Depth map
              </span>
            </div>
            <div className="absolute inset-y-0 w-px bg-white/70" style={{ left: `${sliderPos}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg pointer-events-none z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <ArrowLeftRight className="w-4 h-4 text-neutral-800" />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Compare RGB and depth map"
            />
          </motion.div>
        </div>
      </section>

      {/* ── 04 PROCESS ── */}
      <section className="py-24 md:py-32 bg-[#F7F7F5] border-t border-[#E8E8E8]">
        <div className={shell}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={view}
            className="max-w-2xl mb-16"
          >
            <motion.div variants={fadeUp}>
              <Chapter n="04" label="How we work" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <Heading>A clear path from brief to master.</Heading>
            </motion.div>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-10 md:gap-12">
            <div className="pointer-events-none absolute top-[1.35rem] left-[12%] right-[12%] hidden md:block h-px bg-neutral-200" />
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={view}
                transition={{ duration: 0.55, delay: i * 0.12, ease }}
                className="relative"
              >
                <span className="relative z-10 mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E8E8E8] text-sm font-black tabular-nums text-neutral-900">
                  {step.n}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        heading="Ready to work with us?"
        subtext="A feature, a library, a campaign, or a classroom kit — tell us the format and the deadline."
        showServices={true}
        showOrder={false}
        showContact={true}
      />
    </div>
  );
}
