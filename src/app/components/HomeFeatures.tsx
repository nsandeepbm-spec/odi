import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Layers, Cuboid, MonitorPlay, BookImage, 
  Blocks, Glasses, ArrowRight, type LucideIcon 
} from 'lucide-react';

// 1. Define Interfaces for your data
interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  size: string;
}

interface ProductItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

const whatWeDo: FeatureItem[] = [
  { 
    icon: Layers, 
    title: 'Stereo 3D Conversion', 
    desc: 'Transforming 2D content into high-quality stereoscopic 3D with industry-leading depth mapping.',
    size: 'col-span-1 md:col-span-2' 
  },
  { 
    icon: Cuboid, 
    title: 'Spatial Media', 
    desc: 'Future-ready immersive content for vision-led platforms.',
    size: 'col-span-1'
  },
  { 
    icon: MonitorPlay, 
    title: 'Immersive Content', 
    desc: 'Deeply engaging visual experiences that redefine depth.',
    size: 'col-span-1' 
  },
];

const products: ProductItem[] = [
  { icon: BookImage, title: 'ODI Kids 3D Books', desc: 'Premium 3D learning books that bring stories to life.', color: 'from-cyan-500 to-blue-600' },
  { icon: Blocks, title: '3D Learning Kits', desc: 'Interactive educational kits for schools and home learning.', color: 'from-purple-500 to-indigo-600' },
  { icon: Glasses, title: 'Anaglyph Content', desc: 'Classic visual experiences reimagined for the modern age.', color: 'from-pink-500 to-rose-600' },
];

// 2. Type-safe ProductCard Component
interface ProductCardProps {
  item: ProductItem;
  index: number;
}

function ProductCard({ item, index }: ProductCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Fix: Explicitly type the MouseEvent
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group h-[380px] w-full rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent p-[1px] backdrop-blur-xl border border-white/10"
    >
      <div className="relative h-full w-full rounded-[2.5rem] bg-[#0D1B2A]/80 p-8 overflow-hidden">
        <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.color} blur-[80px] opacity-10 group-hover:opacity-40 transition-opacity duration-500`} />
        
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex flex-col h-full">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-xl`}>
            <item.icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
          <p className="text-white/60 font-medium leading-relaxed">{item.desc}</p>
          
          <div className="mt-auto pt-4">
            <button className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-white uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              Explore <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HomeFeatures() {
  return (
    <section className="py-32 bg-[#020617] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e293b_0%,transparent_70%)] opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION 1: BENTO STYLE (What We Do) */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-16 border-l-2 border-cyan-500 pl-6"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic">
              WHAT WE DO 
            </h2>
            <p className="text-white/50 text-lg mt-4 max-w-xl">
              Pushing the boundaries of spatial media through advanced stereoscopic engineering.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whatWeDo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${item.size} group relative rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 backdrop-blur-2xl p-10 flex flex-col justify-end min-h-[300px]`}
              >
                <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                  <item.icon size={120} strokeWidth={1} className="text-cyan-400" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                  <p className="text-white/50 text-lg max-w-md">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: PRODUCT CARDS (Floating 3D) */}
        <div>
          <div className="flex flex-col items-center text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              OUR <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">PRODUCTS</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((item, index) => (
              <ProductCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}