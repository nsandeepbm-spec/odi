import { motion } from 'motion/react';
import { 
  BookOpen, 
  Glasses, 
  Sparkles, 
  Eye, 
  Map, 
  Box, 
  Compass, 
  Globe2, 
  GraduationCap, 
  ArrowRight,
  Library,
  Users
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

export default function Service3DBook() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-24 md:pt-32 pb-24 selection:bg-indigo-100 font-sans">
    
      {/* ────────────────────────────────────────────────────────────────────────
          HERO SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">3D Books</span>
              <div className="h-px bg-indigo-500/30 w-12"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.05]">
              Books You Don't Just Read.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">You Experience Them.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed mb-10 max-w-lg">
              Designed for stereoscopic viewing, every page is created to reveal real depth through anaglyph glasses. Instead of looking at an illustration, readers step inside it.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="px-8 py-4 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-black tracking-widest uppercase text-xs transition-all shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                Order Now <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ImagePlaceholder height={500} label="Hero Book Image" />
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          BUILT AROUND CURIOSITY
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-32 border-y border-neutral-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <ImagePlaceholder height={500} label="Curiosity / Discovery Image" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Built Around Curiosity</h2>
              <div className="space-y-6 text-xl text-neutral-500 font-medium leading-relaxed">
                <p>
                  Children remember more when they discover things for themselves.
                </p>
                <p>
                  Every page is designed to encourage observation, exploration, and questions instead of simply presenting information.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          WHAT'S INSIDE
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-32 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">What's Inside</h2>
          <p className="text-xl text-neutral-500 font-medium">A complete premium learning kit.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            { title: '24-page stereoscopic book', icon: BookOpen },
            { title: 'Five collectible 3D learning cards', icon: Map },
            { title: 'Red–cyan anaglyph glasses', icon: Glasses },
            { title: 'Interactive visual learning', icon: Eye },
            { title: 'Screen-free activity', icon: Sparkles },
            { title: 'Premium rigid storage box', icon: Box },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-neutral-400 group-hover:text-indigo-500" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight leading-snug">{feature.title}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ImagePlaceholder height={500} label="What's Inside Kit Image" />
        </motion.div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          HOW IT WORKS
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900 text-white py-32 border-y border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <ImagePlaceholder height={600} label="How It Works Image" />
            </motion.div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">How It Works</h2>
              
              <div className="space-y-8">
                {[
                  'Open the book.',
                  'Wear the glasses.',
                  'Watch every scene expand into layered depth.',
                  'Explore every page from a new perspective.'
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center shrink-0 font-black text-lg text-indigo-400">
                      {i + 1}
                    </div>
                    <p className="text-xl md:text-2xl font-bold tracking-tight">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          MORE ADVENTURES
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-32 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">More Adventures</h2>
          <p className="text-xl text-neutral-500 font-medium">Explore the complete collection.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-20 max-w-4xl mx-auto">
          {[
            'Ocean Explorer', 'Dinosaur Explorer', 'Human Body', 
            'Wildlife', 'Ancient Egypt', 'Deep Ocean'
          ].map((adventure, i) => (
            <motion.span 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-4 rounded-full bg-neutral-50 border border-neutral-200 font-black tracking-widest uppercase text-sm hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-default shadow-sm hover:shadow-md"
            >
              {adventure}
            </motion.span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ImagePlaceholder height={400} label="Adventures Image 1" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <ImagePlaceholder height={400} label="Adventures Image 2" />
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          DESIGNED FOR
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 py-32 border-y border-neutral-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">Designed For</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { name: 'Schools', icon: GraduationCap },
              { name: 'Libraries', icon: Library },
              { name: 'Museums', icon: Compass },
              { name: 'Science Centres', icon: Globe2 },
              { name: 'Gift Stores', icon: Box },
              { name: 'Educational Publishers', icon: BookOpen },
              { name: 'Parents', icon: Users },
              { name: 'Learning Programs', icon: Sparkles }
            ].map((audience, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-4 p-6 bg-white border border-neutral-200 rounded-3xl shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <audience.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-neutral-900 tracking-tight">{audience.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ImagePlaceholder height={500} label="Designed For Audience Image" />
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          FINAL CTA
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight text-neutral-900">
              Learning Should Feel Like Discovery.
            </h2>
            <p className="text-xl text-neutral-500 font-medium leading-relaxed mb-12">
              We create books that turn curiosity into something children can see, explore, and remember.
            </p>
            <Link to="/contact" className="inline-flex px-10 py-5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-black tracking-widest uppercase text-sm transition-all shadow-xl hover:-translate-y-0.5 items-center gap-3">
              Get in Touch <ArrowRight className="w-4 h-4"/>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
