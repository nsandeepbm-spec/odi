import React from 'react';
import { Camera, Box, Layers, Monitor, Send, Play, ArrowRight } from 'lucide-react';

export function HomeFeatures() {
  return (
    <div className="bg-[#050505] text-white font-sans min-h-screen p-8 md:p-16">
      
      {/* Section 01: Three Experiences */}
      <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-white/10 pb-24">
        <div className="md:w-1/3">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium">01</span>
            <div className="h-px bg-cyan-500/50 w-8"></div>
          </div>
          <h2 className="text-4xl font-light mb-6 tracking-wide">Three<br />Experiences.</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Endless possibilities.<br />
            One vision — real depth<br />
            that connects.
          </p>
        </div>
        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "STEP INTO EVERY STORY",
              subtitle: "Immersive Stereo Books",
              image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
            },
            {
              title: "EVERY FRAME HAS DEPTH",
              subtitle: "Stereo Content Conversion",
              image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
            },
            {
              title: "ADVERTISING THAT STOPS PEOPLE",
              subtitle: "Stereo Advertising",
              image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
            }
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer relative flex flex-col justify-between overflow-hidden border border-white/10 aspect-square rounded-sm">
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              
              <div className="relative z-10 p-6 flex-1 flex flex-col justify-end">
                <div className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                   <Play className="w-3 h-3 text-white fill-white" />
                </div>
                <h3 className="text-lg font-bold mb-1 leading-tight tracking-wide">{item.title}</h3>
                <div className="flex items-center justify-between mt-2 text-cyan-500 text-xs font-medium">
                  <span>{item.subtitle}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 02: Featured Projects */}
      <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-white/10 pb-24">
        <div className="md:w-1/4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium">02</span>
            <div className="h-px bg-cyan-500/50 w-8"></div>
          </div>
          <h2 className="text-4xl font-light mb-12 tracking-wide">Featured<br />Projects.</h2>
          <a href="#" className="text-cyan-500 text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:text-cyan-400 transition-colors">
            VIEW ALL PROJECTS <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "The Ocean Beyond", subtitle: "Kids Book", image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=400" },
            { title: "Edge of Tomorrow", subtitle: "Feature Film", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=400" },
            { title: "Driven to Inspire", subtitle: "Outdoor Campaign", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400" },
            { title: "Human Anatomy 3D", subtitle: "Medical Visualization", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400" },
          ].map((item, i) => (
             <div key={i} className="group cursor-pointer relative overflow-hidden border border-white/10 aspect-[4/5] bg-black/50 rounded-sm">
               <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
               
               <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                 <div>
                   <h3 className="text-sm font-semibold mb-1 text-white">{item.title}</h3>
                   <p className="text-xs text-white/50">{item.subtitle}</p>
                 </div>
                 <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Section 03: How Depth Is Created */}
      <section className="mb-24 flex flex-col md:flex-row gap-12 border-b border-white/10 pb-24 items-center overflow-hidden">
        <div className="md:w-1/4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium">03</span>
            <div className="h-px bg-cyan-500/50 w-8"></div>
          </div>
          <h2 className="text-4xl font-light tracking-wide">How Depth<br />Is Created.</h2>
        </div>
        <div className="md:w-3/4 flex justify-between items-start relative w-full overflow-x-auto pb-4 gap-4">
           {/* Connecting Line */}
           <div className="absolute top-8 left-[10%] right-[10%] h-px bg-white/20 hidden md:block" style={{ zIndex: 0 }}></div>
           
           {[
             { id: '01', title: 'Capture', desc: 'We capture or receive your content.', icon: Camera },
             { id: '02', title: 'Depth Mapping', desc: 'We analyze and build the depth information.', icon: Box },
             { id: '03', title: 'Stereo Creation', desc: 'We craft the left and right views with precision.', icon: Layers },
             { id: '04', title: 'Quality Review', desc: 'Every detail is reviewed for perfect comfort.', icon: Monitor },
             { id: '05', title: 'Final Delivery', desc: 'We deliver optimized stereo content.', icon: Send },
           ].map((step, i) => (
             <div key={i} className="flex flex-col items-center text-center w-[130px] relative z-10 shrink-0 mx-2 md:mx-0">
                <div className="w-16 h-16 rounded-full border border-cyan-500/50 bg-[#050505] flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-cyan-500" strokeWidth={1.5} />
                </div>
                <span className="text-cyan-500 text-[10px] font-bold mb-1">{step.id}</span>
                <h4 className="text-sm font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-[10px] text-white/50 leading-relaxed">{step.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Section 04: Industries We Serve */}
      <section className="pb-12 flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-500 font-medium">04</span>
            <div className="h-px bg-cyan-500/50 w-8"></div>
          </div>
          <h2 className="text-4xl font-light tracking-wide">Industries<br />We Serve.</h2>
        </div>
        <div className="md:w-3/4 flex gap-8 overflow-x-auto pb-4 justify-between w-full">
           {[
             { name: 'Publishing', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200' },
             { name: 'Cinema', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=200' },
             { name: 'Advertising', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200' },
             { name: 'Museums', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=200' },
             { name: 'Medical', image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=200' },
             { name: 'Education', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=200' },
             { name: 'Retail', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200' },
           ].map((industry, i) => (
              <div key={i} className="flex flex-col items-center shrink-0 group cursor-pointer mx-auto">
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border border-white/10 mb-4 bg-white/5 p-1 transition-all group-hover:border-white/30">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img src={industry.image} alt={industry.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                </div>
                <span className="text-xs text-white/50 group-hover:text-white transition-colors font-medium">{industry.name}</span>
              </div>
           ))}
        </div>
      </section>

      {/* Pagination dots at the bottom */}
      <div className="flex justify-center gap-2 mt-12 pb-8">
         <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
      </div>
    </div>
  );
}

