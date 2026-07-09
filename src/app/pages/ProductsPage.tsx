import { motion } from 'motion/react';
import { BookOpen, Map, PawPrint, Waves, Glasses, Cuboid } from 'lucide-react';

export default function ProductsPage() {
 return (
 <div className="min-h-screen bg-white text-neutral-900 pt-24 md:pt-32 pb-20 overflow-hidden selection:bg-indigo-100">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
 
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16"
 >
 <div className="flex items-center justify-center gap-4 mb-4">
    <div className="h-px bg-indigo-500/30 w-8"></div>
    <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">Shop</span>
    <div className="h-px bg-indigo-500/30 w-8"></div>
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
 PRODUCTS
 </h1>
 <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
 Discover our premium 3D learning books and kits designed for immersive education.
 </p>
 </motion.div>

 {/* ODI Kids Section */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="mb-24"
 >
 <div className="flex items-center gap-4 mb-8 justify-center">
 <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
    <BookOpen className="w-6 h-6 text-indigo-500"/>
 </div>
 <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Kids Collection</h2>
 </div>
 
 <div className="grid md:grid-cols-3 gap-6">
 {[
 { icon: Map, title: 'Space Explorer', color: 'group-hover:text-cyan-500' },
 { icon: PawPrint, title: 'Dino World', color: 'group-hover:text-emerald-500' },
 { icon: Waves, title: 'Ocean Depths', color: 'group-hover:text-indigo-500' }
 ].map((product) => (
 <motion.div
 key={product.title}
 className="relative overflow-hidden rounded-3xl bg-neutral-50 border border-neutral-100 p-8 text-center group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
 >
 <div className="w-20 h-20 mx-auto rounded-full bg-white border border-neutral-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
 <product.icon className={`w-8 h-8 text-neutral-400 transition-colors duration-500 ${product.color}`}/>
 </div>
 <h3 className="text-xl font-bold mb-2 text-neutral-900">{product.title}</h3>
 <p className="text-neutral-500 text-sm font-medium">Interactive 3D Book Kit</p>
 </motion.div>
 ))}
 </div>
 </motion.div>

 {/* Additional Offerings */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, delay: 0.4 }}
 >
 <div className="text-center mb-10">
    <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
    Additional Offerings
    </h2>
 </div>
 <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
 <div className="flex gap-6 p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-lg transition-all duration-300">
 <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 flex items-center justify-center flex-shrink-0 shadow-sm">
    <Glasses className="w-6 h-6 text-indigo-500"/>
 </div>
 <div>
 <h3 className="text-xl font-bold mb-2 text-neutral-900">Anaglyph Visual Content</h3>
 <p className="text-neutral-500 leading-relaxed text-sm">Classic anaglyph visual experiences tailored for impactful learning.</p>
 </div>
 </div>
 <div className="flex gap-6 p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-lg transition-all duration-300">
 <div className="w-14 h-14 rounded-full bg-white border border-neutral-100 flex items-center justify-center flex-shrink-0 shadow-sm">
    <Cuboid className="w-6 h-6 text-purple-500"/>
 </div>
 <div>
 <h3 className="text-xl font-bold mb-2 text-neutral-900">Interactive 3D Experiences</h3>
 <p className="text-neutral-500 leading-relaxed text-sm">Next-generation immersive kits that engage and educate.</p>
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 );
}
