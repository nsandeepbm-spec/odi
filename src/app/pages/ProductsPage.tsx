import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Target, Layers } from 'lucide-react';
import { Link } from 'react-router';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

export default function ProductsPage() {
  const products = [
    {
      title: 'Space Explorer',
      description: 'Journey through the cosmos in immersive 3D. A complete interactive kit for kids.',
      image: '/Book Mockup3.png', // Reusing the book mockup from checkout
      price: '₹1299',
      features: ['3D Glasses Included', 'Interactive Cards', 'Fact Book'],
      tag: 'Bestseller',
      isAvailable: true
    },
    {
      title: 'Dino World',
      description: 'Step back in time and walk with the dinosaurs in stunning stereoscopic depth.',
      image: '/Dino World.png',
      price: 'Coming Soon',
      features: ['3D Glasses Included', 'Fossil Guide', 'Sticker Set'],
      tag: 'Coming Soon',
      isAvailable: false
    },
    {
      title: 'Ocean Depths',
      description: 'Dive into the deep blue and discover marine life popping right off the page.',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1000&auto=format&fit=crop', // Temporary placeholder for ocean
      price: 'Coming Soon',
      features: ['3D Glasses Included', 'Marine Facts', 'Glow-in-the-dark Poster'],
      tag: 'Coming Soon',
      isAvailable: false
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-32 selection:bg-indigo-100" style={{ background: T.bg, color: T.text }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Products that pop.
          </h1>
          <p className="text-xl leading-relaxed font-medium" style={{ color: T.sub }}>
            Discover our premium 3D learning books and interactive kits. Designed to make education an immersive adventure.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="space-y-32">
          {products.map((product, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={product.title} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
                
                {/* Image Side */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative rounded-[2.5rem] p-8 md:p-16 flex items-center justify-center overflow-hidden group" style={{ background: T.bgAlt }}>
                    <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                      {product.tag}
                    </div>
                    {/* Using object-contain or cover based on if it's the transparent mockup or an unsplash image */}
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className={`w-full max-w-sm transition-transform duration-700 group-hover:scale-105 ${product.title === 'Space Explorer' ? 'drop-shadow-2xl object-contain' : 'rounded-2xl object-cover h-[400px]'}`}
                    />
                  </div>
                </motion.div>

                {/* Text Side */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full lg:w-1/2 space-y-8"
                >
                  <div>
                    <h2 className="text-4xl font-black tracking-tight mb-4">{product.title}</h2>
                    <p className="text-lg leading-relaxed" style={{ color: T.sub }}>{product.description}</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t" style={{ borderColor: T.border }}>
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="font-bold text-sm" style={{ color: T.text }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 flex items-center gap-6">
                    <span className="text-2xl font-black">{product.price}</span>
                    {product.isAvailable ? (
                      <Link 
                        to="/checkout"
                        className="px-8 py-4 rounded-full bg-neutral-900 text-white text-xs font-black tracking-widest uppercase hover:-translate-y-1 transition-transform flex items-center gap-2 shadow-xl"
                      >
                        Buy Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button 
                        onClick={() => alert('You will be notified when this is available!')}
                        className="px-8 py-4 rounded-full border border-neutral-200 text-neutral-900 text-xs font-black tracking-widest uppercase hover:bg-neutral-50 transition-colors flex items-center gap-2"
                      >
                        Notify Me
                      </button>
                    )}
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
