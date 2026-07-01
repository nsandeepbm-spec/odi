import { motion } from 'motion/react';
import { 
 Film, 
 Tv, 
 Users, 
 Sparkles, 
 Music, 
 FileText, 
 ArrowRight,
 MessageSquare
} from 'lucide-react';
import { Link } from 'react-router';

const industries = [
 {
 icon: Tv,
 title: 'OTT PLATFORMS',
 description: 'Streaming content optimization for Netflix, Apple TV+, Disney+, and emerging immersive platforms looking to lead the market.',
 tags: ['Series & Originals', 'Catalog Enhancement', 'Premium Tiers'],
 link: '/industries/ott-platforms'
 },
 {
 icon: Film,
 title: 'FILM STUDIOS',
 description: 'Feature films, theatrical releases, and premium content for major studios and independent filmmakers seeking depth.',
 tags: ['Feature Films', 'Theatrical Distribution', 'Archive Projects'],
 link: '/industries/film-studios'
 },
 {
 icon: Sparkles,
 title: 'ADVERTISING AGENCIES',
 description: 'High-impact brand campaigns, commercials, and experiential content that drives engagement through spatial storytelling.',
 tags: ['TV Commercials', 'Brand Films', 'Product Launches'],
 link: '/industries/advertising-agencies'
 },
 {
 icon: Users,
 title: 'CREATORS & INFLUENCERS',
 description: 'Stand out on social media with immersive reels, shorts, and modern vertical content designed for the next gen of mobile viewing.',
 tags: ['Instagram Reels', 'YouTube Shorts', 'TikTok Content'],
 link: '/industries/creators-influencers'
 },
 {
 icon: FileText,
 title: 'DOCUMENTARY TEAMS',
 description: 'Bring educational and documentary content to life with depth that enhances storytelling and audience immersion.',
 tags: ['Nature Docs', 'Educational Content', 'Cultural Films'],
 link: '/industries/documentary-teams'
 },
 {
 icon: Music,
 title: 'MUSIC LABELS',
 description: 'Transform music videos into immersive experiences for artists, labels, and streaming platforms to connect with fans.',
 tags: ['Music Videos', 'Concert Films', 'Visual Albums'],
 link: '/industries/music-labels'
 }
];

export default function IndustriesPage() {
 return (
 <div className="min-h-screen bg-[#0D1B2A] text-white pt-28 md:pt-36 pb-24">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
 
 {/* --- HERO BANNER SECTION --- */}
 <motion.section 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-20 border border-white/10 shadow-2xl"
 >
 {/* Background Image - Cinematic & High Tech */}
 <img 
 src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=2070"
 alt="Cinematic Industry Header"
 className="absolute inset-0 w-full h-full object-cover"
 />
 
 {/* Professional Overlay Gradients */}
 <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/40 to-transparent"/>
 <div className="absolute inset-0 bg-black/30"/>

 {/* Content inside the Banner */}
 <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.2, duration: 0.6 }}
 >
 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
 INDUSTRIES WE <span className="bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] bg-clip-text text-transparent">SERVE</span>
 </h1>
 <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
 Trusted by leading studios and creators worldwide for premium immersive content and spatial technology.
 </p>
 </motion.div>
 </div>
 </motion.section>

 {/* --- INDUSTRIES GRID --- */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {industries.map((industry, index) => (
 <motion.div
 key={industry.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: index * 0.1 }}
 className="group flex flex-col p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#06B6D4]/30 transition-all duration-500 shadow-lg"
 >
 <div className="mb-6">
 <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-[#06B6D4]/10 transition-colors">
 <industry.icon className="w-8 h-8 text-[#06B6D4] group-hover:scale-110 transition-transform duration-300"strokeWidth={1.5} />
 </div>
 </div>
 
 <h3 className="text-xl font-bold mb-4 tracking-wider text-white uppercase">
 {industry.title}
 </h3>
 
 <p className="text-white/50 text-base leading-relaxed mb-8 font-light flex-grow">
 {industry.description}
 </p>
 
 <div className="flex flex-wrap gap-2 mb-8 mt-auto">
 {industry.tags.map(tag => (
 <span 
 key={tag}
 className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white/40 bg-white/5 rounded-md border border-white/5 group-hover:border-[#06B6D4]/20 transition-colors"
 >
 {tag}
 </span>
 ))}
 </div>
 
 <div className="pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors">
 <Link 
 to={industry.link}
 className="inline-flex items-center gap-2 text-sm font-semibold text-[#06B6D4] hover:text-[#3B82F6] transition-colors group/link"
 >
 Explore Industry 
 <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"/>
 </Link>
 </div>
 </motion.div>
 ))}
 </div>

 {/* --- CTA SECTION --- */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="mt-32 p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 text-center relative overflow-hidden"
 >
 {/* Subtle Glow Effect */}
 <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#06B6D4]/10 blur-[100px]"/>
 
 <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">DON'T SEE YOUR INDUSTRY?</h2>
 <p className="text-white/50 mb-10 max-w-2xl mx-auto font-light text-lg">
 Our technology is adaptable across entertainment, medical, architecture, and education. Let's build your custom immersive solution.
 </p>
 <Link 
 to="/contact"
 className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0D1B2A] hover:bg-[#06B6D4] hover:text-white rounded-full font-bold transition-all duration-300 shadow-xl"
 >
 <MessageSquare className="w-5 h-5"/>
 Start a Conversation
 </Link>
 </motion.div>
 </div>
 </div>
 );
}