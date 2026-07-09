import React, { useState } from 'react';
import { Compass, Eye, Layers, Wand2, Send, ArrowLeftRight } from 'lucide-react';

const GALLERY_ITEMS = [
  { title: 'Feature Films', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=85' },
  { title: 'Short Films', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=85' },
  { title: 'Music Videos', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=85' },
  { title: 'Commercials', img: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&q=85' },
  { title: 'Books', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=85' },
  { title: 'Product Visualization', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85' },

  { title: 'Automobiles', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700&q=85' },
  { title: 'Medical', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=85' },
  { title: 'Architecture', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=85' },
  { title: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=85' },
  { title: 'Education', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=85' },
];

const IMAGINE_PANELS = [
  { text: 'Imagine a child opening a book.', sub: 'Stories feel alive when depth breathes through every page.', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1000&q=85', dir: 'ltr' },
  { text: 'Imagine a product impossible to ignore.', sub: 'Depth transforms what you sell into what people remember.', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1000&q=85', dir: 'rtl' },
  { text: 'Imagine your next film feeling more immersive.', sub: 'Every frame gains presence. Every scene gains weight.', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1000&q=85', dir: 'ltr' },
];

const CONSTELLATION_NODES = [
  { name: 'Publishing', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80', desc: 'Immersive books that children never forget.' },
  { name: 'Cinema', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80', desc: 'Feature films with real cinematic presence.' },
  { name: 'Streaming & OTT', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&q=80', desc: 'Premium OTT content that captivates audiences.' },
  { name: 'Commercials', img: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=200&q=80', desc: 'Advertising that stops people in their tracks.' },
  { name: 'Animation', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&q=80', desc: 'Animated worlds with breathtaking depth.' },
  { name: 'Museums', img: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&q=80', desc: 'Exhibits that transport visitors into the experience.' },
  { name: 'Medical', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&q=80', desc: 'Precision visualization that helps communicate, educate and save lives.' },
  { name: 'Automotive', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80', desc: 'Vehicles showcased with spatial realism.' },
];

const STUDIO_WALL = [
  { img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80', label: 'Edge of Tomorrow', sub: 'Feature Film' },
  { img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80', label: 'Human Anatomy 3D', sub: 'Medical Visualization' },
  { img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', label: 'Jewel Series', sub: 'Luxury' },
  { img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', label: 'Driven to Inspire', sub: 'Automotive Campaign' },
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

      {/* 02 — Everything Can Have Depth */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-neutral-100">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3 flex-shrink-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight mb-6">
              Everything<br />Can Have<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Depth.</span>
            </h2>
            <p className="text-neutral-500 text-base leading-relaxed max-w-sm mb-12">
              From stories to products, from moments to ideas — we bring every vision closer to life.
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-square bg-neutral-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Imagine… (Modern Interactive Layout) */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-neutral-100 bg-white">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Interactive List */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            <p className="text-[11px] text-indigo-500 font-bold tracking-[0.25em] uppercase mb-4">Imagine ——</p>
            {IMAGINE_PANELS.map((panel, i) => {
              const isActive = activeImagine === i;
              return (
                <div 
                  key={i}
                  className={`group cursor-pointer border-l-4 pl-6 py-2 transition-all duration-500 ${isActive ? 'border-indigo-500' : 'border-neutral-200 hover:border-indigo-300'}`}
                  onMouseEnter={() => setActiveImagine(i)}
                  onClick={() => setActiveImagine(i)}
                >
                  <h3 className={`text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-4 transition-colors duration-500 ${isActive ? 'text-neutral-900' : 'text-neutral-300 group-hover:text-neutral-500'}`}>
                    {panel.text}
                  </h3>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-neutral-500 text-lg leading-relaxed max-w-sm mt-2">
                      {panel.sub}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Dynamic Image Display */}
          <div className="lg:w-1/2 w-full h-[50vh] lg:h-[70vh] relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200 bg-neutral-100">
            {IMAGINE_PANELS.map((panel, i) => (
              <img 
                key={i}
                src={panel.img} 
                alt={panel.text} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeImagine === i ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm z-[-1]'}`} 
                loading="lazy" 
              />
            ))}
          </div>

        </div>
      </section>

      {/* 04 — Where Depth Lives (Grid) */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-neutral-100">
        <div className="max-w-screen-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight mb-4">
            Where Depth <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Lives.</span>
          </h2>
          <p className="text-neutral-500 text-base leading-relaxed max-w-2xl mx-auto">
            From the smallest detail to the biggest imagination, we bring stereoscopic depth to every world and every idea.
          </p>
        </div>
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {CONSTELLATION_NODES.map((node, i) => (
            <div key={i} className="group flex flex-col items-center text-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 ring-1 ring-neutral-200 group-hover:ring-indigo-100">
                <img src={node.img} alt={node.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </div>
              <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-900 mb-2">{node.name}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-[200px]">{node.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — Inside The Studio */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-neutral-100 bg-neutral-50/30">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight mb-4">
              Inside <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">The Studio.</span>
            </h2>
            <p className="text-neutral-500 text-base leading-relaxed">
              A glimpse of stories we brought to life.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STUDIO_WALL.map((piece, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl bg-neutral-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 aspect-[4/5]">
                <img src={piece.img} alt={piece.label} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">{piece.label}</p>
                  <p className="text-white/80 text-[10px] tracking-widest uppercase mt-1">{piece.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Depth Is Invisible */}
      <section className="py-32 flex items-center justify-center border-b border-neutral-100 relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-neutral-300 mb-12">
            People remember<br />
            <span className="text-neutral-900 drop-shadow-sm">what they feel.</span><br />
            Not what they watch.
          </h2>
          <div className="space-y-4 max-w-sm mx-auto">
            <p className="text-neutral-500 text-xl font-medium tracking-wide">Depth isn't decoration.</p>
            <p className="text-neutral-900 text-2xl font-bold tracking-wide">It's attention.</p>
            <p className="text-neutral-900 text-2xl font-bold tracking-wide">It's emotion.</p>
            <p className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent text-2xl font-black tracking-wide">It's presence.</p>
          </div>
        </div>
      </section>

      {/* 07 — One Frame Slider */}
      <section className="border-b border-neutral-100 relative bg-neutral-50/50">
        <div className="px-8 md:px-16 lg:px-20 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              One Frame.<br />Infinite <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Difference.</span>
            </h2>
            <p className="text-neutral-400 font-bold text-xs tracking-widest uppercase">Slide to see the depth</p>
          </div>
          <div className="relative w-full overflow-hidden select-none rounded-3xl shadow-lg ring-1 ring-neutral-200" style={{ height: '60vh' }}>
            {/* BEFORE */}
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&q=90" alt="Before" className="w-full h-full object-cover grayscale opacity-80" />
              <span className="absolute top-6 left-8 text-[11px] font-black uppercase tracking-widest text-white drop-shadow-md">Before</span>
            </div>
            {/* AFTER */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&q=90" alt="After" className="absolute inset-0 h-full object-cover" style={{ width: '100vw', maxWidth: '100%' }} />
              <span className="absolute top-6 right-8 text-[11px] font-black uppercase tracking-widest text-indigo-100 drop-shadow-md">After</span>
            </div>
            {/* Divider */}
            <div className="absolute inset-y-0 w-1 bg-white/50 backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ left: `${sliderPos}%` }} />
            {/* Knob */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-xl pointer-events-none z-10" style={{ left: `${sliderPos}%` }}>
              <ArrowLeftRight className="w-5 h-5 text-neutral-700" />
            </div>
            {/* Input */}
            <input type="range" min={0} max={100} value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
          </div>
        </div>
      </section>

      {/* 09 — Our Process */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-neutral-100">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight mb-4">
              Our <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Process.</span>
            </h2>
            <p className="text-neutral-500 text-base leading-relaxed">
              Every project. Every detail. Craft with care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CRAFT_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="group p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
                    <Icon className="w-8 h-8 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* 11 — Final CTA */}
      <section className="py-32 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-neutral-900 mb-6">
            Your Next Project<br />Already Has A Story.
          </h2>
          <p className="text-neutral-500 text-xl font-medium tracking-wide mb-12">
            Let's give it depth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-neutral-900 text-white text-sm font-bold tracking-wide hover:bg-neutral-800 hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-neutral-900/20">
              Start the Conversation
            </button>
            <button className="px-8 py-4 rounded-full bg-white text-neutral-900 text-sm font-bold tracking-wide border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
