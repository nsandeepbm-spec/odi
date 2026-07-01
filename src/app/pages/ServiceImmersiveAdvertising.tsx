import { motion } from 'motion/react';
import { Megaphone, Target, Rocket, BarChart3, Check, Users } from 'lucide-react';

export default function ServiceImmersiveAdvertising() {
 return (
 <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24">
 <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">

 {/* 1. Hero Section */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="relative overflow-hidden rounded-[2rem] bg-[#0A111A]/80 border border-white/5 shadow-2xl flex flex-col md:flex-row items-stretch min-h-[420px]"
 >
 {/* Left content */}
 <div className="p-10 md:p-16 lg:w-1/2 relative z-10 flex flex-col justify-center">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 flex items-center justify-center mb-8 border border-[#06B6D4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
 <Megaphone className="w-7 h-7 text-[#06B6D4]"strokeWidth={1.5} />
 </div>

 <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
 Immersive Advertising
 </h1>

 <h2 className="text-xl text-white/80 font-medium mb-6 leading-snug">
 Brand films and commercials with spatial depth that capture attention
 </h2>

 <p className="text-white/60 text-lg leading-relaxed font-light mb-10">
 Stand out in the crowded advertising landscape with immersive 3D commercials and brand films. Perfect for TV spots, digital campaigns, product launches, and experiential marketing — crafted with the precision that ODI is known for.
 </p>

 <div className="flex flex-wrap gap-4">
 <button className="px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.3)]">
 Start Your Campaign
 </button>
 <button className="px-7 py-3 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
 View Portfolio
 </button>
 </div>
 </div>

 {/* Right image */}
 <div className="w-full lg:w-1/2 h-[340px] lg:h-auto relative">
 <div className="absolute inset-0 bg-gradient-to-r from-[#0A111A] via-[#0A111A]/40 to-transparent z-10"/>
 <img
 src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
 alt="Immersive Advertising"
 className="absolute inset-0 w-full h-full object-cover object-center"
 />
 </div>
 </motion.section>

 {/* 2. Stats Row */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="grid grid-cols-1 md:grid-cols-3 gap-6"
 >
 {[
 { icon: BarChart3, stat: '3x', label: 'Higher Brand Recall' },
 { icon: Users, stat: '85%', label: 'Viewer Engagement' },
 { icon: Rocket, stat: '2x', label: 'Campaign Performance' }
 ].map((item, i) => (
 <div key={i} className="rounded-[1.5rem] bg-[#0A111A]/80 border border-white/5 p-8 flex flex-col items-center text-center hover:border-[#06B6D4]/30 transition-colors group">
 <item.icon className="w-8 h-8 text-[#06B6D4] mb-4 group-hover:scale-110 transition-transform"strokeWidth={1.5} />
 <div className="text-4xl font-black text-white mb-2">{item.stat}</div>
 <div className="text-white/50 text-sm uppercase tracking-wider font-medium">{item.label}</div>
 </div>
 ))}
 </motion.section>

 {/* 3. Campaign-Ready Solutions */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row"
 >
 {/* Left images mosaic */}
 <div className="md:w-2/5 relative min-h-[360px]">
 <img
 src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
 alt="Campaign Production"
 className="absolute inset-0 w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A111A]/80"/>
 </div>

 {/* Right feature list */}
 <div className="md:w-3/5 bg-[#0A111A] p-10 md:p-14 flex flex-col justify-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase">
 Campaign-Ready Solutions
 </h2>
 <div className="grid md:grid-cols-2 gap-y-5 gap-x-10">
 {[
 'TV commercials (15–60 sec)',
 'Brand films (1–5 min)',
 'Product showcases',
 'High-impact visuals',
 'Campaign-ready delivery',
 'Multi-platform optimisation',
 'Fast agency turnaround',
 'Creative collaboration'
 ].map((feature, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-5 h-5 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center shrink-0">
 <Check className="w-3 h-3 text-[#06B6D4]"strokeWidth={3} />
 </div>
 <span className="text-white/70 font-medium text-sm">{feature}</span>
 </div>
 ))}
 </div>
 </div>
 </motion.section>

 {/* 4. Collaborative Process */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-14 shadow-lg"
 >
 <h2 className="text-2xl md:text-3xl font-bold mb-12 tracking-wide uppercase text-center">
 Collaborative Process
 </h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
 {[
 { num: '1', title: 'Brand Alignment', desc: 'Understand goals & audience' },
 { num: '2', title: 'Depth Strategy', desc: 'Custom depth grading' },
 { num: '3', title: 'Premium Conversion', desc: 'High-end production' },
 { num: '4', title: 'Agency Review', desc: 'Collaborative refinement' },
 { num: '5', title: 'Campaign Delivery', desc: 'All formats ready' }
 ].map((step, i) => (
 <div key={i} className="relative flex flex-col p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-[#06B6D4]/30 transition-colors group">
 <span className="text-3xl font-black text-[#06B6D4]/40 group-hover:text-[#06B6D4]/60 transition-colors mb-4">{step.num}</span>
 <h3 className="text-white font-bold mb-2 text-base">{step.title}</h3>
 <p className="text-white/50 text-sm font-light leading-relaxed">{step.desc}</p>
 </div>
 ))}
 </div>
 </motion.section>

 {/* 5. Package + Get Started */}
 <div className="grid lg:grid-cols-2 gap-8">

 {/* Complete Campaign Package */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg"
 >
 <h2 className="text-xl md:text-2xl font-bold mb-8 tracking-wide uppercase">
 Complete Campaign Package
 </h2>
 <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
 {[
 '3D commercial/brand film',
 'Broadcast-ready masters',
 'Digital/social versions',
 'Cinema/theatrical DCP',
 'Experiential/event files',
 '2D backup versions',
 'Asset library access',
 'Campaign toolkit'
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-[#06B6D4] shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.5)]"/>
 <span className="text-white/70 font-medium text-sm">{item}</span>
 </div>
 ))}
 </div>
 </motion.section>

 {/* Get Started card */}
 <motion.section
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.15 }}
 className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 shadow-lg flex flex-col justify-between"
 >
 <div>
 <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wide uppercase">
 Get Started
 </h2>
 <p className="text-white/60 font-light leading-relaxed mb-10">
 Contact us to discuss your advertising project and receive a custom estimate tailored to your campaign goals, timeline, and deliverables.
 </p>
 </div>

 <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8">
 <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 block">Pricing</span>
 <h3 className="text-3xl font-black mb-4">Custom Quote</h3>
 <p className="text-white/60 font-light text-sm leading-relaxed mb-8">
 Every campaign is unique. Pricing is based on length, complexity, formats required, and delivery timeline.
 </p>
 <button className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-lg">
 Launch Your Campaign
 </button>
 </div>
 </motion.section>
 </div>

 </div>
 </div>
 );
}
