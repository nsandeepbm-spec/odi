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
  Users,
} from 'lucide-react';
import { Link } from 'react-router';

function ImagePlaceholder({ height = 400, label = 'Image Placeholder', className = '' }: { height?: number; label?: string, className?: string }) {
  return (
    <div
      className={`w-full flex items-center justify-center rounded-2xl bg-neutral-100/50 border border-neutral-200 overflow-hidden relative group ${className}`}
      style={{ height }}
    >
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
           <Eye className="w-4 h-4 text-neutral-400" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500">{label}</span>
      </div>
    </div>
  );
}

export default function Service3DBook() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-200 font-sans">

      {/* ────────────────────────────────────────────────────────────────────────
          HERO SECTION
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 min-h-screen flex items-center pt-32 pb-24 border-b border-neutral-200">
        <div className="max-w-screen-xl w-full mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col text-center lg:text-left items-center lg:items-start"
            >

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight text-neutral-900 leading-[1.05]">
                Step inside the story.
              </h1>

              <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0 font-medium">
                A new kind of reading experience. Our stereoscopic 3D books reveal real-world depth with every turn of the page.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                <Link to="/products" className="px-10 py-4 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-semibold text-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl shadow-neutral-900/20 hover:scale-105 transform duration-200">
                  Order Now <ArrowRight className="w-5 h-5"/>
                </Link>
                <button onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-transparent text-neutral-900 border-2 border-neutral-200 hover:border-neutral-900 rounded-full font-semibold text-lg transition-colors w-full sm:w-auto hover:bg-neutral-50 cursor-pointer">
                  Watch Demo
                </button>
              </div>

              <div className="mt-16 flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-neutral-50 flex items-center justify-center shadow-sm"><Users className="w-4 h-4 text-neutral-500" /></div>
                  <div className="w-10 h-10 rounded-full bg-neutral-300 border-2 border-neutral-50 flex items-center justify-center shadow-sm"><Users className="w-4 h-4 text-neutral-600" /></div>
                  <div className="w-10 h-10 rounded-full bg-neutral-400 border-2 border-neutral-50 flex items-center justify-center shadow-sm"><Users className="w-4 h-4 text-neutral-700" /></div>
                </div>
                <div className="text-base text-neutral-600">
                  <span className="font-bold text-neutral-900">10,000+</span> parents and educators
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="w-full flex items-center justify-center lg:justify-end"
            >
              <img
                src="/product-image/5.jpg"
                alt="ODI Kids Space Immersive Stereo 3D Experience book"
                className="w-full max-w-[500px] xl:max-w-[600px] max-h-[600px] object-contain mix-blend-multiply"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          BUILT AROUND CURIOSITY
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b border-neutral-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="order-2 lg:order-1"
            >
              <img src="/product-image/Books-You-Don't-Just-Read.png" alt="Curiosity and Discovery" className="w-full h-auto max-h-[600px] object-contain drop-shadow-xl rounded-2xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight text-neutral-900">
                Built around curiosity.
              </h2>
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                <p>
                  Children remember more when they discover things for themselves.
                </p>
                <p>
                  Every page is carefully designed to encourage observation, exploration, and questions rather than simply presenting information on a flat surface.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          WHAT'S INSIDE
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            className="text-center mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-neutral-900">What's Inside</h2>
            <p className="text-lg text-neutral-600">A complete, premium learning kit designed for maximum engagement and durability.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {[
              { title: '24-page stereoscopic book', desc: 'Premium thick-stock pages', icon: BookOpen },
              { title: 'Collectible 3D cards', desc: 'Five interactive learning cards', icon: Map },
              { title: 'Anaglyph glasses', desc: 'Comfortable red-cyan viewer', icon: Glasses },
              { title: 'Visual learning', desc: 'Spatially accurate 3D scenes', icon: Eye },
              { title: 'Screen-free activity', desc: 'Healthy, focused exploration', icon: Sparkles },
              { title: 'Rigid storage box', desc: 'Keeps components safe', icon: Box },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors group flex flex-col gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 tracking-tight mb-1">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img src="/product-image/4.png" alt="What's Inside Kit Presentation" className="w-full max-h-[600px] object-contain rounded-3xl border border-neutral-200/60 bg-white p-4 shadow-sm" />
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          HOW IT WORKS
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900 text-white py-24 md:py-32">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="order-2 lg:order-1"
            >
              <div className="p-2 rounded-2xl bg-neutral-800 border border-neutral-700">
                 <img src="/product-image/how-it-work.png" alt="How It Works Demonstration" className="w-full h-auto object-cover rounded-xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-12 tracking-tight text-white">How It Works</h2>

              <div className="space-y-8">
                {[
                  { title: 'Open the book', desc: 'Lay it flat on any well-lit surface.' },
                  { title: 'Wear the glasses', desc: 'Put on the included 3D anaglyph glasses.' },
                  { title: 'See the depth', desc: 'Watch every scene expand into layered, 3D space.' },
                  { title: 'Explore details', desc: 'Examine the environment from a new perspective.' },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-6 group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 font-semibold text-neutral-300">
                        {i + 1}
                      </div>
                      {i !== 3 && <div className="w-px h-full bg-neutral-800"></div>}
                    </div>
                    <div className="pt-2 pb-6">
                      <h3 className="text-lg font-semibold tracking-tight mb-1 text-white">{step.title}</h3>
                      <p className="text-neutral-400 text-base">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          MORE ADVENTURES
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b border-neutral-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            className="text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-neutral-900">More Adventures</h2>
            <p className="text-lg text-neutral-600">Explore the complete collection of stereoscopic experiences.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-3xl mx-auto">
            {[
              'Ocean Explorer', 'Dinosaur Explorer', 'Human Body',
              'Wildlife', 'Ancient Egypt', 'Deep Space',
            ].map((adventure, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
             >
                <span className="inline-block px-5 py-2.5 rounded-full bg-neutral-50 border border-neutral-200 font-medium text-sm text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-default">
                  {adventure}
                </span>
             </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full flex justify-center"
          >
            <img src="/product-image/More-Adventures.png" alt="More Adventures Preview" className="w-full max-w-[900px] h-auto object-contain drop-shadow-2xl rounded-2xl" />
          </motion.div>
        </div>
      </section>


      {/* ────────────────────────────────────────────────────────────────────────
          FINAL CTA
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-40 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tighter text-neutral-900 leading-[1.05]">
              Learning should feel <br className="hidden md:block" /> like discovery.
            </h2>
            <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed mb-16 max-w-3xl mx-auto font-medium">
              We create books that turn curiosity into something children can see, explore, and vividly remember long after the pages are closed.
            </p>
          </motion.div>

          <motion.div
            id="demo-video"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full aspect-video rounded-[2rem] overflow-hidden border border-neutral-200/50 shadow-2xl bg-black mb-16 ring-1 ring-black/5 scroll-mt-24"
          >
            <video
              src="/ODI_SS1.mp4"
              controls
              className="w-full h-full object-contain"
              playsInline
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/contact" className="inline-flex px-12 py-5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-neutral-900/20 items-center justify-center gap-3">
              Get in Touch <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
