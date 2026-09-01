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
      {/* Full-bleed cinematic hero — photography, not a card */}
      <section className="relative h-svh min-h-[560px] max-h-[920px] w-full overflow-hidden">
        <img
          src="/industries_hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/75" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]" />

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

      {/* Editorial statement — type only */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease }}
        >
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
            Why depth matters
          </p>
          <h2
            className="mb-8 font-black tracking-tight text-neutral-900"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            When a story is told in three dimensions, it becomes something you feel.
          </h2>
          <p className="text-lg font-medium leading-relaxed text-neutral-500 md:text-xl">
            A wildlife scene feels grander. A dramatic moment feels closer. Depth doesn’t just
            change the picture — it changes how people experience the story you’re trying to tell.
          </p>
        </motion.div>
      </section>

      {/* Industries — studio renders sit on the page, unframed and uncropped */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        {industries.map((industry, index) => {
          const reverse = index % 2 === 1;
          const Icon = industry.icon;
          const n = String(index + 1).padStart(2, '0');

          return (
            <section key={industry.title} className="py-16 md:py-24 lg:py-28">
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24 ${
                  reverse ? 'lg:[&>div:first-child]:order-2' : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease }}
                >
                  <img
                    src={industry.image}
                    alt={industry.title}
                    className="h-auto w-full object-contain"
                    loading="lazy"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: 0.08, ease }}
                  className="flex flex-col lg:py-8"
                >
                  <div className="mb-6 flex items-center gap-3 text-neutral-400">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em]">{n}</span>
                    <span className="h-px w-6 bg-neutral-300" />
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                      {industry.title}
                    </span>
                  </div>

                  <h3
                    className="mb-5 font-black tracking-tight text-neutral-900"
                    style={{
                      fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                    }}
                  >
                    {industry.headline}
                  </h3>

                  <p className="mb-8 max-w-lg text-base font-medium leading-relaxed text-neutral-500 md:text-lg">
                    {industry.description}
                  </p>

                  <p className="mb-10 text-[13px] font-medium tracking-wide text-neutral-400">
                    {industry.tags.join('  ·  ')}
                  </p>

                  <Link
                    to="/contact"
                    className="group/link inline-flex w-fit items-center gap-1.5 text-sm font-bold text-neutral-900 transition-colors hover:text-indigo-600"
                  >
                    Partner with us
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="bg-neutral-900 px-6 py-28 text-center text-white md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="mx-auto max-w-2xl"
        >
          <h2
            className="mb-6 font-black tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Let’s build something real.
          </h2>
          <p className="mb-10 text-lg font-medium leading-relaxed text-neutral-400">
            Every project is different, and we treat each one like a blank canvas. Let’s talk about
            how we can bring true depth to your next idea.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-neutral-900 transition-all hover:-translate-y-0.5 hover:bg-neutral-200"
          >
            Start your project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
