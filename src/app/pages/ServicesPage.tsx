import { motion } from 'motion/react';
import { Box, Film, Smartphone, Eye, Layers, Headset, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const services = [
 {
 icon: Box,
 title: '3D MOVIE CONVERSION',
 description: 'Feature-length cinematic depth conversion with frame-by-frame precision. Perfect for theatrical releases and premium streaming.',
 tags: ['Feature Films', 'High-End Quality', 'Theatrical Grade'],
 link: '/services/3d-movie-conversion'
 },
 {
 icon: Film,
 title: '3D SHORT FILMS',
 description: '1-6 minute short films changed for the better into immersive 3D experiences with artistic depth grading.',
 tags: ['1-6 Minutes', 'Festival Ready', 'Artistic Depth'],
 link: '/services/3d-short-films'
 },
 {
 icon: Smartphone,
 title: '3D REELS & VERTICAL CONTENT',
 description: 'Transform Instagram Reels, YouTube Shorts, and TikTok content into immersive vertical experiences.',
 tags: ['Vertical Format', 'Social Media', 'Quick Turnaround'],
 link: '/services/3d-reels-vertical'
 },
 {
 icon: Eye,
 title: 'IMMERSIVE ADVERTISING',
 description: 'Brand films and commercials with spatial depth that capture attention and drive engagement.',
 tags: ['Brand Films', 'Commercials', 'High Impact'],
 link: '/services/immersive-advertising'
 },
 {
 icon: Layers,
 title: 'DEPTH COMPOSITING & CLEANUP',
 description: 'Professional stereo cleanup, depth refinement, and technical quality assurance for any 3D project.',
 tags: ['Stereo Cleanup', 'Quality Assurance', 'Technical Excellence'],
 link: '/services/depth-compositing'
 },
 {
 icon: Headset,
 title: 'VR / VISION PRO CONTENT PREP',
 description: 'Content optimization and preparation for Apple Vision Pro, Meta Quest, and modern immersive platforms.',
 tags: ['Vision Pro Ready', 'VR Made Smoother',"Prepared for What's Coming"],
 link: '/services/vr-vision-pro'
 }
];

export default function ServicesPage() {
 return (
 <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
 
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16 md:mb-20"
 >
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-white">
 OUR <span className="bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] bg-clip-text text-transparent">SERVICES</span>
 </h1>
 <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto">
 We deliver industry-leading spatial visual technology and conversion services for the next generation of media.
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
 {services.map((service, index) => (
 <motion.div
 key={service.title}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: index * 0.1 }}
 className="group flex flex-col p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#06B6D4]/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
 >
 <div className="mb-6">
 <service.icon className="w-10 h-10 text-[#06B6D4] group-hover:scale-110 transition-transform duration-300"strokeWidth={1.5} />
 </div>
 
 <h3 className="text-xl font-bold mb-4 tracking-wide text-white uppercase">
 {service.title}
 </h3>
 
 <p className="text-white/50 text-base leading-relaxed mb-8 font-light flex-grow">
 {service.description}
 </p>
 
 <div className="flex flex-wrap gap-2 mb-8 mt-auto">
 {service.tags.map(tag => (
 <span 
 key={tag}
 className="px-3 py-1.5 text-xs font-medium text-white/50 bg-white/5 rounded-full border border-white/5 group-hover:border-white/10 transition-colors"
 >
 {tag}
 </span>
 ))}
 </div>
 
 <div className="pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
 <Link 
 to={service.link}
 className="inline-flex items-center gap-2 text-sm font-semibold text-[#06B6D4] hover:text-[#3B82F6] transition-colors"
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
