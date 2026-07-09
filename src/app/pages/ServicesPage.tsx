import { motion } from 'motion/react';
import { Film, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const services = [
 {
 icon: Film,
 title: 'STEREO CONVERSION SERVICE',
 description: 'Transform standard 2D footage into a natural stereoscopic 3D experience with feature-length precision.',
 link: '/services/3d-movie-conversion'
 },
 {
 icon: BookOpen,
 title: '3D BOOK SERVICE',
 description: 'Premium 3D learning products for kids, combining education, interaction, and immersive visuals.',
 link: '/services/3d-books'
 }
];

export default function ServicesPage() {
 return (
 <div className="min-h-screen bg-white text-neutral-900 pt-24 md:pt-32 pb-24 selection:bg-indigo-100">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
 
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16 md:mb-20"
 >
 <div className="flex items-center justify-center gap-4 mb-4">
    <div className="h-px bg-indigo-500/30 w-8"></div>
    <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">What We Do</span>
    <div className="h-px bg-indigo-500/30 w-8"></div>
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-neutral-900">
 OUR <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">SERVICES</span>
 </h1>
 <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
 We deliver industry-leading spatial visual technology and immersive products.
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
 {services.map((service, index) => (
 <motion.div
 key={service.title}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: index * 0.1 }}
 className="group flex flex-col p-10 rounded-[2rem] bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-indigo-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
 >
 <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-full bg-white border border-neutral-100 shadow-sm group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-500">
    <service.icon className="w-8 h-8 text-neutral-400 group-hover:text-indigo-500 transition-colors" strokeWidth={2} />
 </div>
 
 <h3 className="text-2xl font-black mb-4 tracking-tight text-neutral-900 uppercase">
 {service.title}
 </h3>
 
 <p className="text-neutral-500 text-lg leading-relaxed mb-10 flex-grow">
 {service.description}
 </p>
 
 <div className="pt-6 border-t border-neutral-100 transition-colors">
 <Link 
 to={service.link}
 className="inline-flex items-center gap-2 text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
 >
 Learn More 
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
 </Link>
 </div>
 </motion.div>
 ))}
 </div>
 
 </div>
 </div>
 );
}
