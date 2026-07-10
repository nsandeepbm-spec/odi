import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';

interface ProductSection {
  id: string;
  image: string;
  alt: string;
  heading: string;
  description: string;
  align: 'left' | 'right';
  tall?: boolean;
}

const sections: ProductSection[] = [
  {
    id: 'glasses',
    image: '/1-Glasses_Home%20Page.png',
    alt: 'Classic 3D Glasses',
    heading: 'Put on the glasses. Step into depth.',
    description: 'Experience the world like never before with our classic 3D glasses. Designed for comfort and immersive visual clarity, every journey feels incredibly real.',
    align: 'left',
  },
  {
    id: 'premium-glasses',
    image: '/2-cardboard_homepage.png',
    alt: 'Premium Stereo Glasses',
    heading: 'Built for sharper stereo. Made to last.',
    description: 'Upgrade to premium stereo glasses crafted from high-quality materials. Enjoy edge-to-edge sharpness and durable build quality that stands the test of time.',
    align: 'right',
  },
  {
    id: 'cards',
    image: '/3-Card_Homepage.png',
    alt: 'Explorer Cards',
    heading: 'Collect every world. Unlock every adventure.',
    description: 'Dive into a universe of possibilities with Explorer Cards. Each card reveals a unique interactive 3D environment waiting to be discovered by you.',
    align: 'left',
  },
  {
    id: 'bundle',
    image: '/4-Bundle_homepage.png',
    alt: 'Full Bundle',
    heading: 'The complete Space Explorer kit. All in one.',
    description: 'Get everything you need to start your journey. The ultimate bundle includes our premium glasses, the full collection of Explorer Cards, and exclusive access to new worlds.',
    align: 'right',
    tall: true,
  },
];

function BuyNowButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(17,17,17,0.15)' }}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase bg-neutral-900 text-white hover:bg-cyan-600 transition-colors duration-300 shadow-lg"
    >
      Buy Now
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  );
}

function ProductBlock({ section }: { section: ProductSection }) {
  const navigate = useNavigate();
  const isLeft = section.align === 'left';

  return (
    <section id={section.id} className="w-full py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[92%] md:max-w-7xl mx-auto flex flex-col">
        
        {/* Top Text Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full flex flex-col mb-10 md:mb-12 items-start text-left"
        >
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent leading-[1.1] tracking-tight w-full"
            style={{ fontFamily: "'Afacad Flux', sans-serif" }}
          >
            {section.heading}
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-neutral-600 max-w-2xl leading-relaxed">
            {section.description}
          </p>
        </motion.div>

        {/* Premium Image Showcase with Overlay Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-neutral-100/50 bg-neutral-50 group mb-8 md:mb-12"
        >
          <img
            src={section.image}
            alt={section.alt}
            className="w-full h-auto object-cover object-center transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
            loading="lazy"
          />
          
          {/* Button inside the image card (Desktop only) */}
          <div className="hidden md:flex absolute bottom-10 left-10 z-10 flex-wrap items-center gap-4">
            <BuyNowButton onClick={() => navigate('/checkout?product=space-explorer')} />
          </div>
        </motion.div>

        {/* Button below the image card (Mobile only) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex md:hidden w-full justify-start mt-2 mb-8"
        >
          <BuyNowButton onClick={() => navigate('/checkout?product=space-explorer')} />
        </motion.div>

      </div>
    </section>
  );
}

export function HomeProductSections() {
  return (
    <div className="w-full bg-white">
      {sections.map((section) => (
        <ProductBlock key={section.id} section={section} />
      ))}
    </div>
  );
}
