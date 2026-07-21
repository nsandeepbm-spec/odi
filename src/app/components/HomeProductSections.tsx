import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';

interface ProductSection {
  id: string;
  image: string;
  alt: string;
  heading: string;
  subheading: string;
  description: string;
}

const sections: ProductSection[] = [
  {
    id: 'glasses',
    image: '/product-image/1.png',
    alt: 'Classic 3D Glasses',
    heading: 'Classic 3D Glasses.',
    subheading: 'Step into depth.',
    description: 'Experience the world like never before. Designed for comfort and immersive visual clarity, every journey feels incredibly real.',
  },
  {
    id: 'premium-glasses',
    image: '/product-image/2.png',
    alt: 'Premium Stereo Glasses',
    heading: 'Premium Stereo.',
    subheading: 'Built to last.',
    description: 'Upgrade to premium stereo glasses crafted from high-quality materials. Enjoy edge-to-edge sharpness and durable build quality.',
  },
  {
    id: 'cards',
    image: '/product-image/3.png',
    alt: 'Explorer Cards',
    heading: 'Explorer Cards.',
    subheading: 'Unlock every adventure.',
    description: 'Dive into a universe of possibilities. Each card reveals a unique interactive 3D environment waiting to be discovered by you.',
  },
  {
    id: 'bundle',
    image: '/product-image/4.png',
    alt: 'Full Bundle',
    heading: 'The Complete Kit.',
    subheading: 'All in one.',
    description: 'Get everything you need to start your journey. The ultimate bundle includes our premium glasses, the full collection of Explorer Cards, and exclusive access to new worlds.',
  },
];

function BuyLink({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover="hover"
      className="group inline-flex items-center gap-1 text-xl md:text-2xl font-medium tracking-tight transition-colors text-neutral-900 hover:text-neutral-500"
    >
      Buy Now
      <motion.span variants={{ hover: { x: 6 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
      </motion.span>
    </motion.button>
  );
}

function ProductBlock({ section, index }: { section: ProductSection; index: number }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  
  const bgClass = index % 2 === 0 ? 'bg-[#ffffff]' : 'bg-[#f5f5f7]';

  return (
    <section 
      ref={ref}
      id={section.id} 
      className={`relative w-full min-h-screen flex flex-col justify-center overflow-hidden ${bgClass} text-black border-b border-neutral-100 last:border-b-0`}
    >
      <div className="max-w-[1600px] mx-auto px-6 w-full flex flex-col items-center text-center pt-40 pb-32 md:pt-48 md:pb-40">
        
        {/* Text Content */}
        <motion.div 
          style={{ opacity }}
          className="flex flex-col items-center z-10 max-w-4xl mb-16 md:mb-24"
        >
          <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-semibold tracking-[-0.05em] leading-[1.05] mb-4 text-neutral-900">
            {section.heading}
          </h2>
          <h3 className="text-3xl md:text-5xl font-medium tracking-[-0.02em] mb-8 text-neutral-400">
            {section.subheading}
          </h3>
          <p className="text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl text-neutral-500 font-light tracking-wide">
            {section.description}
          </p>
          <BuyLink onClick={() => navigate('/checkout?product=space-explorer')} />
        </motion.div>

        {/* Product Image */}
        <motion.div 
          style={{ y }}
          className="relative z-0 flex items-center justify-center w-full"
        >
          <div className="relative w-full max-w-[1200px] flex items-center justify-center">
            
            {/* Custom Colored Shadow for Glasses - ultra soft */}
            {section.id === 'glasses' && (
              <div className="absolute bottom-2 md:bottom-8 left-[55%] md:left-[60%] -translate-x-1/2 w-[85%] h-16 md:h-24 flex justify-between items-center blur-[30px] md:blur-[60px] opacity-60 pointer-events-none z-0">
                 {/* Red shadow on the left */}
                 <div className="w-[45%] h-full bg-[#ff2a2a] rounded-[100%]" />
                 {/* Center dark grounding shadow */}
                 <div className="w-[25%] h-full bg-black/40 rounded-[100%] absolute left-1/2 -translate-x-1/2" />
                 {/* Blue shadow on the right */}
                 <div className="w-[45%] h-full bg-[#0099ff] rounded-[100%]" />
              </div>
            )}
            
            {/* Standard Premium Shadow for others - ultra soft */}
            {section.id !== 'glasses' && (
              <div className="absolute bottom-2 md:bottom-8 left-[55%] md:left-[60%] -translate-x-1/2 w-[75%] h-12 md:h-20 bg-black/15 blur-[30px] md:blur-[50px] rounded-[100%] pointer-events-none z-0" />
            )}

            <img
              src={section.image}
              alt={section.alt}
              className="relative z-10 w-full h-auto object-contain scale-[1.15] md:scale-[1.3] lg:scale-[1.4] hover:scale-[1.45] transition-transform duration-[1.5s] ease-out"
              style={{
                filter: "drop-shadow(0px 30px 40px rgba(0, 0, 0, 0.15)) drop-shadow(0px 15px 15px rgba(0, 0, 0, 0.1))"
              }}
              loading="lazy"
            />
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}

export function HomeProductSections() {
  return (
    <div className="w-full">
      {sections.map((section, index) => (
        <ProductBlock key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
