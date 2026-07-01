import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function HeroIntro() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const slides = [
    {
      src: "/ODI_SS1.mp4",
      heading: "Books That Feel Alive.",
      description: "Experience stories in a whole new dimension."
    },
    {
      src: "/ODI_SS2.mp4",
      heading: "Every Frame Has Depth.",
      description: "Precision stereoscopic conversion for premium content."
    },
    {
      src: "/ODI_SS3.mp4",
      heading: "Advertising That Stops People.",
      description: "Create unforgettable display experiences with stereoscopic depth."
    }
  ];

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
      {/* Background with Fade Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full flex flex-col justify-center"
          >
            <video
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
            >
              <source src={slides[currentVideoIndex].src} type="video/mp4" />
            </video>
            
            {/* Minimal shadow in bottom only for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

            {/* Slide Content Overlay - Bottom Left Corner */}
            <div className="relative z-20 px-6 md:px-10 lg:px-16 pb-12 md:pb-16 lg:pb-20 w-full max-w-[1400px] mx-auto pointer-events-none text-left flex flex-col justify-end h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
              >
                <h2 
                  style={{ fontFamily: '"Afacad Flux", sans-serif' }}
                  className="text-4xl md:text-5xl lg:text-[56px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#2997ff] via-[#4f46e5] to-[#a259ff] mb-4 tracking-tight leading-[1.05]"
                >
                  {slides[currentVideoIndex].heading}
                </h2>
                <p 
                  style={{ fontFamily: '"Afacad Flux", sans-serif' }}
                  className="text-base md:text-lg lg:text-[18px] text-[#e2e2e2] font-semibold max-w-lg leading-[1.5] tracking-wide"
                >
                  {slides[currentVideoIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll indicator - Ultra Minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"
        />
      </motion.div>
    </section>
  );
}