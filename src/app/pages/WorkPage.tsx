import { motion } from 'motion/react';
import { Sparkles, Eye, Image as ImageIcon } from 'lucide-react';

import WitnessImg from '../images/Witness.png';
import BringingImg from '../images/Bringing.png';
import DepthImg from '../images/Depth.png';

const showcaseItems = [
 {
 icon: Eye,
 image: WitnessImg,
 title: 'Before / After',
 description: 'Witness the transformation of flat visuals into stunning stereoscopic environments with our interactive comparisons.',
 color: 'from-[#06B6D4] to-[#3B82F6]'
 },
 {
 icon: ImageIcon,
 image: BringingImg,
 title: '2D → 3D Conversion',
 description: 'Bringing legacy media to life through meticulous rotoscoping, depth mapping, and painting.',
 color: 'from-[#8B5CF6] to-[#7C3AED]'
 },
 {
 icon: Sparkles,
 image: DepthImg,
 title: 'Depth Examples',
 description: 'Explore the precision of our depth pipeline designed for cinematic and immersive accuracy.',
 color: 'from-[#FF6B9D] to-[#FFB800]'
 }
];

export default function WorkPage() {
 return (
 <div className="min-h-screen bg-white text-neutral-900 pt-24 md:pt-32 pb-24 selection:bg-indigo-100">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16 md:mb-24"
 >
 <div className="flex items-center justify-center gap-4 mb-4">
    <div className="h-px bg-indigo-500/30 w-8"></div>
    <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">Portfolio</span>
    <div className="h-px bg-indigo-500/30 w-8"></div>
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-neutral-900">
 OUR <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">WORK</span>
 </h1>
 <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-3xl mx-auto leading-relaxed">
 Our work focuses on creating visually immersive experiences with precision and quality.
 </p>
 </motion.div>

 <div className="grid md:grid-cols-3 gap-8">
 {showcaseItems.map((item, index) => (
 <motion.div
 key={item.title}
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: index * 0.15 }}
 className="relative group rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
 >
 {/* Card Image */}
 <div className="aspect-video bg-neutral-100 relative overflow-hidden">
 <img
 src={item.image}
 alt={item.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500" />
 </div>
 
 <div className="p-8">
 <h3 className="text-2xl font-bold mb-4 text-neutral-900">{item.title}</h3>
 <p className="text-neutral-500 leading-relaxed text-base">
 {item.description}
 </p>
 </div>
 
 </motion.div>
 ))}
 </div>

 {/* Our Process Section */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mt-32 pt-16 border-t border-neutral-100"
 >
 <div className="text-center mb-16">
 <h2 className="text-4xl md:text-5xl font-black mb-6 text-neutral-900 tracking-tight">
 Our Process.
 </h2>
 <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium">
 We employ a meticulous, step-by-step approach to ensure the highest quality stereoscopic 3D conversion and VFX integration for every frame.
 </p>
 </div>

 <div className="grid md:grid-cols-4 gap-6">
 {[
 { step: '01', title: 'Analysis', desc: 'Evaluating source footage and defining the depth budget and creative vision.' },
 { step: '02', title: 'Roto & Prep', desc: 'Precise rotoscoping and clean-plating to isolate elements for spatial manipulation.' },
 { step: '03', title: 'Depth Mapping', desc: 'Assigning accurate volumetric depth to every object in the scene.' },
 { step: '04', title: 'Compositing', desc: 'Seamlessly integrating all elements into a stunning, immersive final stereo render.' }
 ].map((process, idx) => (
 <motion.div
 key={process.step}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: idx * 0.15 }}
 className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
 >
 <div className="text-5xl font-black text-neutral-100 mb-6 group-hover:text-indigo-50 transition-colors duration-500">
 {process.step}
 </div>
 <h3 className="text-xl font-bold mb-3 text-neutral-900">{process.title}</h3>
 <p className="text-neutral-500 text-sm leading-relaxed">
 {process.desc}
 </p>
 </motion.div>
 ))}
 </div>
 </motion.div>
 </div>
 </div>
 );
}
