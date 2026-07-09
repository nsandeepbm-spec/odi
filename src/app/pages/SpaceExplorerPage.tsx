import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, ShoppingCart, Sparkles, Eye, 
  ChevronRight, Compass, Shield, Award, Heart, Info, X, Orbit
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { ODILogo } from '../components/ODILogo';

export default function SpaceExplorerPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [activeTimelineStop, setActiveTimelineStop] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isSliderDragging, setIsSliderDragging] = useState<boolean>(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Scroll animations for Book Comes Alive (Section 02)
  const { scrollYProgress } = useScroll();
  const openProgress = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // Timeline stops data (Section 03)
  const timelineStops = [
    { name: "Earth", title: "Open the First Page.", desc: "Our home like you have never felt it. Floating in deep ink-black space, blue and silent.", bg: "bg-blue-50/50" },
    { name: "Moon", title: "Look a Little Closer.", desc: "Deep craters and grey regolith plains that feel close enough to touch.", bg: "bg-slate-100" },
    { name: "Rocket Launch", title: "The Adventure Starts Here.", desc: "Watch history lift off. A column of fire and wireframe clouds of steam.", bg: "bg-orange-50/50" },
    { name: "Space Station", title: "Every Page Holds a Discovery.", desc: "See how astronauts live. Docked spacecrafts and delicate solar panels.", bg: "bg-cyan-50/50" },
    { name: "Asteroid Belt", title: "A Universe Waiting to Be Explored.", desc: "A swarm of floating asteroids, catching light from a distant Sun.", bg: "bg-zinc-100" },
    { name: "Jupiter", title: "Meet the Gas Giant.", desc: "Gaseous bands of orange and white, spinning around a massive storm.", bg: "bg-amber-50" },
    { name: "Saturn", title: "Rings of Glass and Ice.", desc: "The crown jewel of our solar system, with rings modeled as floating crystalline planes.", bg: "bg-yellow-50/50" },
    { name: "Deep Space", title: "Wonder Begins with One Page.", desc: "Beyond the stars. Cosmic nebulae where new worlds are born.", bg: "bg-indigo-50/50" }
  ];

  // Gallery Spreads (Section 04)
  const spreads = [
    { title: "Solar Neighborhood", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=85" },
    { title: "Lunar Approach", img: "https://images.unsplash.com/photo-1447433589675-4adf569200c1?w=1200&q=85" },
    { title: "Liftoff Sequence", img: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&q=85" },
    { title: "Orbital Habitat", img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&q=85" },
    { title: "Asteroid Field", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=85" },
    { title: "Storm of Jupiter", img: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=85" },
    { title: "Saturnian Gaze", img: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6eab?w=1200&q=85" },
    { title: "Nebula Cradle", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=85" }
  ];

  // Slider Dragging Event Handlers (Section 05)
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsSliderDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isSliderDragging) {
        handleSliderMove(e.clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isSliderDragging]);

  const scrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-neutral-900 overflow-hidden font-sans antialiased selection:bg-neutral-900 selection:text-white">

      {/* 01 — HERO */}
      <section className="min-h-screen flex flex-col justify-between items-center text-center px-6 pt-32 pb-16 relative bg-white">
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">3D Book Series</span>
            <h1 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-5xl md:text-7xl lg:text-[88px] font-black tracking-tight text-neutral-900 uppercase leading-[0.9]"
            >
              Step Into Space.
            </h1>
            <p className="text-neutral-500 text-base md:text-lg lg:text-xl max-w-xl mx-auto leading-relaxed pt-2">
              Every page brings the universe closer with beautifully crafted stereoscopic illustrations.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <button
              onClick={() => navigate('/checkout?product=space-explorer')}
              className="px-8 py-4 bg-neutral-900 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-neutral-800 hover:scale-[1.02] active:scale-98 transition-all shadow-md cursor-pointer"
            >
              Buy Now
            </button>
            <button
              onClick={scrollToGallery}
              className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black transition-colors cursor-pointer"
            >
              <span>Preview Pages</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Animated Planet Emergence Graphic (Framer Motion) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="w-full max-w-[1000px] h-[350px] md:h-[450px] bg-neutral-50 border border-neutral-100 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center shadow-inner"
        >
          {/* Subtle cosmic background grid inside mock */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-transparent to-transparent" />
          
          {/* Mock Open Book Animation */}
          <div className="relative w-[340px] md:w-[480px] h-[220px] md:h-[300px] bg-white border border-neutral-200 rounded-lg shadow-2xl flex overflow-visible">
            {/* Spine */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-neutral-200 -translate-x-1/2 z-20" />
            
            {/* Left Page (Moon wireframe) */}
            <div className="flex-1 p-6 flex flex-col justify-between border-r border-neutral-100 select-none bg-neutral-50/50 rounded-l-lg">
              <span className="text-[8px] font-mono text-neutral-300 uppercase">PAGE 04 // LUNAR LABS</span>
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-dashed border-neutral-300 mx-auto flex items-center justify-center opacity-40">
                <Orbit className="w-10 h-10 text-neutral-400 animate-spin" />
              </div>
              <span className="text-[9px] font-bold text-neutral-400">CRATERS & REGOLITH</span>
            </div>

            {/* Right Page (Earth wireframe) */}
            <div className="flex-1 p-6 flex flex-col justify-between select-none bg-neutral-50/50 rounded-r-lg">
              <span className="text-[8px] font-mono text-neutral-300 uppercase text-right">PAGE 05 // PLANETARY</span>
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-dashed border-neutral-300 mx-auto flex items-center justify-center opacity-40">
                <Compass className="w-10 h-10 text-neutral-400" />
              </div>
              <span className="text-[9px] font-bold text-neutral-400 text-right">THE BLUE MARBLE</span>
            </div>

            {/* Floating Planet emerging from the center gutter */}
            <motion.div
              animate={{ 
                y: [-15, -35, -15],
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            >
              <svg className="w-32 h-32 md:w-44 md:h-44 drop-shadow-[0_15px_20px_rgba(6,182,212,0.15)]" viewBox="0 0 100 100">
                {/* Custom planetary SVG */}
                <polygon points="50,15 65,30 50,40" fill="rgba(6, 182, 212, 0.4)" stroke="#06B6D4" strokeWidth="0.5" />
                <polygon points="50,15 35,30 50,40" fill="rgba(99, 102, 241, 0.3)" stroke="#6366F1" strokeWidth="0.5" />
                <polygon points="65,30 80,45 65,55" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="0.5" />
                <polygon points="50,40 65,55 50,65" fill="rgba(6, 182, 212, 0.5)" stroke="#06B6D4" strokeWidth="0.5" />
                <polygon points="35,30 50,40 35,55" fill="rgba(99, 102, 241, 0.4)" stroke="#6366F1" strokeWidth="0.5" />
                <polygon points="20,45 35,30 35,55" fill="rgba(147, 51, 234, 0.2)" stroke="#9333EA" strokeWidth="0.5" />
                <polygon points="65,55 80,45 80,65" fill="rgba(6, 182, 212, 0.3)" stroke="#06B6D4" strokeWidth="0.5" />
                <polygon points="65,55 80,65 50,85" fill="rgba(99, 102, 241, 0.2)" stroke="#6366F1" strokeWidth="0.5" />
                <polygon points="50,65 65,55 50,85" fill="rgba(147, 51, 234, 0.3)" stroke="#9333EA" strokeWidth="0.5" />
                <polygon points="35,55 50,65 50,85" fill="rgba(99, 102, 241, 0.45)" stroke="#6366F1" strokeWidth="0.5" />
                <polygon points="20,65 35,55 50,85" fill="rgba(6, 182, 212, 0.3)" stroke="#06B6D4" strokeWidth="0.5" />
                <polygon points="20,45 35,55 20,65" fill="rgba(147, 51, 234, 0.25)" stroke="#9333EA" strokeWidth="0.5" />
                <circle cx="50" cy="15" r="1" fill="#fff" />
                <circle cx="65" cy="30" r="1" fill="#fff" />
                <circle cx="35" cy="30" r="1" fill="#fff" />
                <circle cx="50" cy="40" r="1" fill="#fff" />
                <circle cx="80" cy="45" r="1" fill="#fff" />
                <circle cx="20" cy="45" r="1" fill="#fff" />
                <circle cx="65" cy="55" r="1" fill="#fff" />
                <circle cx="35" cy="55" r="1" fill="#fff" />
                <circle cx="50" cy="65" r="1" fill="#fff" />
                <circle cx="50" cy="85" r="1" fill="#fff" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 02 — A BOOK THAT COMES ALIVE */}
      <section id="alive" className="py-28 bg-white border-t border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Book closed to Open vector graphic */}
            <div className="h-[400px] bg-neutral-50 rounded-[2rem] border border-neutral-100 flex items-center justify-center relative overflow-hidden p-8 shadow-inner">
              <div className="absolute top-4 left-6 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">TACTILE POP-UP EXPERIMENTS</div>
              
              {/* Dynamic Closed/Open state animation */}
              <div className="relative w-64 h-[240px] flex items-center justify-center">
                {/* Closed book cover */}
                <motion.div
                  style={{
                    transformOrigin: 'left center',
                    rotateY: useTransform(openProgress, [0, 1], [0, -135]),
                    z: useTransform(openProgress, [0, 1], [0, 20])
                  }}
                  className="absolute w-[180px] h-[240px] bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-r-lg border border-neutral-900 shadow-2xl z-10 p-5 flex flex-col justify-between text-white"
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Oceaniek Dimension</span>
                  <div className="space-y-1">
                    <div className="text-lg font-black tracking-tight leading-none uppercase">SPACE</div>
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest leading-none">EXPLORER</div>
                  </div>
                  <div className="w-6 h-6 border-2 border-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">3D</div>
                </motion.div>

                {/* Back Plate / Page under */}
                <div className="absolute w-[180px] h-[240px] bg-white rounded-r-lg border border-neutral-200 shadow-lg p-5 flex flex-col justify-between text-neutral-800">
                  <span className="text-[7px] font-mono text-neutral-400 uppercase">PAGE 01</span>
                  
                  {/* Floating elements inside book */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <motion.div 
                      style={{
                        scale: useTransform(openProgress, [0, 1], [0.3, 1.25]),
                        y: useTransform(openProgress, [0, 1], [0, -10]),
                        opacity: useTransform(openProgress, [0, 1], [0, 1])
                      }}
                      className="text-neutral-900"
                    >
                      <svg className="w-20 h-20 text-cyan-500 fill-current" viewBox="0 0 100 100">
                        <polygon points="50,15 65,30 50,40" fill="rgba(6, 182, 212, 0.4)" stroke="#06B6D4" strokeWidth="0.5" />
                        <polygon points="50,15 35,30 50,40" fill="rgba(99, 102, 241, 0.3)" stroke="#6366F1" strokeWidth="0.5" />
                        <polygon points="50,40 65,55 50,65" fill="rgba(6, 182, 212, 0.5)" stroke="#06B6D4" strokeWidth="0.5" />
                        <polygon points="35,30 50,40 35,55" fill="rgba(99, 102, 241, 0.4)" stroke="#6366F1" strokeWidth="0.5" />
                        <polygon points="50,65 65,55 50,85" fill="rgba(147, 51, 234, 0.3)" stroke="#9333EA" strokeWidth="0.5" />
                        <polygon points="35,55 50,65 50,85" fill="rgba(99, 102, 241, 0.45)" stroke="#6366F1" strokeWidth="0.5" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <span className="text-[8px] font-mono text-neutral-400 uppercase text-right">ORBITAL SYSTEMS</span>
                </div>
              </div>
            </div>

            {/* Right: Text layout */}
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 font-sans">02 — A Book That Comes Alive</span>
              
              <h2 
                style={{ fontFamily: '"Afacad Flux", sans-serif' }}
                className="text-4xl lg:text-[50px] font-black uppercase tracking-tight text-neutral-900 leading-[0.95]"
              >
                More Than a Book
              </h2>

              <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-md">
                Open the cover, wear the included 3D glasses, and discover a universe filled with depth, colour and curiosity.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 03 — JOURNEY THROUGH SPACE (HORIZONTAL TIMELINE) */}
      <section id="journey" className="py-28 bg-[#f5f5f7] border-t border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">03 — Journey Through Space</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              Discover the Universe, One Page at a Time
            </h2>
          </div>

          {/* Interactive Timeline Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-6 border-b border-neutral-200 px-2 scrollbar-none scroll-smooth">
            {timelineStops.map((stop, idx) => (
              <button
                key={stop.name}
                onClick={() => setActiveTimelineStop(idx)}
                className={`py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTimelineStop === idx
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-200/50'
                }`}
              >
                {stop.name}
              </button>
            ))}
          </div>

          {/* Display Card for Active Stop */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimelineStop}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className={`p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-neutral-200/80 flex flex-col md:flex-row gap-8 items-center ${timelineStops[activeTimelineStop].bg} transition-colors duration-500 min-h-[380px] shadow-sm`}
              >
                <div className="flex-1 space-y-4">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">TIMELINE STOP 0{activeTimelineStop + 1}</span>
                  <h3 
                    style={{ fontFamily: '"Afacad Flux", sans-serif' }}
                    className="text-3xl md:text-4xl lg:text-[42px] font-black uppercase tracking-tight leading-none text-neutral-900"
                  >
                    {timelineStops[activeTimelineStop].title}
                  </h3>
                  <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-md">
                    {timelineStops[activeTimelineStop].desc}
                  </p>
                </div>

                {/* Animated graphic based on stop */}
                <div className="w-56 h-56 flex-shrink-0 flex items-center justify-center rounded-3xl border border-white/40 bg-white/30 backdrop-blur-md shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,0 L100,100 M100,0 L0,100" stroke="black" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="text-neutral-900"
                  >
                    <svg className="w-32 h-32 text-indigo-500/80 fill-current" viewBox="0 0 100 100">
                      <polygon points="50,20 62,35 50,45" stroke="#6366F1" strokeWidth="0.5" fill="rgba(99,102,241,0.2)" />
                      <polygon points="50,20 38,35 50,45" stroke="#6366F1" strokeWidth="0.5" fill="rgba(99,102,241,0.1)" />
                      <polygon points="62,35 74,50 62,60" stroke="#6366F1" strokeWidth="0.5" fill="rgba(99,102,241,0.15)" />
                      <polygon points="50,45 62,60 50,68" stroke="#6366F1" strokeWidth="0.5" fill="rgba(99,102,241,0.25)" />
                      <polygon points="38,35 50,45 38,60" stroke="#6366F1" strokeWidth="0.5" fill="rgba(99,102,241,0.1)" />
                      <polygon points="26,50 38,35 38,60" stroke="#6366F1" strokeWidth="0.5" fill="rgba(99,102,241,0.08)" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 04 — EXPLORE EVERY PAGE (GALLERY & LIGHTBOX) */}
      <section id="gallery" className="py-28 bg-white border-t border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">04 — Explore Every Page</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              Look a Little Closer
            </h2>
            <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Cinematic Gallery Grid</p>
          </div>

          {/* Mosaic spreads grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {spreads.map((spread, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveLightboxImage(spread.img)}
                className="aspect-video relative rounded-2xl border border-neutral-100 overflow-hidden cursor-pointer bg-neutral-50 shadow-sm group"
              >
                <img 
                  src={spread.img} 
                  alt={spread.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                
                {/* Floating Preview overlay */}
                <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{spread.title}</span>
                    <Eye className="w-3.5 h-3.5 text-white/80" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Image frame */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl w-full max-h-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl relative"
            >
              <img 
                src={activeLightboxImage} 
                alt="Page spread details fullscreen"
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 05 — EXPERIENCE REAL DEPTH (INTERACTIVE DRAGGABLE SLIDER) */}
      <section id="depth" className="py-28 bg-[#f5f5f7] border-t border-neutral-200">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 flex flex-col items-center">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">05 — Experience Real Depth</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              Some Stories Are Better in 3D
            </h2>
          </div>

          {/* Draggable Slider Container */}
          <div 
            ref={sliderRef}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-video md:max-h-[500px] rounded-[2.5rem] border border-neutral-200/80 bg-[#010411] shadow-xl overflow-hidden select-none cursor-ew-resize"
          >
            {/* Background elements */}
            <div className="absolute top-4 left-6 text-[10px] font-mono text-white/30 uppercase tracking-widest z-20">INTERACTIVE MASK PREVIEW</div>
            
            {/* LEFT STATE: WITHOUT GLASSES (Flat color rendering) */}
            <div className="absolute inset-0">
              <div className="w-full h-full flex items-center justify-center bg-[#010411]">
                {/* Earth standard */}
                <svg className="w-72 h-72 opacity-95 text-neutral-900" viewBox="0 0 100 100">
                  <polygon points="50,15 65,30 50,40" fill="rgba(6, 182, 212, 0.45)" stroke="#06B6D4" strokeWidth="0.5" />
                  <polygon points="50,15 35,30 50,40" fill="rgba(59, 130, 246, 0.35)" stroke="#3B82F6" strokeWidth="0.5" />
                  <polygon points="65,30 80,45 65,55" fill="rgba(14, 116, 144, 0.3)" stroke="#0E7490" strokeWidth="0.5" />
                  <polygon points="50,40 65,55 50,65" fill="rgba(6, 182, 212, 0.6)" stroke="#06B6D4" strokeWidth="0.5" />
                  <polygon points="35,30 50,40 35,55" fill="rgba(29, 78, 216, 0.45)" stroke="#1D4ED8" strokeWidth="0.5" />
                  <polygon points="20,45 35,30 35,55" fill="rgba(30, 58, 138, 0.3)" stroke="#1E3A8A" strokeWidth="0.5" />
                  <polygon points="65,55 80,45 80,65" fill="rgba(37, 99, 235, 0.25)" stroke="#2563EB" strokeWidth="0.5" />
                  <polygon points="65,55 80,65 50,85" fill="rgba(30, 58, 138, 0.3)" stroke="#1E3A8A" strokeWidth="0.5" />
                  <polygon points="50,65 65,55 50,85" fill="rgba(29, 78, 216, 0.55)" stroke="#1D4ED8" strokeWidth="0.5" />
                  <polygon points="35,55 50,65 50,85" fill="rgba(59, 130, 246, 0.5)" stroke="#3B82F6" strokeWidth="0.5" />
                  <polygon points="20,65 35,55 50,85" fill="rgba(6, 182, 212, 0.3)" stroke="#06B6D4" strokeWidth="0.5" />
                  <polygon points="20,45 35,55 20,65" fill="rgba(14, 116, 144, 0.4)" stroke="#0E7490" strokeWidth="0.5" />
                </svg>
              </div>
              
              <div className="absolute bottom-6 left-6 text-white/50 text-[10px] font-mono tracking-widest uppercase">Without Glasses</div>
            </div>

            {/* RIGHT STATE: WITH GLASSES (Anaglyph stereoscopic shift) */}
            <div 
              style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
              className="absolute inset-0 bg-[#01030e] select-none"
            >
              <div className="w-full h-full flex items-center justify-center relative bg-[#010411]">
                {/* Red channel shift */}
                <div className="absolute translate-x-[-6px] opacity-70 mix-blend-screen">
                  <svg className="w-72 h-72 text-red-500 fill-current stroke-current" viewBox="0 0 100 100">
                    <polygon points="50,15 65,30 50,40" fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="50,15 35,30 50,40" fill="rgba(239, 68, 68, 0.15)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="65,30 80,45 65,55" fill="rgba(239, 68, 68, 0.1)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="50,40 65,55 50,65" fill="rgba(239, 68, 68, 0.25)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="35,30 50,40 35,55" fill="rgba(239, 68, 68, 0.18)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="20,45 35,30 35,55" fill="rgba(239, 68, 68, 0.12)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="65,55 80,45 80,65" fill="rgba(239, 68, 68, 0.1)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="65,55 80,65 50,85" fill="rgba(239, 68, 68, 0.12)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="50,65 65,55 50,85" fill="rgba(239, 68, 68, 0.22)" stroke="#EF4444" strokeWidth="0.5" />
                    <polygon points="35,55 50,65 50,85" fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="0.5" />
                    <circle cx="50" cy="15" r="1.5" fill="#EF4444" />
                    <circle cx="65" cy="30" r="1.5" fill="#EF4444" />
                    <circle cx="35" cy="30" r="1.5" fill="#EF4444" />
                    <circle cx="50" cy="40" r="1.5" fill="#EF4444" />
                    <circle cx="80" cy="45" r="1.5" fill="#EF4444" />
                  </svg>
                </div>
                
                {/* Cyan channel shift */}
                <div className="absolute translate-x-[6px] opacity-70 mix-blend-screen">
                  <svg className="w-72 h-72 text-cyan-400 fill-current stroke-current" viewBox="0 0 100 100">
                    <polygon points="50,15 65,30 50,40" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="50,15 35,30 50,40" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="65,30 80,45 65,55" fill="rgba(6, 182, 212, 0.1)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="50,40 65,55 50,65" fill="rgba(6, 182, 212, 0.25)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="35,30 50,40 35,55" fill="rgba(6, 182, 212, 0.18)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="20,45 35,30 35,55" fill="rgba(6, 182, 212, 0.12)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="65,55 80,45 80,65" fill="rgba(6, 182, 212, 0.1)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="65,55 80,65 50,85" fill="rgba(6, 182, 212, 0.12)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="50,65 65,55 50,85" fill="rgba(6, 182, 212, 0.22)" stroke="#06B6D4" strokeWidth="0.5" />
                    <polygon points="35,55 50,65 50,85" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="0.5" />
                    <circle cx="50" cy="15" r="1.5" fill="#06B6D4" />
                    <circle cx="65" cy="30" r="1.5" fill="#06B6D4" />
                    <circle cx="35" cy="30" r="1.5" fill="#06B6D4" />
                    <circle cx="50" cy="40" r="1.5" fill="#06B6D4" />
                    <circle cx="80" cy="45" r="1.5" fill="#06B6D4" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 text-white text-[10px] font-mono tracking-widest uppercase">With 3D Glasses</div>
            </div>

            {/* Separator sliding line bar */}
            <div 
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={() => setIsSliderDragging(true)}
              className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-30"
            >
              {/* Drag button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 border border-neutral-200 shadow-md flex items-center justify-center text-[10px] font-black pointer-events-none select-none">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — WHAT'S INSIDE (FLOATING PRODUCT LAYOUT) */}
      <section id="inside" className="py-28 bg-white border-t border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">06 — What's Inside</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              Every Page holds a Discovery
            </h2>
            <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2">Space Explorer Collector Packaging</p>
          </div>

          {/* Floating cards layout */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Stereo Book", spec: "24 board pages", color: "from-blue-50 to-white" },
              { title: "3D Glasses", spec: "Premium anaglyph", color: "from-cyan-50/50 to-white" },
              { title: "Collector Box", spec: "Premium matte case", color: "from-slate-100 to-white" },
              { title: "Welcome Card", spec: "Volumetric greeting", color: "from-zinc-100 to-white" },
              { title: "Start Guide", spec: "Spatial instructions", color: "from-purple-50 to-white" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className={`p-6 rounded-2xl border border-neutral-100 bg-gradient-to-b ${item.color} shadow-sm flex flex-col justify-between min-h-[180px] relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-neutral-900/[0.01] border-b border-l border-neutral-100/40 rounded-bl-2xl" />
                <span className="text-[9px] font-mono text-neutral-400">ITEM 0{idx + 1}</span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 leading-tight">{item.title}</h3>
                  <p className="text-[10px] text-neutral-500 uppercase font-mono tracking-wider">{item.spec}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — DISCOVER AMAZING WORLDS */}
      <section className="py-28 bg-[#f5f5f7] border-t border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">07 — Discover Amazing Worlds</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              A Universe Waiting to Be Explored
            </h2>
          </div>

          {/* Large Editorial Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { char: "🌍", title: "Earth", text: "Our home from space." },
              { char: "🌕", title: "The Moon", text: "Our closest neighbour." },
              { char: "🚀", title: "Rocket Launch", text: "Watch history lift off." },
              { char: "🛰️", title: "Space Station", text: "See how astronauts live." },
              { char: "🪐", title: "Saturn", text: "The planet of spectacular rings." },
              { char: "⚡", title: "Jupiter", text: "Meet the giant of our Solar System." },
              { char: "☄️", title: "Asteroids", text: "Floating worlds of rock and metal." },
              { char: "🌌", title: "Beyond", text: "Every journey begins with curiosity." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[160px]"
              >
                <div className="text-3xl">{item.char}</div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">{item.title}</h3>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — DESIGNED FOR CURIOUS MINDS */}
      <section className="py-28 bg-white border-t border-neutral-100">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10 text-center space-y-16">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">08 — Designed for Curious Minds</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-5xl lg:text-[60px] font-black uppercase tracking-tight text-neutral-900 mt-4 leading-none"
            >
              Made for Curious Minds
            </h2>
          </div>

          {/* Large Typography layout */}
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto border-t border-neutral-100 pt-12">
            {[
              "24 beautifully illustrated pages.",
              "Designed for ages 6+.",
              "Comfortable stereoscopic viewing.",
              "Premium print quality.",
              "Includes anaglyph 3D glasses.",
              "Created for learning through exploration."
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-neutral-300 font-mono text-sm">0{idx + 1}</span>
                <span className="text-sm md:text-base font-bold text-neutral-800 leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — BUILT TO LAST */}
      <section className="py-28 bg-[#f5f5f7] border-t border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: photography representation */}
            <div className="aspect-square bg-white rounded-[2rem] border border-neutral-200 flex items-center justify-center p-12 shadow-sm">
              <svg className="w-full h-full text-neutral-100" viewBox="0 0 100 100">
                <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <rect x="25" y="25" width="50" height="50" rx="6" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <path d="M50,20 L50,80 M20,50 L80,50" stroke="currentColor" strokeWidth="0.25" />
              </svg>
            </div>

            {/* Right: bullets */}
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">09 — Built to Last</span>
              
              <h2 
                style={{ fontFamily: '"Afacad Flux", sans-serif' }}
                className="text-4xl lg:text-[50px] font-black uppercase tracking-tight text-neutral-900 leading-[0.95]"
              >
                Thick board pages.<br />Rounded corners.
              </h2>

              <ul className="space-y-3.5 pt-2">
                {[
                  { icon: Shield, title: "Premium Matte Finish", desc: "No glaring reflections under reading lamps." },
                  { icon: Award, title: "Durable Construction", desc: "Crafted to survive repeated exploration cycles." },
                  { icon: Heart, title: "Safe for Young Readers", desc: "Non-toxic ink matrices, rounded margins." }
                ].map((bullet, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 flex-shrink-0">
                      <bullet.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 leading-tight">{bullet.title}</h4>
                      <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">{bullet.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 10 — WATCH IT COME ALIVE (MOCK WIDESCREEN VIDEO) */}
      <section className="py-28 bg-white border-t border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">10 — Watch It Come Alive</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              Wonder Begins With One Page
            </h2>
          </div>

          {/* Mock Video Container */}
          <div className="w-full aspect-video md:max-h-[500px] bg-neutral-50 border border-neutral-100 rounded-[2.5rem] relative overflow-hidden shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-transparent to-transparent" />
            
            {/* Centered play mockup */}
            <div className="flex flex-col items-center gap-4 text-neutral-400 select-none">
              <div className="w-14 h-14 rounded-full border border-neutral-200 flex items-center justify-center bg-white shadow-md text-neutral-800">
                ▶
              </div>
              <span className="text-[9px] font-mono tracking-widest uppercase">AUTOPLAY SIMULATOR</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11 — CONTINUE YOUR JOURNEY (TEASERS) */}
      <section className="py-28 bg-[#f5f5f7] border-t border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">11 — Continue Your Journey</span>
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black uppercase tracking-tight text-neutral-900 mt-2"
            >
              Every Page holds a Discovery
            </h2>
          </div>

          {/* Silhouette coming soon grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Ocean Explorer", icon: "🌊" },
              { title: "Dinosaur Explorer", icon: "🦖" },
              { title: "Human Body", icon: "🫁" },
              { title: "Wildlife Explorer", icon: "🦊" }
            ].map((teaser, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-neutral-200 bg-white/40 backdrop-blur-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden"
              >
                {/* Silhouette filter overlay */}
                <div className="absolute inset-0 bg-neutral-900/[0.02] filter blur-xl" />
                <div className="text-2xl filter saturate-0 opacity-40">{teaser.icon}</div>
                <div className="space-y-1 relative z-10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">{teaser.title}</h3>
                  <span className="text-[9px] font-mono text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded uppercase">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 — READY FOR LIFT-OFF? */}
      <section className="py-32 bg-white border-t border-neutral-100 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">12 — Ready for Lift-Off?</span>
          
          <div className="space-y-4">
            <h2 
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-4xl md:text-6xl lg:text-[76px] font-black uppercase tracking-tight text-neutral-900 leading-none"
            >
              The Adventure Starts Here.
            </h2>
            <p className="text-neutral-500 text-base md:text-lg">
              Your first journey begins here.
            </p>
          </div>

          {/* Large product mockup representation */}
          <div className="w-full max-w-[500px] aspect-video bg-neutral-50 border border-neutral-200 rounded-[2rem] mx-auto shadow-md flex items-center justify-center text-neutral-400">
            <div className="flex flex-col items-center gap-3">
              <span className="text-xl">🪐 🚀 🕶️</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">SPACE EXPLORER COLLECTOR KIT</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => navigate('/checkout?product=space-explorer')}
              className="px-8 py-4 bg-neutral-900 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-neutral-800 hover:scale-[1.02] active:scale-98 transition-all shadow-md cursor-pointer"
            >
              Buy Now
            </button>
            <button
              onClick={() => navigate('/checkout?product=space-explorer')}
              className="px-8 py-4 border border-neutral-200 text-neutral-800 font-black uppercase tracking-widest text-xs rounded-full hover:bg-neutral-50 transition-all cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
