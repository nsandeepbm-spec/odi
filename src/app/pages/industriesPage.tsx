import { motion } from 'motion/react';
import { 
  Film, 
  Tv, 
  Users, 
  Sparkles, 
  Music, 
  FileText, 
  ArrowRight
} from 'lucide-react';
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

const industries = [
  {
    icon: Tv,
    image: '/OTT Platforms.png',
    title: 'OTT PLATFORMS',
    headline: 'Bringing Streaming Into Stereoscopic 3D',
    description: 'We convert films, series, and originals into premium stereoscopic 3D, giving audiences a richer viewing experience while preserving the original creative vision.',
    tags: ['Series & Originals', 'Content Library Conversion', 'Premium Spatial Releases'],
  },
  {
    icon: Film,
    image: '/Film Studios.png',
    title: 'FILM STUDIOS',
    headline: 'Cinema, Reimagined in 3D',
    description: 'From new releases to archive titles, we create natural stereoscopic 3D conversions that enhance storytelling without compromising the director\'s vision.',
    tags: ['Feature Films', 'Theatrical Releases', 'Library Restoration'],
  },
  {
    icon: Sparkles,
    image: '/Advertising Agencies.png',
    title: 'ADVERTISING AGENCIES',
    headline: 'Campaigns With Real Presence',
    description: 'We transform commercials and brand films into stereoscopic 3D experiences that capture attention and create stronger audience engagement.',
    tags: ['TV Commercials', 'Brand Films', 'Product Launches'],
  },
  {
    icon: Users,
    image: '/Creators & Influencers.png',
    title: 'CREATORS & INFLUENCERS',
    headline: 'Content That Feels Closer',
    description: 'Turn everyday videos into immersive stereoscopic experiences for modern spatial platforms, helping your audience connect in a whole new way.',
    tags: ['Instagram Reels', 'YouTube Shorts', 'TikTok Content'],
  },
  {
    icon: Music,
    image: '/Music Labels.png',
    title: 'MUSIC LABELS',
    headline: 'Feel Every Performance',
    description: 'From music videos to live concerts, we create stereoscopic 3D experiences that bring fans closer to every performance.',
    tags: ['Music Videos', 'Concert Films', 'Visual Albums'],
  }
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-28 md:pt-36 pb-24 selection:bg-indigo-100 font-sans">
      
      {/* ────────────────────────────────────────────────────────────────────────
          HERO BANNER
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden border border-neutral-100 shadow-2xl group"
        >
          {/* Background Image */}
          <img 
            src="/industries_hero.png"
            alt="Cinematic Industry Header"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          
          {/* Professional Overlay Gradients */}
          <div className="absolute inset-0 bg-neutral-900/70 transition-opacity duration-700"/>

          {/* Content inside the Banner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-white/30 w-12"></div>
                <span className="text-white font-bold tracking-widest text-[11px] uppercase">Every Story Deserves a New Dimension</span>
                <div className="h-px bg-white/30 w-12"></div>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-md">
                INDUSTRIES WE <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">SERVE</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                We partner with filmmakers, streaming platforms, agencies, creators, and brands to transform 2D content into natural stereoscopic 3D experiences—crafted for cinema, spatial devices, and the future of immersive storytelling.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          WHY SPATIAL TECH? (VALUE PROP)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-32 border-y border-neutral-100 mb-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Why Depth Matters</h2>
          <p className="text-xl md:text-2xl text-neutral-500 font-medium leading-relaxed max-w-4xl mx-auto mb-16">
            When a story is told in three dimensions, it stops being something you just watch and becomes something you feel. A wildlife scene feels grander. A dramatic moment feels closer. Depth doesn't just change the picture—it changes how people experience the story you're trying to tell.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          INDUSTRY SECTIONS (ALTERNATING BLOCKS)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 space-y-40 mb-40">
        {industries.map((industry, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={industry.title} className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
              
              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2"
              >
                <div className="rounded-[2.5rem] p-4 bg-neutral-50 border border-neutral-100 shadow-xl">
                  {industry.image ? (
                    <img src={industry.image} alt={industry.title} className="w-full h-[450px] object-cover rounded-3xl" />
                  ) : (
                    <ImagePlaceholder height={450} label={`${industry.title} Mockup`} />
                  )}
                </div>
              </motion.div>

              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full lg:w-1/2 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-indigo-500 font-black tracking-widest uppercase text-sm">{industry.title}</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-neutral-900 leading-tight">
                  {industry.headline}
                </h3>
                
                <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed mb-10">
                  {industry.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {industry.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-4 py-2 text-xs uppercase tracking-widest font-black text-neutral-600 bg-neutral-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <Link 
                    to="/contact"
                    className="inline-flex px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-black tracking-widest uppercase text-xs transition-all shadow-xl hover:-translate-y-0.5 items-center gap-2"
                  >
                    Partner With Us <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </motion.div>

            </div>
          );
        })}
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          FINAL CTA
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900 text-white py-32 border-y border-neutral-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">
              Let's Build Something Real.
            </h2>
            <p className="text-xl text-neutral-400 font-medium leading-relaxed mb-12">
              Every project is different, and we treat each one like a blank canvas. Let's talk about how we can bring true depth to your next idea.
            </p>
            <Link to="/contact" className="inline-flex px-10 py-5 bg-white text-neutral-900 hover:bg-neutral-200 rounded-full font-black tracking-widest uppercase text-sm transition-all shadow-xl hover:-translate-y-0.5 items-center gap-3">
              Start Your Project <ArrowRight className="w-4 h-4"/>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}