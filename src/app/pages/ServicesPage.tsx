import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Film,
  Headset,
  Layers,
  Megaphone,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import { PageCTA } from '../components/PageCTA';

const ease = [0.25, 0.1, 0.25, 1] as const;

interface FeaturedService {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  imageAlt: string;
  href: string;
  cta: string;
}

const featured: FeaturedService[] = [
  {
    icon: Film,
    eyebrow: 'Stereo Conversion',
    title: 'Bring every frame into real depth.',
    description:
      'We rebuild standard 2D footage as natural stereoscopic 3D — accurate depth, cinematic craft, and a result that feels closer without fighting the original picture.',
    points: ['Feature films', 'Series & originals', 'Archive titles'],
    image: '/3d conversion hero.png',
    imageAlt: 'Stereo conversion — spatial depth from 2D footage',
    href: '/services/3d-movie-conversion',
    cta: 'Explore conversion',
  },
  {
    icon: BookOpen,
    eyebrow: '3D Books',
    title: 'Learning that you can step inside.',
    description:
      'Premium stereoscopic books for kids: thick pages, collectible cards, and glasses that turn a story into a world they can explore — screen-free.',
    points: ['Space Explorer kit', 'Classroom & home', 'More volumes coming'],
    image: '/product-image/5.jpg',
    imageAlt: 'ODI Kids Space Explorer 3D book',
    href: '/services/3d-books',
    cta: 'Explore 3D books',
  },
];

const moreServices: {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}[] = [
  {
    icon: Clapperboard,
    title: '3D Short Films',
    description: 'Festival, streaming, and installation-ready shorts with spatial depth that serves the story.',
    image: '/Film Studios.png',
  },
  {
    icon: Smartphone,
    title: '3D Reels & Vertical',
    description: 'Short-form stereo for Reels, Shorts, and TikTok — built for phones, not cropped from cinema.',
    image: '/Creators & Influencers.png',
  },
  {
    icon: Megaphone,
    title: 'Immersive Advertising',
    description: 'Brand films and commercials with presence that holds attention on TV, digital, and launch films.',
    image: '/Advertising Agencies.png',
  },
  {
    icon: Layers,
    title: 'Depth Compositing',
    description: 'Stereo cleanup, refinement, and technical QA when you already have 3D and need it theatrical-ready.',
    image: '/What We Deliver.png',
  },
  {
    icon: Headset,
    title: 'VR / Vision Pro',
    description: 'Format, depth, and stereo prep so content feels native on Vision Pro, Quest, and spatial screens.',
    image: '/Imagine 01.png',
  },
];

