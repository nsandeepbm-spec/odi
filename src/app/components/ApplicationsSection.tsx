import { motion } from 'motion/react';
import { ODILogo } from './ODILogo';

export function ApplicationsSection() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#7C3AED]/10 to-[#06B6D4]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">05 — Brand Applications</span>
          </span>
          <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-gray-900">
            Brand in Action
          </h3>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
            Sophisticated applications that embody ODI's commitment to precision, innovation, and cinematic excellence.
          </p>
        </motion.div>

        {/* Business Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 lg:mb-24"
        >
          <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6 lg:mb-8 font-medium">Business Cards</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Dark Business Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl">
                <div className="aspect-[1.75/1] bg-gradient-to-br from-black via-gray-900 to-gray-950 rounded-lg md:rounded-xl p-5 md:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-xl">
                  {/* Gradient orb */}
                  <div className="absolute -right-8 md:-right-12 -top-8 md:-top-12 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-[#06B6D4]/20 to-[#7C3AED]/20 rounded-full blur-3xl"></div>
                  
                  {/* Pattern */}
                  <div className="absolute right-0 top-0 w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32 opacity-5">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                  </div>
                  
                  <div className="w-16 md:w-20 lg:w-24 xl:w-28 relative z-10">
                    <ODILogo color="white" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="h-px w-10 md:w-12 lg:w-16 bg-gradient-to-r from-[#06B6D4] via-[#7C3AED]/50 to-transparent mb-3 md:mb-4"></div>
                    <p className="text-white font-semibold text-xs md:text-sm mb-0.5 md:mb-1">Sarah Chen</p>
                    <p className="text-white/60 text-xs mb-2 md:mb-3">Director of Spatial Technology</p>
                    <p className="text-white/40 text-xs">sarah@odi.studio</p>
                    <p className="text-white/40 text-xs">+1 (415) 555-0142</p>
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 lg:mt-6 ml-1">Premium black with dual-color gradient accent</p>
            </div>

            {/* Light Business Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl">
                <div className="aspect-[1.75/1] bg-white rounded-lg md:rounded-xl p-5 md:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden border-l-4 border-[#7C3AED] shadow-xl">
                  {/* Gradient overlay */}
                  <div className="absolute right-0 top-0 w-32 md:w-40 h-full bg-gradient-to-l from-[#7C3AED]/5 via-[#06B6D4]/5 to-transparent"></div>
                  
                  <div className="w-16 md:w-20 lg:w-24 xl:w-28 relative z-10">
                    <svg viewBox="0 0 194.875 194.873" className="w-full h-auto">
                      <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="#7C3AED"/>
                      <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="#06B6D4"/>
                    </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-gray-900 font-semibold text-xs md:text-sm mb-0.5 md:mb-1">Michael Torres</p>
                    <p className="text-gray-500 text-xs mb-2 md:mb-3">Chief Executive Officer</p>
                    <p className="text-gray-400 text-xs">michael@odi.studio</p>
                    <p className="text-gray-400 text-xs">+1 (415) 555-0100</p>
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 lg:mt-6 ml-1">White with gradient accent edge</p>
            </div>
          </div>
        </motion.div>

        {/* Stationery System */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 md:mb-16 lg:mb-24"
        >
          <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6 lg:mb-8 font-medium">Stationery System</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Letterhead */}
            <div className="bg-gradient-to-br from-gray-100 to-white p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl shadow-xl border border-gray-200">
              <div className="aspect-[8.5/11] bg-white border-2 border-gray-200 rounded-lg p-6 md:p-8 lg:p-12 relative shadow-inner">
                <div className="w-20 md:w-24 lg:w-32 xl:w-40 mb-6 md:mb-8 lg:mb-12">
                  <ODILogo color="#06B6D4" />
                </div>
                
                <div className="absolute top-6 md:top-8 lg:top-12 right-6 md:right-8 lg:right-12 text-right">
                  <p className="text-xs text-gray-400 mb-0.5">1550 Bryant Street, Suite 850</p>
                  <p className="text-xs text-gray-400">San Francisco, CA 94103</p>
                </div>
                
                {/* Letter content */}
                <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  <div className="h-1 md:h-1.5 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-1 md:h-1.5 bg-gray-100 rounded w-full"></div>
                  <div className="h-1 md:h-1.5 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-1 md:h-1.5 bg-gray-50 rounded w-2/3 mt-4 md:mt-6"></div>
                  <div className="h-1 md:h-1.5 bg-gray-50 rounded w-full"></div>
                  <div className="h-1 md:h-1.5 bg-gray-50 rounded w-4/5"></div>
                  <div className="h-1 md:h-1.5 bg-gray-50 rounded w-3/4 mt-4 md:mt-6"></div>
                  <div className="h-1 md:h-1.5 bg-gray-50 rounded w-5/6"></div>
                </div>
                
                <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-6 md:left-8 lg:left-12 right-6 md:right-8 lg:right-12">
                  <div className="h-px bg-gradient-to-r from-[#06B6D4] via-[#7C3AED]/30 to-transparent mb-2 md:mb-3"></div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-gray-400">
                    <span>hello@odi.studio</span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span>+1 (415) 555-0100</span>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <span className="hidden sm:inline">www.odi.studio</span>
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 lg:mt-6 text-center">Professional letterhead with gradient footer</p>
            </div>

            {/* Envelope */}
            <div className="bg-gradient-to-br from-white to-gray-100 p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl shadow-xl border border-gray-200">
              <div className="aspect-[2.2/1] bg-white border-2 border-gray-200 rounded-lg p-5 md:p-6 lg:p-8 relative shadow-inner">
                <div className="w-16 md:w-20 lg:w-24 xl:w-32 mb-3 md:mb-4">
                  <ODILogo color="#7C3AED" />
                </div>
                
                <div className="absolute bottom-5 md:bottom-6 lg:bottom-8 left-5 md:left-6 lg:left-8 text-xs text-gray-400 leading-relaxed">
                  <p className="font-medium text-gray-500 text-xs">Oceaniek Dimension Industries</p>
                  <p className="text-xs">1550 Bryant Street, Suite 850</p>
                  <p className="text-xs">San Francisco, CA 94103</p>
                </div>
                
                <div className="absolute top-5 md:top-6 lg:top-8 right-5 md:right-6 lg:right-8 w-10 md:w-12 lg:w-16 h-10 md:h-12 lg:h-16 border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-300 font-medium">Stamp</span>
                </div>
                
                <div className="absolute bottom-5 md:bottom-6 right-5 md:right-8 lg:right-12 w-20 md:w-24 lg:w-32 h-14 md:h-16 lg:h-20 border-l-2 border-gray-200 pl-3 md:pl-4 flex flex-col justify-center">
                  <div className="h-0.5 md:h-1 bg-gray-100 rounded w-full mb-1.5 md:mb-2"></div>
                  <div className="h-0.5 md:h-1 bg-gray-100 rounded w-4/5 mb-1.5 md:mb-2"></div>
                  <div className="h-0.5 md:h-1 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 lg:mt-6 text-center">Brand envelope with return address</p>
            </div>
          </div>
        </motion.div>

        {/* Digital Applications */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 md:mb-16 lg:mb-24"
        >
          <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6 lg:mb-8 font-medium">Digital Applications</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Website Hero */}
            <div className="bg-gray-900 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-800">
              <div className="aspect-[16/10] bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-black p-5 md:p-6 lg:p-8 xl:p-12 flex flex-col justify-between relative overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-40 md:w-48 lg:w-64 h-40 md:h-48 lg:h-64 bg-gradient-to-br from-[#7C3AED]/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48 bg-gradient-to-tr from-[#06B6D4]/20 to-transparent rounded-full blur-3xl"></div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-14 md:w-16 lg:w-20 xl:w-24">
                    <ODILogo color="white" />
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6 text-xs text-white/60">
                    <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">Services</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Work</span>
                    <span className="hover:text-white transition-colors cursor-pointer">About</span>
                  </div>
                </div>
                
                {/* Hero Content */}
                <div className="relative z-10">
                  <h5 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 md:mb-3 leading-tight">
                    Spatial Cinema<br/>
                    <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">Technology</span>
                  </h5>
                  <p className="text-xs md:text-sm text-white/60 mb-4 md:mb-6 max-w-md">
                    Transforming flat content into immersive dimensional experiences with cinema-grade precision.
                  </p>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] rounded-lg text-xs font-semibold text-white cursor-pointer">
                      Explore Tech
                    </div>
                    <div className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 rounded-lg text-xs font-medium text-white/80 cursor-pointer">
                      View Demo
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 lg:mt-6 text-center px-4">Website hero with gradient typography</p>
            </div>

            {/* Mobile App */}
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-white p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl border border-gray-200 relative">
              <div className="w-full max-w-[220px] md:max-w-[240px] lg:max-w-[280px]">
                <div className="bg-black rounded-[2.5rem] md:rounded-[3rem] p-2.5 md:p-3 shadow-2xl border-4 md:border-6 lg:border-8 border-gray-900">
                  <div className="bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-black rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
                    {/* Status Bar */}
                    <div className="h-9 md:h-10 lg:h-12 bg-black/40 backdrop-blur-sm flex items-center justify-between px-4 md:px-5 lg:px-6 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-3 md:w-3.5 lg:w-4 h-2 md:h-2.5 lg:h-3 border border-white/60 rounded-sm"></div>
                        <div className="w-3 md:w-3.5 lg:w-4 h-2 md:h-2.5 lg:h-3 bg-white/60 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-3 md:p-4 lg:p-6">
                      <div className="w-9 md:w-10 lg:w-12 mb-4 md:mb-5 lg:mb-6">
                        <svg viewBox="0 0 194.875 194.873" className="w-full h-auto">
                          <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="#7C3AED"/>
                          <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="#06B6D4"/>
                        </svg>
                      </div>
                      
                      <h5 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1.5 md:mb-2">3D Conversion</h5>
                      <p className="text-xs text-white/60 mb-3 md:mb-4 lg:mb-6">Real-time depth analysis</p>
                      
                      <div className="space-y-2 md:space-y-2.5 lg:space-y-3">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-1.5 md:mb-2">
                            <span className="text-xs text-white/80">Project Alpha</span>
                            <span className="text-xs text-[#06B6D4]">87%</span>
                          </div>
                          <div className="h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] w-[87%] rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-1.5 md:mb-2">
                            <span className="text-xs text-white/80">Cinema Reel</span>
                            <span className="text-xs text-[#7C3AED]">64%</span>
                          </div>
                          <div className="h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] w-[64%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Presentation Slides */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 md:mb-16 lg:mb-24"
        >
          <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6 lg:mb-8 font-medium">Presentation System</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Title Slide */}
            <div className="group">
              <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-800">
                <div className="aspect-[16/9] bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-black p-5 md:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48 bg-gradient-to-br from-[#06B6D4] to-transparent rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="w-12 md:w-14 lg:w-16 relative z-10">
                    <ODILogo color="white" />
                  </div>
                  
                  <div className="relative z-10">
                    <h5 className="text-base md:text-lg lg:text-xl font-bold text-white mb-2 leading-tight">Spatial Cinema<br/>Technology</h5>
                    <div className="flex items-center gap-2 mt-2 md:mt-3">
                      <div className="h-0.5 md:h-1 w-8 md:w-10 bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] rounded-full"></div>
                      <p className="text-xs text-white/50">3D Conversion</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4 ml-1">Dark title slide</p>
            </div>

            {/* Content Slide */}
            <div className="group">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
                <div className="aspect-[16/9] bg-white p-5 md:p-6 lg:p-8 flex flex-col relative">
                  <div className="flex items-start justify-between mb-5 md:mb-6">
                    <div>
                      <div className="h-0.5 md:h-1 w-6 md:w-8 bg-[#06B6D4] rounded-full mb-2 md:mb-3"></div>
                      <h5 className="text-sm md:text-base lg:text-lg font-bold text-gray-900">Technology Stack</h5>
                    </div>
                    <div className="w-6 md:w-7 lg:w-8 opacity-20">
                      <svg viewBox="0 0 194.875 194.873">
                        <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="#7C3AED"/>
                        <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="#06B6D4"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#06B6D4]"></div>
                      <p className="text-xs text-gray-600">Advanced depth mapping</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#06B6D4]"></div>
                      <p className="text-xs text-gray-600">Real-time processing</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#06B6D4]"></div>
                      <p className="text-xs text-gray-600">Cinema-grade quality</p>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-5 md:bottom-6 lg:bottom-8 right-5 md:right-6 lg:right-8 text-xs text-gray-300 font-medium">01</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4 ml-1">Light content slide</p>
            </div>

            {/* Data Slide */}
            <div className="group md:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-xl shadow-2xl overflow-hidden">
                <div className="aspect-[16/9] p-5 md:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 225">
                      <circle cx="200" cy="112" r="70" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="200" cy="112" r="50" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
                      <circle cx="200" cy="112" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                  </div>
                  
                  <div className="text-center relative z-10">
                    <div className="inline-block p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2">8K</p>
                      <p className="text-xs text-white/70">Max Resolution</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-5 md:top-6 lg:top-8 left-5 md:left-6 lg:left-8 w-9 md:w-10 lg:w-12">
                    <ODILogo color="white" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4 ml-1">Data visualization</p>
            </div>
          </div>
        </motion.div>

        {/* Merchandise */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 md:mb-16 lg:mb-24"
        >
          <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-4 md:mb-6 lg:mb-8 font-medium">Branded Merchandise</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* T-Shirt */}
            <div className="bg-gradient-to-br from-gray-100 to-white p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-200">
              <div className="aspect-square bg-gray-900 rounded-lg md:rounded-xl flex items-center justify-center p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
                <div className="w-24 md:w-28 lg:w-32 relative z-10">
                  <ODILogo color="white" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4 text-center">Premium black t-shirt</p>
            </div>

            {/* Tote Bag */}
            <div className="bg-gradient-to-br from-white to-gray-100 p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-200">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-white rounded-lg md:rounded-xl flex items-center justify-center p-6 md:p-8 relative border-2 border-gray-200">
                <div className="w-20 md:w-24 lg:w-28 relative z-10">
                  <svg viewBox="0 0 194.875 194.873" className="w-full h-auto">
                    <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="#7C3AED"/>
                    <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="#06B6D4"/>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4 text-center">Canvas tote bag</p>
            </div>

            {/* Notebook */}
            <div className="bg-gradient-to-br from-gray-100 to-white p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-200 sm:col-span-2 lg:col-span-1">
              <div className="aspect-square bg-white rounded-lg md:rounded-xl flex items-center justify-center p-6 md:p-8 relative border-2 border-gray-300 shadow-inner">
                <div className="absolute top-3 md:top-4 right-3 md:right-4 w-14 md:w-16 lg:w-20">
                  <ODILogo color="#06B6D4" />
                </div>
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="h-px bg-gray-200"></div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="h-px bg-gray-200"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 md:mt-4 text-center">Lined notebook</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-block px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-full border border-gray-700">
            <p className="text-xs md:text-sm text-white/60">All applications maintain brand consistency and professional excellence</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
