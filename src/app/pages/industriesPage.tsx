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
    <div className="min-h-screen bg-[#0D1B2A] text-white pb-24">

      {/* --- HERO HEADER WITH IMAGE --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070"
            alt="Immersive Digital Background"
            className="w-full h-full object-cover opacity-30"
          />
          {/* Gradient Overlay to blend image into the page background */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/20 via-[#0D1B2A]/60 to-[#0D1B2A]" /> */}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-white">
              INDUSTRIES WE <span className="bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] bg-clip-text text-transparent">SERVE</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
              Trusted by leading studios, platforms, creators, and brands worldwide
              for premium immersive content that redefines visual storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10 -mt-10">

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[#06B6D4]/30 transition-all duration-300 shadow-xl backdrop-blur-sm"
            >
              <div className="mb-6">
                <industry.icon className="w-10 h-10 text-[#06B6D4] group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
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
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-white/40 bg-white/5 rounded-full border border-white/5 group-hover:border-white/10 transition-colors"
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
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 text-center max-w-4xl mx-auto shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">DON'T SEE YOUR INDUSTRY?</h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto font-light text-lg leading-relaxed">
            We work with diverse clients across entertainment, education, and technology.
            Let's discuss your unique needs and create something groundbreaking.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#06B6D4] hover:bg-[#3B82F6] text-[#0D1B2A] rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
          >
            <MessageSquare className="w-5 h-5" />
            Start a Conversation
          </Link>
        </motion.div>
      </div>
    </div>
  );
}