const steps = [
  { n: '01', title: 'Share the brief', body: 'Footage, format, deadline, and where it needs to live — cinema, stream, phone, or print.' },
  { n: '02', title: 'Design the depth', body: 'We plan spatial structure shot by shot so conversion feels natural, not forced.' },
  { n: '03', title: 'Craft & deliver', body: 'Conversion, cleanup, and masters that hold up on the screen you actually ship to.' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-indigo-100 font-sans overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center border-b border-neutral-100 bg-neutral-50 overflow-hidden pt-28 pb-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 85% 40%, rgba(99,102,241,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(6,182,212,0.05) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-screen-xl w-full mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col text-center lg:text-left items-center lg:items-start"
            >
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-600">
                What we do
              </p>
              <h1
                className="mb-8 font-black tracking-tight text-neutral-900"
                style={{ fontSize: 'clamp(2.75rem, 7vw, 4.75rem)', letterSpacing: '-0.04em', lineHeight: 1.05 }}
              >
                Services built
                <br />
                around{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  real depth.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-10 max-w-lg font-medium">
                From feature-length stereo conversion to 3D learning books, we craft spatial experiences for cinema, streaming, campaigns, and the next generation of screens.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-transform hover:-translate-y-0.5 shadow-xl shadow-neutral-900/15 w-full sm:w-auto"
                >
                  Start a project <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#offerings"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-neutral-200 text-neutral-900 font-semibold text-sm hover:border-neutral-900 hover:bg-white transition-colors w-full sm:w-auto"
                >
                  View offerings
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="w-full flex items-center justify-center lg:justify-end"
            >
              <img
                src="/3d conversion hero.png"
                alt="ODI stereo conversion craft"
                className="w-full max-w-[560px] xl:max-w-[640px] max-h-[520px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
            Spatial media, end to end
          </p>
          <h2
            className="mb-8 font-black tracking-tight text-neutral-900"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            Two practices. One standard of depth.
          </h2>
          <p className="text-lg font-medium leading-relaxed text-neutral-500 md:text-xl">
            We convert pictures for the screen, and we print worlds for the page. Both are built so the depth feels natural — not a gimmick.
          </p>
        </motion.div>
      </section>

      {/* ── FEATURED SERVICES ── */}
      <div id="offerings" className="mx-auto max-w-screen-xl px-6 md:px-10 lg:px-16 scroll-mt-28">
        {featured.map((service, index) => {
          const reverse = index % 2 === 1;
          const Icon = service.icon;
          const n = String(index + 1).padStart(2, '0');

          return (
            <section
              key={service.href}
              className={`relative py-20 md:py-28 ${index !== 0 ? 'border-t border-neutral-100' : ''}`}
            >
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
                <motion.div
                  className="w-full lg:w-[58%] shrink-0"
                  initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, ease }}
                >
                  <div className="rounded-[2rem] overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className={`w-full ${
                        service.href.includes('3d-books')
                          ? 'max-h-[440px] object-contain mix-blend-multiply p-6'
                          : 'h-auto object-contain'
                      }`}
                      loading="lazy"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className={`w-full lg:w-[42%] flex flex-col ${reverse ? 'lg:pr-8' : 'lg:pl-8'}`}
                  initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.12, ease }}
                >
                  <div className="mb-5 flex items-center gap-2.5 text-neutral-400">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    <span className="h-px w-8 bg-neutral-300" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{service.eyebrow}</span>
                  </div>
                  <h3
                    className="mb-5 font-bold tracking-tight text-neutral-900"
                    style={{
                      fontSize: 'clamp(1.6rem, 2.8vw, 2.5rem)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                    }}
                  >
                    {service.title}
                  </h3>
                  <p className="mb-7 text-base font-medium leading-relaxed text-neutral-500 md:text-[1.05rem]">
                    {service.description}
                  </p>
                  <ul className="mb-8 flex flex-wrap gap-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-600"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={service.href}
                    className="group inline-flex items-center gap-2 self-start text-sm font-bold text-neutral-900 hover:text-indigo-600 transition-colors"
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── MORE CAPABILITIES ── */}
      <section className="bg-[#F7F7F5] border-y border-neutral-100 py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            className="max-w-2xl mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
              Also in the studio
            </p>
            <h2
              className="font-black tracking-tight text-neutral-900"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}
            >
              More ways to ship in stereo.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {moreServices.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease }}
                >
                  <Link
                    to="/contact"
                    className="group flex flex-col h-full rounded-[1.5rem] bg-white border border-neutral-200/80 overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                      <span className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-neutral-800" strokeWidth={1.75} />
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold tracking-tight text-neutral-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed mb-5 flex-1">{item.description}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900">
                        Enquire
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">How we work</p>
            <h2
              className="font-black tracking-tight text-neutral-900"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}
            >
              A clear path from brief to master.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="relative"
              >
                <span className="block text-4xl font-black tracking-tighter text-neutral-200 mb-4">{step.n}</span>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900 mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        heading="Have a project in mind?"
        subtext="Tell us the format, the deadline, and the screen. We'll tell you how we bring it into depth."
        showServices={false}
        showOrder={false}
      />
    </div>
  );
}
