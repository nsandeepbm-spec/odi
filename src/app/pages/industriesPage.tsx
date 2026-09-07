import { motion } from 'motion/react';
import {
  Film,
  Tv,
  Users,
  Sparkles,
  Music,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { PageCTA } from '../components/PageCTA';

const ease = [0.25, 0.1, 0.25, 1] as const;

interface Industry {
  icon: LucideIcon;
  image: string;
  title: string;
  headline: string;
  description: string;
  tags: string[];
}

const industries: Industry[] = [
  {
    icon: Tv,
    image: '/OTT Platforms.png',
    title: 'OTT Platforms',
    headline: 'Bringing streaming into stereoscopic 3D',
    description:
      'We convert films, series, and originals into premium stereoscopic 3D, giving audiences a richer viewing experience while preserving the original creative vision.',
    tags: ['Series & Originals', 'Content Library Conversion', 'Premium Spatial Releases'],
  },
  {
    icon: Film,
    image: '/Film Studios.png',
    title: 'Film Studios',
    headline: 'Cinema, reimagined in 3D',
    description:
      "From new releases to archive titles, we create natural stereoscopic 3D conversions that enhance storytelling without compromising the director's vision.",
    tags: ['Feature Films', 'Theatrical Releases', 'Library Restoration'],
  },
  {
    icon: Sparkles,
    image: '/Advertising Agencies.png',
    title: 'Advertising Agencies',
    headline: 'Campaigns with real presence',
    description:
      'We transform commercials and brand films into stereoscopic 3D experiences that capture attention and create stronger audience engagement.',
    tags: ['TV Commercials', 'Brand Films', 'Product Launches'],
  },
  {
    icon: Users,
    image: '/Creators & Influencers.png',
    title: 'Creators & Influencers',
    headline: 'Content that feels closer',
    description:
      'Turn everyday videos into immersive stereoscopic experiences for modern spatial platforms, helping your audience connect in a whole new way.',
    tags: ['Instagram Reels', 'YouTube Shorts', 'TikTok Content'],
  },
  {
    icon: Music,
    image: '/Music Labels.png',
    title: 'Music Labels',
    headline: 'Feel every performance',
    description:
      'From music videos to live concerts, we create stereoscopic 3D experiences that bring fans closer to every performance.',
    tags: ['Music Videos', 'Concert Films', 'Visual Albums'],
  },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-indigo-100">

      {/* ── HERO ── */}
      <section className="relative h-svh min-h-[560px] max-h-[920px] w-full overflow-hidden">
        <img
          src="/industries_hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Lightened vertical overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55" />
        {/* Subtle left & right side lights */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 0% 50%, rgba(99,102,241,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 100% at 100% 50%, rgba(6,182,212,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Light center vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.22)_100%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="max-w-4xl"
          >
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">
              Every story deserves a new dimension
            </p>
            <h1
              className="mb-6 font-black tracking-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              Industries we{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Serve
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-white/85 md:text-xl">
              We partner with filmmakers, streaming platforms, agencies, creators, and brands to
              transform 2D content into natural stereoscopic 3D — for cinema, spatial devices, and
              the future of immersive storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── EDITORIAL STATEMENT ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease }}
        >
          <motion.p
            className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            Why depth matters
          </motion.p>
          <h2
            className="mb-8 font-black tracking-tight text-neutral-900"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            When a story is told in three dimensions, it becomes something you feel.
          </h2>
          <p className="text-lg font-medium leading-relaxed text-neutral-500 md:text-xl">
            A wildlife scene feels grander. A dramatic moment feels closer. Depth doesn't just
            change the picture — it changes how people experience the story you're trying to tell.
          </p>
        </motion.div>
      </section>

      {/* ── INDUSTRIES LIST ── */}
      <div className="mx-auto max-w-screen-xl px-6 md:px-10 lg:px-16">
        {industries.map((industry, index) => {
          const reverse = index % 2 === 1;
          const Icon = industry.icon;
          const n = String(index + 1).padStart(2, '0');

          return (
            <section
              key={industry.title}
              className={`relative py-20 md:py-28 lg:py-36 ${index !== 0 ? 'border-t border-neutral-100' : ''}`}
            >
              {/* Ghost number — very subtle watermark */}
              <span
                className="pointer-events-none absolute select-none font-black text-neutral-100 leading-none"
                style={{
                  fontSize: 'clamp(6rem, 18vw, 14rem)',
                  letterSpacing: '-0.06em',
                  top: '0',
                  right: reverse ? 'auto' : '0',
                  left: reverse ? '0' : 'auto',
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {n}
              </span>

              <div
                className={`relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center ${
                  reverse ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image — 60% width on desktop */}
                <motion.div
                  className="w-full lg:w-[60%] shrink-0"
                  initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease }}
                >
                  <img
                    src={industry.image}
                    alt={industry.title}
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  />
                </motion.div>

                {/* Text — 40% width on desktop */}
                <motion.div
                  className={`w-full lg:w-[40%] flex flex-col ${reverse ? 'lg:pr-8' : 'lg:pl-8'}`}
                  initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.15, ease }}
                >
                  <div className="mb-5 flex items-center gap-2.5 text-neutral-400">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    <span className="h-px w-8 bg-neutral-300" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                      {industry.title}
                    </span>
                  </div>

                  <h3
                    className="mb-5 font-bold tracking-tight text-neutral-900"
                    style={{
                      fontSize: 'clamp(1.6rem, 2.8vw, 2.5rem)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                    }}
                  >
                    {industry.headline}
                  </h3>

                  <p className="mb-8 text-base font-medium leading-relaxed text-neutral-500 md:text-[1.05rem]">
                    {industry.description}
                  </p>

                  <div className="mb-10 flex flex-wrap gap-2">
                    {industry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-semibold text-neutral-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="group/link inline-flex w-fit items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-neutral-900 shadow-lg hover:shadow-xl"
                  >
                    Partner with us
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>


      {/* ── CTA ── */}
      <PageCTA
        heading="Let's build something real."
        subtext="Every project is different, and we treat each one like a blank canvas. Let's talk about how we can bring true depth to your next idea."
        showServices={true}
        showOrder={false}
        showContact={true}
      />

    </div>
  );
}
