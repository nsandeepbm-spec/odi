import { motion } from 'motion/react';
import { Target, Lightbulb, Clock, Award, Users, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10 space-y-32">
        
        {/* Mission Section */}
        <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Target className="w-4 h-4 text-[#06B6D4]" />
              <span className="text-sm font-medium tracking-wider text-white/80 uppercase">Our Mission</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
              BRINGING <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">DEPTH</span> BACK TO VISUALS
            </h1>
            
            <div className="space-y-5 text-base md:text-lg text-white/60 font-light leading-relaxed pr-0 lg:pr-8">
              <p>
                The mission of <strong className="text-white font-medium tracking-wide">ODI™</strong> is to bring <span className="text-white">depth and dimension</span> back into visual content. 
              </p>
              <p>
                With over <strong className="text-white font-medium">14 years of experience</strong> working on films, advertising, music videos, and digital projects, we've learned that every frame holds more detail and emotion than what a flat screen can show. 
              </p>
              <p>
                Our focus is to reveal that hidden depth and create visuals that feel richer, clearer, and more meaningful.
              </p>
              
              <div className="mt-8 pl-6 border-l-2 border-[#06B6D4]">
                <p className="text-lg md:text-xl text-white/90 font-medium italic">
                  "We believe the world isn't flat, and content shouldn't be either. Every story carries layers, and ODI™ exists to bring those layers to life."
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:col-span-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 via-[#7C3AED]/20 to-[#FF6B9D]/20 rounded-[3rem] blur-3xl" />
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-[#1B263B]/50 border border-white/10 backdrop-blur-xl">
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Immersive Retro Tech" 
                className="w-full h-full object-cover opacity-80 hover:scale-105 hover:opacity-100 transition-all duration-700"
              />
            </div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-2 lg:order-1 lg:col-span-6"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 via-[#FF6B9D]/20 to-[#06B6D4]/20 rounded-[3rem] blur-3xl" />
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-[#1B263B]/50 border border-white/10 backdrop-blur-xl">
              <img 
                src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Abstract 3D Spatial Shapes" 
                className="w-full h-full object-cover opacity-80 hover:scale-105 hover:opacity-100 transition-all duration-700"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Lightbulb className="w-4 h-4 text-[#FF6B9D]" />
              <span className="text-sm font-medium tracking-wider text-white/80 uppercase">Our Vision</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
              BUILDING FOR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#FF6B9D]">FUTURE</span>
            </h2>
            
            <div className="space-y-5 text-base md:text-lg text-white/60 font-light leading-relaxed pr-0 lg:pr-8">
              <p>
                The vision of <strong className="text-white font-medium tracking-wide">ODI™</strong> is to set a high standard for <span className="text-white">depth-focused and immersive visual production</span> across the world.
              </p>
              <p>
                We want to support filmmakers, brands, and creators as they prepare their work for the next era of viewing.
              </p>
              <p>
                As spatial video, 3D displays, and devices like Apple Vision Pro change how people experience visuals, ODI™ is building for that future — a future where content is not just watched, but <strong className="text-white font-medium">truly felt.</strong>
              </p>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#7C3AED]">
                  One frame at a time, we move closer to that future.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* What Drives Us */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              WHAT DRIVES <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#7C3AED]">US</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-[#7C3AED] rounded-full mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: Clock,
                title: "14 Years of Excellence",
                desc: "A step ahead of the rest in depth conversion and stereo production since 2011.",
                color: "from-blue-500 to-cyan-400"
              },
              {
                icon: Award,
                title: "Frame-Perfect Quality",
                desc: "Every frame treated with artistic care and technical precision.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Collaborative Process",
                desc: "We partner with directors, creators, and brands to improve and refine their vision.",
                color: "from-amber-400 to-orange-500"
              },
              {
                icon: Rocket,
                title: "Prepared for What's Coming",
                desc: "Leading the way in Vision Pro, VR, and modern immersive formats.",
                color: "from-emerald-400 to-teal-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`} />
                <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                  <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${item.color} p-[1px] shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full bg-[#0D1B2A]/90 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{item.title}</h3>
                    <p className="text-white/60 font-light leading-relaxed text-lg">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
