import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

// ─── Shared tiny utilities ─────────────────────────────────────────────────

function SectionTag({ num }: { num: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-[11px] text-[#B8B8B8] tracking-[0.25em] uppercase font-medium">{num}</span>
      <span className="block w-10 h-px bg-white/20" />
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────

// Explicitly placed grid items matching the reference image layout exactly
// Grid is 6 columns. cs=colStart, ce=colEnd, rs=rowStart, re=rowEnd (CSS grid line numbers)
const GALLERY_ITEMS = [
  // ── Row 1: 3 equal-width wide cards ────────────────────────────────────────
  { title: 'Feature Films', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=85', cs: 1, ce: 3, rs: 1, re: 2 },
  { title: 'Short Films', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=85', cs: 3, ce: 5, rs: 1, re: 2 },
  { title: 'Music Videos', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=85', cs: 5, ce: 7, rs: 1, re: 2 },
  // ── Row 2: 4 cards (last one is tall, spans into row 3) ────────────────────
  { title: 'Commercials', img: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&q=85', cs: 1, ce: 3, rs: 2, re: 3 },
  { title: 'Books', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=85', cs: 3, ce: 5, rs: 2, re: 3 },
  { title: 'Product Visualization', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=85', cs: 5, ce: 6, rs: 2, re: 3 },
  { title: 'Luxury Watches', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=85', cs: 6, ce: 7, rs: 2, re: 4 }, // tall — spans rows 2+3
  // ── Row 3: 3 cards + Luxury Watches above fills col 6 ──────────────────────
  { title: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=85', cs: 1, ce: 2, rs: 3, re: 4 },
  { title: 'Automobiles', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700&q=85', cs: 2, ce: 5, rs: 3, re: 4 }, // wide car
  { title: 'Medical', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&q=85', cs: 5, ce: 6, rs: 3, re: 4 },
  // ── Row 4: 5 cards ─────────────────────────────────────────────────────────
  { title: 'Architecture', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=85', cs: 1, ce: 2, rs: 4, re: 5 },
  { title: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=85', cs: 2, ce: 3, rs: 4, re: 5 },
  { title: 'Education', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=85', cs: 3, ce: 5, rs: 4, re: 5 }, // slightly wider
  { title: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=85', cs: 5, ce: 6, rs: 4, re: 5 },
  { title: 'Wildlife', img: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&q=85', cs: 6, ce: 7, rs: 4, re: 5 },
  // ── Row 5: 6 equal small cards ─────────────────────────────────────────────
  { title: 'Animation', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=85', cs: 1, ce: 2, rs: 5, re: 6 },
  { title: 'Concerts', img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=85', cs: 2, ce: 3, rs: 5, re: 6 },
  { title: 'Documentaries', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=85', cs: 3, ce: 4, rs: 5, re: 6 },
  { title: 'Jewellery', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=85', cs: 4, ce: 5, rs: 5, re: 6 },
  { title: 'Photography', img: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&q=85', cs: 5, ce: 6, rs: 5, re: 6 },
  { title: 'Streaming & OTT', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=85', cs: 6, ce: 7, rs: 5, re: 6 },
];

const IMAGINE_PANELS = [
  {
    text: 'Imagine a child opening a book.',
    sub: 'Stories feel alive when depth breathes through every page.',
    img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1000&q=85',
    dir: 'ltr',
  },
  {
    text: 'Imagine a product impossible to ignore.',
    sub: 'Depth transforms what you sell into what people remember.',
    img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1000&q=85',
    dir: 'rtl',
  },
  {
    text: 'Imagine your next film feeling more immersive.',
    sub: 'Every frame gains presence. Every scene gains weight.',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1000&q=85',
    dir: 'ltr',
  },
];

// Constellation node data with real image circles
const CONSTELLATION_NODES = [
  { id: 0, name: 'Publishing', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80', x: 38, y: 10, size: 68, desc: 'Immersive books that children never forget.' },
  { id: 1, name: 'Cinema', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80', x: 49, y: 16, size: 72, desc: 'Feature films with real cinematic presence.' },
  { id: 2, name: 'Streaming & OTT', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&q=80', x: 61, y: 11, size: 58, desc: 'Premium OTT content that captivates audiences.' },
  { id: 3, name: 'Commercials', img: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=200&q=80', x: 76, y: 17, size: 58, desc: 'Advertising that stops people in their tracks.' },
  { id: 4, name: 'Animation', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&q=80', x: 24, y: 30, size: 60, desc: 'Animated worlds with breathtaking depth.' },
  { id: 5, name: 'Museums', img: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&q=80', x: 43, y: 38, size: 76, desc: 'Exhibits that transport visitors into the experience.' },
  { id: 6, name: 'Medical', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&q=80', x: 57, y: 37, size: 92, desc: 'Precision visualization that helps communicate, educate and save lives.' },
  { id: 7, name: 'Automotive', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=80', x: 68, y: 31, size: 72, desc: 'Vehicles showcased with spatial realism.' },
  { id: 8, name: 'Education', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&q=80', x: 23, y: 48, size: 58, desc: 'Learning that students feel, not just see.' },
  { id: 9, name: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80', x: 39, y: 55, size: 60, desc: 'Gaming environments with true stereoscopic depth.' },
  { id: 10, name: 'Luxury Brands', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80', x: 56, y: 55, size: 60, desc: 'Luxury products that demand attention.' },
  { id: 11, name: 'Architecture', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80', x: 70, y: 51, size: 60, desc: 'Architectural visions brought to spatial life.' },
  { id: 12, name: 'Photography', img: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=200&q=80', x: 26, y: 65, size: 58, desc: 'Photography that transcends the flat frame.' },
  { id: 13, name: 'Music Videos', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=80', x: 37, y: 73, size: 60, desc: 'Immersive music experiences that move audiences.' },
  { id: 14, name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80', x: 50, y: 72, size: 60, desc: 'Fashion films with dimension and presence.' },
  { id: 15, name: 'Documentaries', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80', x: 63, y: 73, size: 60, desc: 'Stories of the world captured in full depth.' },
];

// Connections between node IDs
const CONSTELLATION_EDGES = [
  [0, 1], [1, 2], [2, 3],
  [0, 4], [4, 5], [5, 6],
  [1, 5], [1, 6], [2, 6],
  [6, 7], [7, 3], [7, 11],
  [4, 8], [8, 9], [8, 12],
  [5, 9], [9, 10], [9, 13],
  [6, 10], [10, 11], [10, 14],
  [11, 15], [13, 14], [14, 15],
  [12, 13],
];

const STUDIO_WALL = [
  { img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80', label: 'Edge of Tomorrow', sub: 'Feature Film', w: 'col-span-2 row-span-2', rotate: '-rotate-1' },
  { img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80', label: 'Human Anatomy 3D', sub: 'Medical Visualization', w: 'col-span-1 row-span-1', rotate: 'rotate-1' },
  { img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', label: 'Jewel Series', sub: 'Luxury', w: 'col-span-1 row-span-1', rotate: '-rotate-2' },
  { img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', label: 'ODI Kids', sub: 'Book', w: 'col-span-1 row-span-2', rotate: 'rotate-2' },
  { img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80', label: 'Driven to Inspire', sub: 'Automotive Campaign', w: 'col-span-2 row-span-1', rotate: 'rotate-1' },
  { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80', label: 'Live Arena', sub: 'Concert 3D', w: 'col-span-1 row-span-1', rotate: '-rotate-1' },
  { img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', label: 'The Look', sub: 'Fashion Film', w: 'col-span-1 row-span-1', rotate: 'rotate-2' },
];

const REACTIONS = [
  { quote: "That's exactly how I imagined it.", name: 'A. Mehta, Book Publisher', img: 'https://images.unsplash.com/photo-1485546246426-d4323af2061e?w=500&q=80' },
  { quote: "We couldn't stop looking at it.", name: 'R. Khan, Film Director', img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&q=80' },
  { quote: "It feels so real, my kids love it.", name: 'S. Patel, Museum Curator', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&q=80' },
  { quote: "The depth is absolutely natural.", name: 'L. Nair, Brand Director', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80' },
  { quote: "It brings the scene alive — truly.", name: 'D. Roy, OTT Producer', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80' },
];

const PLAYGROUND_WORDS = [
  ['BOOKS', 'FEATURE FILMS', 'SHORT FILMS'],
  ['REELS', 'MUSIC', 'COMMERCIALS'],
  ['PRODUCTS', 'ANIMATION', 'GAMING'],
  ['MUSEUMS', 'MEDICAL', 'EDUCATION'],
];

const CRAFT_STEPS = [
  { n: '01', title: 'Curiosity', desc: 'Every project starts with curiosity. We study your content deeply.' },
  { n: '02', title: 'Study', desc: 'We analyse every frame, every layer, every plane of depth.' },
  { n: '03', title: 'Shape', desc: 'We craft the spatial structure that gives your content presence.' },
  { n: '04', title: 'Refine', desc: 'We refine every detail until depth feels completely invisible.' },
  { n: '05', title: 'Deliver', desc: 'We deliver something that feels natural. Craft people can feel.' },
];

// ─── Component ────────────────────────────────────────────────────────────

export function HomeFeatures() {
  const [sliderPos, setSliderPos] = useState(50);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <div
      className="bg-[#080808] text-white"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >

      {/* ══════════════════════════════════════════════════════════════
          SECTION 02 — Everything Can Have Depth
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 border-b border-white/[0.06] overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-0">

          {/* ── Left label column ─────────────────────────────────── */}
          <div className="lg:w-[22%] flex-shrink-0 px-8 md:px-12 lg:px-16 py-16 flex flex-col justify-between">
            <div>
              <SectionTag num="02" />
              <h2 className="text-4xl md:text-5xl xl:text-[3.5rem] font-light leading-[1.08] tracking-tight mb-6">
                Everything<br />Can Have<br />
                <span style={{ color: '#00C8FF' }}>Depth.</span>
              </h2>
              <p className="text-[#B8B8B8] text-sm leading-[1.8] max-w-[220px] mb-12">
                From stories to products, from moments to ideas — we bring every vision closer to life.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[#B8B8B8] text-[11px] tracking-[0.2em] uppercase">
              <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                <ArrowRight size={11} strokeWidth={1.5} />
              </span>
              Hover to explore
            </div>
          </div>

          {/* ── Right gallery wall ────────────────────────────────── */}
          <div className="lg:w-[78%] flex-shrink-0">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(5, 160px)',
              }}
            >
              {GALLERY_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="relative group overflow-hidden bg-[#0d0d0d] cursor-pointer rounded-[8px]"
                  style={{
                    gridColumnStart: item.cs,
                    gridColumnEnd: item.ce,
                    gridRowStart: item.rs,
                    gridRowEnd: item.re,
                  }}
                >
                  {/* Full-color image */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Permanent gradient overlay — darkens bottom & top edges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40 pointer-events-none" />

                  {/* Title — always visible, top-left */}
                  <div className="absolute top-0 left-0 right-0 px-3 pt-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white drop-shadow-md">
                      {item.title}
                    </span>
                  </div>

                  {/* Arrow icon — always visible, bottom-right */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-white/20 bg-black/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#00C8FF]/60 group-hover:bg-[#00C8FF]/10">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 8L8 2M8 2H3M8 2V7" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 03 — Imagine…
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="px-8 md:px-16 lg:px-20 pt-24 pb-12">
            <SectionTag num="03" />
          </div>

          {IMAGINE_PANELS.map((panel, i) => (
            <div
              key={i}
              className={`flex flex-col ${panel.dir === 'rtl' ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[80vh] border-t border-white/[0.06]`}
            >
              {/* Text half */}
              <div className="lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20">
                <p className="text-[11px] text-[#B8B8B8] tracking-[0.25em] uppercase mb-8">
                  Imagine ——
                </p>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] tracking-wide mb-8 text-white">
                  {panel.text}
                </h3>
                <p className="text-[#B8B8B8] text-sm leading-[1.8] max-w-sm">{panel.sub}</p>
              </div>

              {/* Image half */}
              <div className="lg:w-1/2 relative overflow-hidden min-h-[50vw] lg:min-h-0">
                <img
                  src={panel.img}
                  alt={panel.text}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 04 — Where Depth Lives (Constellation)
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.06] relative overflow-hidden" style={{ background: '#050608' }}>
        {/* Space dust particles */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Subtle deep blue glow in center */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 55% 45%, rgba(0,80,180,0.12) 0%, transparent 70%)'
        }} />

        <div className="flex flex-col lg:flex-row relative z-10 min-h-screen">

          {/* ── Left label column ────────────────────────────────── */}
          <div className="lg:w-[22%] flex-shrink-0 px-8 md:px-12 lg:px-16 py-20 flex flex-col justify-center">
            <SectionTag num="04" />
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-light leading-[1.05] tracking-tight mb-3">
              Where Depth
            </h2>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-light leading-[1.05] tracking-tight mb-4" style={{ color: '#00C8FF' }}>
              Lives.
            </h2>
            <div className="w-10 h-px mb-8" style={{ background: '#00C8FF' }} />
            <p className="text-[#B8B8B8] text-sm leading-[1.8] max-w-[200px] mb-12">
              From the smallest detail to the biggest imagination, we bring stereoscopic depth to every world and every idea.
            </p>
            <button className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase transition-colors" style={{ color: '#00C8FF' }}>
              Explore All Industries <ArrowRight size={13} strokeWidth={1.5} />
            </button>
          </div>

          {/* ── Constellation area ───────────────────────────────── */}
          <div className="relative flex-1" style={{ minHeight: 700 }}>

            {/* SVG lines layer */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {CONSTELLATION_EDGES.map(([a, b], li) => {
                const na = CONSTELLATION_NODES[a];
                const nb = CONSTELLATION_NODES[b];
                if (!na || !nb) return null;
                const isActive = hoveredNode === a || hoveredNode === b;
                return (
                  <line
                    key={li}
                    x1={`${na.x}%`} y1={`${na.y}%`}
                    x2={`${nb.x}%`} y2={`${nb.y}%`}
                    stroke={isActive ? 'rgba(0,200,255,1)' : 'rgba(0,200,255,0.65)'}
                    strokeWidth={isActive ? '2' : '1'}
                    filter={isActive ? 'url(#glow)' : undefined}
                    style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {CONSTELLATION_NODES.map((node, i) => {
              const isHovered = hoveredNode === i;
              const isConnected = hoveredNode !== null && CONSTELLATION_EDGES.some(
                ([a, b]) => (a === hoveredNode && b === i) || (b === hoveredNode && a === i)
              );
              const dim = hoveredNode !== null && !isHovered && !isConnected;
              return (
                <div
                  key={i}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isHovered ? 30 : 10,
                  }}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Circle image */}
                  <div
                    className="rounded-full overflow-hidden border-2 transition-all duration-400"
                    style={{
                      width: node.size,
                      height: node.size,
                      borderColor: isHovered ? '#00C8FF' : 'rgba(255,255,255,0.18)',
                      boxShadow: isHovered
                        ? '0 0 0 4px rgba(0,200,255,0.2), 0 0 24px rgba(0,200,255,0.4)'
                        : '0 0 0 0px transparent',
                      opacity: dim ? 0.3 : 1,
                      transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 0.35s ease',
                    }}
                  >
                    <img
                      src={node.img}
                      alt={node.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Inner dark overlay */}
                    <div className="absolute inset-0 rounded-full" style={{
                      background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.55) 100%)'
                    }} />
                  </div>

                  {/* Label above or below */}
                  <div
                    className="absolute left-1/2 whitespace-nowrap text-center pointer-events-none"
                    style={{
                      transform: 'translateX(-50%)',
                      top: i % 2 === 0 ? 'auto' : `${node.size + 6}px`,
                      bottom: i % 2 === 0 ? `${node.size + 6}px` : 'auto',
                    }}
                  >
                    <span
                      className="text-[9px] font-bold tracking-[0.22em] uppercase transition-colors duration-300"
                      style={{ color: isHovered ? '#00C8FF' : 'rgba(255,255,255,0.65)' }}
                    >
                      {node.name}
                    </span>
                  </div>

                  {/* + indicator */}
                  <div
                    className="absolute transition-all duration-300"
                    style={{
                      bottom: -4,
                      right: -4,
                      opacity: isHovered ? 1 : 0.5,
                      color: isHovered ? '#00C8FF' : 'white',
                      fontSize: 14,
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    +
                  </div>
                </div>
              );
            })}


          </div>{/* end constellation area */}
        </div>{/* end flex row */}
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 05 — Inside The Studio
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start mb-16">
            <div className="lg:w-1/4">
              <SectionTag num="05" />
              <h2 className="text-4xl md:text-5xl font-light leading-[1.1] tracking-wide mb-6">
                Inside<br />The Studio.
              </h2>
              <p className="text-[#B8B8B8] text-sm leading-relaxed mb-10">
                A glimpse of stories we brought to life.
              </p>
              <button className="flex items-center gap-3 text-[11px] text-[#B8B8B8] uppercase tracking-[0.22em] hover:text-white transition-colors">
                View all work <ArrowRight size={13} strokeWidth={1.5} />
              </button>
            </div>

            {/* Studio wall — pinboard feel */}
            <div
              className="lg:w-3/4 w-full grid gap-3"
              style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '160px' }}
            >
              {STUDIO_WALL.map((piece, i) => (
                <div
                  key={i}
                  className={`relative group overflow-hidden bg-[#111] cursor-pointer ${piece.w} ${piece.rotate} transition-transform duration-500 hover:rotate-0 hover:scale-105 hover:z-10 shadow-2xl`}
                >
                  <img
                    src={piece.img}
                    alt={piece.label}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">{piece.label}</p>
                    <p className="text-[#B8B8B8] text-[9px] tracking-[0.15em] uppercase mt-0.5">{piece.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 06 — Depth Is Invisible
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="min-h-screen flex items-center justify-center border-b border-white/[0.06] relative overflow-hidden"
        style={{ background: '#030303' }}
      >
        {/* Extremely subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
          <SectionTag num="06" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.3] tracking-wide text-[#B8B8B8] mb-16">
            People remember<br />
            <span className="text-white font-medium">what they feel.</span><br />
            Not what they watch.
          </h2>
          <div className="space-y-5 text-left max-w-md mx-auto">
            <p className="text-[#B8B8B8] text-lg font-light tracking-wide">Depth isn't decoration.</p>
            <p className="text-white text-xl font-light tracking-wide">It's <em className="not-italic font-semibold">attention.</em></p>
            <p className="text-white text-xl font-light tracking-wide">It's <em className="not-italic font-semibold">emotion.</em></p>
            <p className="text-[#00C8FF] text-xl font-light tracking-wide">It's <em className="not-italic font-semibold">presence.</em></p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 07 — One Frame (Before / After Slider)
      ══════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.06] relative">
        <div className="px-8 md:px-16 lg:px-20 py-16">
          <SectionTag num="07" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide">
              One Frame.<br />Infinite Difference.
            </h2>
            <p className="text-[#B8B8B8] text-sm tracking-widest uppercase">Slide to see the depth</p>
          </div>
        </div>

        {/* Comparison slider */}
        <div className="relative w-full overflow-hidden select-none" style={{ height: '65vh' }}>
          {/* BEFORE (full width, grayscale) */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&q=90"
              alt="Before"
              className="w-full h-full object-cover grayscale"
            />
            <span className="absolute top-6 left-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Before</span>
          </div>

          {/* AFTER (clipped, full color) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&q=90"
              alt="After"
              className="absolute inset-0 h-full object-cover"
              style={{ width: '100vw', maxWidth: '1800px' }}
            />
            <span className="absolute top-6 right-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00C8FF]">After</span>
          </div>

          {/* Divider line */}
          <div
            className="absolute inset-y-0 w-px bg-white/30"
            style={{ left: `${sliderPos}%` }}
          />

          {/* Handle knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border border-white/30 flex items-center justify-center shadow-2xl pointer-events-none z-10"
            style={{ left: `${sliderPos}%` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M8 12H16M4 8l-4 4 4 4M20 8l4 4-4 4" />
            </svg>
          </div>

          {/* Drag input */}
          <input
            type="range"
            min={0} max={100}
            value={sliderPos}
            onChange={e => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 08 — Creative Playground
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-8 md:px-16 lg:px-20 border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start gap-16">
            <div className="lg:w-1/4 flex-shrink-0">
              <SectionTag num="08" />
              <h2 className="text-4xl md:text-5xl font-light leading-[1.1] tracking-wide mb-4">
                Our<br />Playground.
              </h2>
              <p className="text-[#B8B8B8] text-sm leading-relaxed">
                Every medium. Every format. Every dimension.
              </p>
            </div>

            <div className="lg:w-3/4 w-full">
              {PLAYGROUND_WORDS.map((row, ri) => (
                <div
                  key={ri}
                  className="flex flex-wrap gap-x-12 gap-y-2 border-b border-white/[0.08] py-6"
                >
                  {row.map((word, wi) => (
                    <span
                      key={wi}
                      className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide cursor-pointer text-[#B8B8B8] hover:text-white transition-colors duration-400 uppercase"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 09 — Our Craft (Process)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start mb-20">
            <div className="lg:w-1/4">
              <SectionTag num="09" />
              <h2 className="text-4xl md:text-5xl font-light leading-[1.1] tracking-wide mb-4">
                Our<br />Process.
              </h2>
              <p className="text-[#B8B8B8] text-sm leading-relaxed">
                Every project. Every detail. Craft with care.
              </p>
            </div>
          </div>

          {/* Horizontal process steps */}
          <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            {CRAFT_STEPS.map((step, i) => (
              <div key={i} className="flex-1 px-0 lg:px-8 py-10 lg:py-0 group cursor-default">
                <span className="text-[11px] text-[#00C8FF] tracking-[0.25em] uppercase font-medium mb-4 block">
                  {step.n}
                </span>
                <h3 className="text-2xl lg:text-3xl font-light text-white mb-4 tracking-wide group-hover:text-[#00C8FF] transition-colors duration-500">
                  {step.title} <span className="text-[#B8B8B8] text-base">·</span>
                </h3>
                <p className="text-[#B8B8B8] text-sm leading-[1.8] max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 10 — Human Reactions
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-8 md:px-16 lg:px-20 border-b border-white/[0.06]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start mb-16">
            <div className="lg:w-1/4">
              <SectionTag num="10" />
              <h2 className="text-4xl md:text-5xl font-light leading-[1.1] tracking-wide mb-4">
                Real People.<br />Real Reactions.
              </h2>
              <p className="text-[#B8B8B8] text-sm leading-relaxed">
                The best feedback comes from the experience itself.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {REACTIONS.map((r, i) => (
              <div key={i} className="group cursor-pointer flex flex-col gap-4">
                <div className="relative overflow-hidden bg-[#111]" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div>
                  <p className="text-white text-sm font-light italic leading-relaxed mb-1">"{r.quote}"</p>
                  <p className="text-[#B8B8B8] text-[10px] tracking-[0.2em] uppercase">{r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 11 — Final CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden">
        {/* Barely visible background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1800&q=60"
            alt=""
            className="w-full h-full object-cover opacity-[0.04] grayscale scale-110"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <SectionTag num="11" />
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-wide text-white mb-6">
            Your Next Project<br />Already Has A Story.
          </h2>
          <p className="text-[#B8B8B8] text-xl font-light tracking-wide mb-16">
            Let's give it depth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="px-10 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-[#00C8FF] hover:text-white transition-colors duration-500">
              START THE CONVERSATION →
            </button>
            <button className="text-[#B8B8B8] text-[11px] uppercase tracking-[0.22em] hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5">
              SCHEDULE A CALL
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
