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
 <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-20">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16 md:mb-24"
 >
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#06B6D4] to-[#FF6B9D] bg-clip-text text-transparent">
 WORK / PORTFOLIO
 </h1>
 <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
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
 className="relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10"
 >
 {/* Card Image */}
 <div className="aspect-video bg-[#1B263B] relative overflow-hidden">
 <img
 src={item.image}
 alt={item.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
 />
 <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-30 transition-opacity duration-300`} />
 </div>
 
 <div className="p-8">
 <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
 <p className="text-white/60 leading-relaxed">
 {item.description}
 </p>
 </div>
 
 {/* Bottom Glow */}
 <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`} />
 </motion.div>
 ))}
 </div>

 {/* Our Process Section */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="mt-32"
 >
 <div className="text-center mb-16">
 <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
 Our Process
 </h2>
 <div className="w-24 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] mx-auto rounded-full mb-8"/>
 <p className="text-lg text-white/70 max-w-2xl mx-auto">
 We employ a meticulous, step-by-step approach to ensure the highest quality stereoscopic 3D conversion and VFX integration for every frame.
 </p>
 </div>

 <div className="grid md:grid-cols-4 gap-8">
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
 className="bg-[#1B263B]/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group"
 >
 <div className="text-5xl font-extrabold text-white/5 mb-6 group-hover:text-white/10 transition-colors duration-300">
 {process.step}
 </div>
 <h3 className="text-xl font-bold mb-4 text-white/90">{process.title}</h3>
 <p className="text-white/60 text-sm leading-relaxed">
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
