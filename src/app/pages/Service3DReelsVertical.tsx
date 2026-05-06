import { motion } from 'motion/react';
import { Smartphone, TrendingUp, Zap, Check } from 'lucide-react';

export default function Service3DReelsVertical() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">

        {/* 1. Hero Section - Left image card, Right text */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-10 items-center"
        >
          {/* Left: Phone mock-style card */}
          <div className="lg:w-2/5 w-full relative">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl aspect-[9/16] max-h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="3D Vertical Content"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent" />
              {/* Overlay badge */}
              <div className="absolute bottom-5 left-5 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#06B6D4]" />
                <span className="text-white/80 text-sm font-medium">Optimised for reels</span>
              </div>
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_60px_rgba(6,182,212,0.08)]" />
            </div>
          </div>

          {/* Right: Title + text + stats */}
          <div className="lg:w-3/5 w-full">
            {/* <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 flex items-center justify-center mb-8 border border-[#06B6D4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Smartphone className="w-8 h-8 text-[#06B6D4]" strokeWidth={1.5} />
            </div> */}

            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
              3D Reels & Vertical Content
            </h1>

            <h2 className="text-xl text-white/80 font-medium mb-6 leading-snug">
              Transform short-form social content into immersive vertical experiences
            </h2>

            <p className="text-white/60 text-lg leading-relaxed font-light mb-10">
              Stand out on Instagram Reels, YouTube Shorts, and TikTok with immersive 3D content. Perfect for creators, brands, and influencers who want to capture attention in crowded feeds. Fast turnaround, affordable pricing, and formats made to work smoother for mobile viewing.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex-1 min-w-[140px] rounded-2xl bg-white/[0.03] border border-white/10 p-5 text-center">
                <div className="text-3xl font-black text-white mb-1">2–5</div>
                <div className="text-white/50 text-sm uppercase tracking-wider">Days</div>
              </div>
              <div className="flex-1 min-w-[140px] rounded-2xl bg-white/[0.03] border border-white/10 p-5 text-center">
                <div className="text-3xl font-black text-white mb-1">9:16</div>
                <div className="text-white/50 text-sm uppercase tracking-wider">Format</div>
              </div>
            </div>

            <button className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              Start Creating 3D Reels
            </button>
          </div>
        </motion.section>

        {/* 2. Works Everywhere – Platform Pills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-8 md:p-12 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-8 text-center tracking-wide uppercase text-white/80">
            Works Everywhere
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Instagram Reels', 'TikTok', 'YouTube Shorts', 'Apple Vision Pro', 'Facebook Reels', 'Snapchat Spotlight'].map((platform) => (
              <span key={platform} className="px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-white/70 font-medium text-sm hover:text-white hover:border-white/20 transition-colors">
                {platform}
              </span>
            ))}
          </div>
        </motion.section>

        {/* 3. Advanced Depth Mapping Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left image panel */}
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Depth Mapping"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A111A]/90" />
            </div>
            {/* Right text */}
            <div className="bg-[#0A111A] p-10 md:p-14 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 tracking-tight uppercase">
                Advanced Depth Mapping for Vertical Content
              </h2>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                Our proprietary depth-mapping technology analyses every frame of your vertical content to create precise stereo 3D effects. From 2D source footage to fully dimensional experiences, we ensure your reels stand out with natural depth that captivates viewers on mobile devices.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 4. Three Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: TrendingUp, title: 'Stand Out', desc: '3D content gets 2-3x more engagement' },
            { icon: Zap, title: 'Fast Delivery', desc: '2-5 day turnaround' },
            { icon: Smartphone, title: 'Mobile First', desc: 'Optimised for vertical viewing' }
          ].map((item, i) => (
            <div key={i} className="rounded-[1.5rem] bg-[#0A111A]/80 border border-white/5 p-8 flex flex-col items-start hover:border-[#06B6D4]/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center mb-5 group-hover:bg-[#06B6D4]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#06B6D4]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 font-light">{item.desc}</p>
            </div>
          ))}
        </motion.section>

        {/* 5. Fast & Simple Process */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-[#0A111A]/80 border border-white/5 p-10 md:p-14 shadow-lg"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-wide uppercase">
            Fast & Simple Process
          </h2>

          <div className="grid md:grid-cols-2 gap-x-14 gap-y-8">
            {[
              { title: 'Content Review', desc: 'Assess your reel for depth potential and platform requirements.' },
              { title: 'Vertical Depth Grading', desc: 'Mobile-optimised depth that works on small screens.' },
              { title: 'Rapid Conversion', desc: 'Fast, high-quality conversion with social media specs.' },
              { title: 'Platform Testing', desc: 'Verify playback on target platforms and devices.' },
              { title: 'Multi-Platform Delivery', desc: 'Optimised files for all major social platforms.' },
            ].map((step, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5 text-[#06B6D4]" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-white/50 text-sm font-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 6. CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-gradient-to-b from-white/[0.02] to-[#0A111A] border border-white/5 p-10 md:p-16 shadow-lg text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-wide uppercase">
            Ready to Go Viral with 3D?
          </h2>
          <p className="text-white/60 text-lg leading-relaxed font-light max-w-2xl mx-auto mb-10">
            Get your 3D vertical video, platform-specific formats, and Vision Pro-optimised file delivered in 2–5 days (depending upon reel length).
          </p>
          <button className="px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] hover:opacity-90 transition-opacity shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            Get Your Estimate
          </button>
        </motion.section>

      </div>
    </div>
  );
}
