import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Eye, Layers, Wand2, Send, ArrowLeftRight } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1] as const;

const GALLERY_ITEMS = [
  { title: 'Feature Films', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=85', span: 'col-span-2 row-span-2' },
  { title: 'Short Films', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=85', span: '' },
  { title: 'Music Videos', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=85', span: '' },
  { title: 'Commercials', img: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&q=85', span: '' },
  { title: 'Books', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=85', span: '' },
  { title: 'Product Visualization', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85', span: 'col-span-2' },
  { title: 'Automobiles', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700&q=85', span: '' },
  { title: 'Medical', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=85', span: '' },
  { title: 'Architecture', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=85', span: '' },
];

const IMAGINE_PANELS = [
  { text: 'Imagine a child opening a book.', sub: 'Stories feel alive when depth breathes through every page.', img: '/Imagine 01.png' },
  { text: 'Imagine a product impossible to ignore.', sub: 'Depth transforms what you sell into what people remember.', img: '/Imagine 02.png' },
  { text: 'Imagine your next film feeling more immersive.', sub: 'Every frame gains presence. Every scene gains weight.', img: '/Imagine 03.png' },
];

const CONSTELLATION_NODES = [
  { name: 'Publishing', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', desc: 'Immersive books that children never forget.' },
  { name: 'Cinema', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80', desc: 'Feature films with real cinematic presence.' },
  { name: 'Streaming & OTT', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80', desc: 'Premium OTT content that captivates audiences.' },
  { name: 'Commercials', img: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&q=80', desc: 'Advertising that stops people in their tracks.' },
  { name: 'Animation', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80', desc: 'Animated worlds with breathtaking depth.' },
  { name: 'Museums', img: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&q=80', desc: 'Exhibits that transport visitors into the experience.' },
  { name: 'Medical', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80', desc: 'Precision visualization that saves lives.' },
  { name: 'Automotive', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', desc: 'Vehicles showcased with spatial realism.' },
];

const STUDIO_WALL = [
  { img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80', label: 'Edge of Tomorrow', sub: 'Feature Film' },
  { img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80', label: 'Human Anatomy 3D', sub: 'Medical Visualization' },
  { img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', label: 'Jewel Series', sub: 'Luxury' },
  { img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80', label: 'Driven to Inspire', sub: 'Automotive Campaign' },
];

const CRAFT_STEPS = [
  { title: 'Curiosity', desc: 'Every project starts with curiosity. We study your content deeply.', icon: Compass },
  { title: 'Study', desc: 'We analyse every frame, every layer, every plane of depth.', icon: Eye },
  { title: 'Shape', desc: 'We craft the spatial structure that gives your content presence.', icon: Layers },
  { title: 'Refine', desc: 'We refine every detail until depth feels completely invisible.', icon: Wand2 },
  { title: 'Deliver', desc: 'We deliver something that feels natural. Craft people can feel.', icon: Send },
];

export function HomeFeatures() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeImagine, setActiveImagine] = useState(0);

  return (
    <div className="bg-white text-neutral-900 selection:bg-indigo-100">

      {/* ── Everything Can Have Depth ── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 border-b border-neutral-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            <motion.div
              className="lg:w-1/3 flex-shrink-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter mb-6">
                Everything<br />Can Have<br />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Depth.</span>
              </h2>
              <p className="text-neutral-500 text-lg leading-relaxed max-w-sm font-medium">
                From stories to products, from moments to ideas — we bring every vision closer to life.
              </p>
            </motion.div>

            {/* Bento-style grid — varied sizes */}
            <div className="lg:w-2/3 grid grid-cols-3 md:grid-cols-4 auto-rows-[180px] gap-4">
              {GALLERY_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  className={`group relative rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${item.span}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease }}
                >
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">{item.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Imagine… ── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 border-b border-neutral-100 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center">

            {/* Left: Interactive accordion */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <motion.p
                className="text-[10px] text-indigo-500 font-bold tracking-[0.25em] uppercase mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
              >
                Imagine ——
              </motion.p>
              {IMAGINE_PANELS.map((panel, i) => {
                const isActive = activeImagine === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease }}
                    className={`cursor-pointer border-l-4 pl-6 py-1 transition-all duration-400 ${isActive ? 'border-indigo-500' : 'border-neutral-200 hover:border-indigo-300'}`}
                    onMouseEnter={() => setActiveImagine(i)}
                    onClick={() => setActiveImagine(i)}
                  >
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight mb-3 transition-colors duration-400 ${isActive ? 'text-neutral-900' : 'text-neutral-300 hover:text-neutral-500'}`}>
                      {panel.text}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-neutral-500 text-base leading-relaxed font-medium mt-1">
                        {panel.sub}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: Responsive image display */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-neutral-100">
                {IMAGINE_PANELS.map((panel, i) => (
                  <img
                    key={i}
                    src={panel.img}
                    alt={panel.text}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeImagine === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    loading="lazy"
                  />
                ))}
                {/* Active label overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                    {IMAGINE_PANELS[activeImagine].text}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Where Depth Lives ── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 border-b border-neutral-100">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter mb-4">
              Where Depth <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Lives.</span>
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              From the smallest detail to the biggest imagination, we bring stereoscopic depth to every world.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {CONSTELLATION_NODES.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.5, ease }}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 ring-1 ring-neutral-100">
                  <img src={node.img} alt={node.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
                <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900 mb-1">{node.name}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">{node.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inside The Studio ── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 border-b border-neutral-100 bg-neutral-50/40">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter mb-3">
              Inside <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">The Studio.</span>
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed font-medium">A glimpse of stories we brought to life.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {STUDIO_WALL.map((piece, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease }}
                className="group relative overflow-hidden rounded-2xl bg-neutral-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 aspect-[3/4]"
              >
                <img src={piece.img} alt={piece.label} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-5 left-5 right-5 translate-y-3 group-hover:translate-y-0 transition-transform duration-400 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">{piece.label}</p>
                  <p className="text-white/70 text-[10px] tracking-widest uppercase mt-1">{piece.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Depth Is Invisible ── */}
      <section className="py-32 md:py-40 flex items-center justify-center border-b border-neutral-100 relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tighter text-neutral-300 mb-12">
              People remember<br />
              <span className="text-neutral-900">what they feel.</span><br />
              Not what they watch.
            </h2>
            <div className="space-y-3 max-w-sm mx-auto">
              <p className="text-neutral-500 text-xl font-medium">Depth isn't decoration.</p>
              <p className="text-neutral-900 text-2xl font-bold">It's attention.</p>
              <p className="text-neutral-900 text-2xl font-bold">It's emotion.</p>
              <p className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent text-2xl font-bold">It's presence.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── One Frame Slider ── */}
      <section className="border-b border-neutral-100 bg-neutral-50/50">
        <div className="px-6 md:px-12 lg:px-16 py-20">
          <motion.div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]">
              One Frame.<br />Infinite <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Difference.</span>
            </h2>
            <p className="text-neutral-400 font-bold text-xs tracking-widest uppercase">Slide to see the depth</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="relative w-full overflow-hidden select-none rounded-[2rem] shadow-2xl ring-1 ring-neutral-200"
            style={{ height: 'min(60vh, 500px)' }}
          >
            <div className="absolute inset-0 bg-black">
              <img src="/Rgb.webp" alt="Before" className="w-full h-full object-contain" />
              <span className="absolute top-6 right-8 text-[11px] font-black uppercase tracking-widest text-white drop-shadow-md z-10 transition-opacity duration-200" style={{ opacity: sliderPos > 90 ? 0 : 1 }}>RGB</span>
            </div>
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src="/Depthmap.jpg" alt="After" className="w-full h-full object-contain" />
              <span className="absolute top-6 left-8 text-[11px] font-black uppercase tracking-widest text-indigo-100 drop-shadow-md z-10 transition-opacity duration-200" style={{ opacity: sliderPos < 10 ? 0 : 1 }}>Depth Map</span>
            </div>
            <div className="absolute inset-y-0 w-0.5 bg-white/60 shadow-[0_0_12px_rgba(255,255,255,0.4)]" style={{ left: `${sliderPos}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-xl pointer-events-none z-10" style={{ left: `${sliderPos}%` }}>
              <ArrowLeftRight className="w-5 h-5 text-neutral-700" />
            </div>
            <input type="range" min={0} max={100} value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
          </motion.div>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 border-b border-neutral-100">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter mb-3">
              Our <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Process.</span>
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed font-medium">Every project. Every detail. Craft with care.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {CRAFT_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease }}
                  className="group p-7 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-5 group-hover:bg-indigo-50 transition-colors">
                    <Icon className="w-5 h-5 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
