import { motion } from 'motion/react';
import { ODIKidsLogoFull, ODIKidsLogoVariant } from '../components/ODIKidsLogoVariants';
import { ODIKidsLogoShowcase } from '../components/ODIKidsLogoVariants';
import { ODIKidsHorizontalLogo, ODIKidsHorizontalLogoCentered, ODIKidsHorizontalLogoShowcase } from '../components/ODIKidsHorizontalLogo';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function ODIKidsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white odi-kids-font">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white backdrop-blur-sm rounded-full border-2 border-[#FF6B9D]/20 hover:border-[#FF6B9D]/40 transition-all shadow-lg hover:shadow-xl group"
      >
        <ArrowLeft className="w-4 h-4 text-[#FF6B9D] group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold text-gray-700">Back to ODI</span>
      </motion.button>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-6 lg:px-8 py-20 bg-gradient-to-br from-[#FFF5F7] via-[#FFF9E6] to-[#F0F9FF]">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${100 + Math.random() * 200}px`,
                height: `${100 + Math.random() * 200}px`,
                background: `radial-gradient(circle, ${
                  ['#FF6B9D', '#FFB800', '#06B6D4', '#7C3AED'][Math.floor(Math.random() * 4)]
                }20, transparent)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md rounded-full border-2 border-[#FFB800]/30 mb-8 shadow-lg"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#FF6B9D] to-[#FFB800] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-700">Brand Guidelines 2026</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="mb-8 flex justify-center"
          >
            <ODIKidsHorizontalLogo size="large" odiColor="#06B6D4" />
          </motion.div>

          {/* Company Name */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase mb-6 text-center"
          >
            Oceaniek Dimension Industries
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#FF6B9D] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent"
          >
            Educational Entertainment for Young Minds
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-base md:text-lg text-gray-600 text-center max-w-2xl font-medium"
          >
            A dedicated brand division focused on creating immersive 3D learning experiences for children, combining spatial technology with age-appropriate content.
          </motion.p>

          {/* Work in Progress Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            onClick={() => navigate('/wip')}
            className="mt-8 group relative px-8 py-4 bg-gradient-to-r from-[#FF6B9D] via-[#FFB800] to-[#06B6D4] rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#FFB800] to-[#06B6D4] rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              <span className="text-lg font-black text-white tracking-wide">
                View Product Vision
              </span>
              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      </section>

      {/* Logo System Section */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#FF6B9D]/10 to-[#FFB800]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
              <span className="bg-gradient-to-r from-[#FF6B9D] to-[#FFB800] bg-clip-text text-transparent">01 — Logo System</span>
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-gray-900">
              The ODI KIds Mark
            </h3>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
              Our logo maintains the iconic ODI geometric design while introducing playful, vibrant colors that resonate with young audiences. The design balances professionalism with approachability.
            </p>
          </motion.div>

          {/* Color Scheme Showcase */}
          <ODIKidsLogoShowcase />

          {/* Visual Feature - Learning in Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Image 1 */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1629652486808-0795afe261ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGxlYXJuaW5nJTIwY29sb3JmdWwlMjBjbGFzc3Jvb218ZW58MXx8fHwxNzczNzI0MDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Children learning in colorful classroom"
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-bold text-lg">Engaging Learning Environments</p>
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1556150704-c05c2955328b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBhaW50JTIwcGFsZXR0ZSUyMGFydCUyMGtpZHN8ZW58MXx8fHwxNzczNzMxNDA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Colorful creative learning"
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-bold text-lg">Vibrant Visual Experiences</p>
              </div>
            </div>
          </motion.div>

          {/* Sample Application - Color in Use */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16"
          >
            <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Sample Application</h4>
            
            {/* Color Combination Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200">
              <h5 className="text-xl font-bold text-gray-700 mb-8 text-center">Interactive Button States</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Primary Action', bg: '#FF6B9D', text: 'Start Learning' },
                  { name: 'Secondary Action', bg: '#FFB800', text: 'Explore More' },
                  { name: 'Tech Feature', bg: '#06B6D4', text: 'View 3D' },
                  { name: 'Premium', bg: '#7C3AED', text: 'Unlock Level' },
                ].map((button, i) => (
                  <div key={i} className="space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase text-center">{button.name}</p>
                    
                    {/* Normal State */}
                    <button
                      className="w-full px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
                      style={{ backgroundColor: button.bg }}
                    >
                      {button.text}
                    </button>
                    
                    {/* Outline State */}
                    <button
                      className="w-full px-6 py-3 rounded-xl font-bold border-2 hover:scale-105 transition-transform"
                      style={{ 
                        borderColor: button.bg,
                        color: button.bg,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {button.text}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Logo Section */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[06B6D4]/10 to-[#9C27B0]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
              <span className="bg-gradient-to-r from-[#06B6D4] to-[#9C27B0] bg-clip-text text-transparent">01.2 — Horizontal Lockup</span>
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-gray-900">
              Horizontal Logo
            </h3>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
              A streamlined horizontal version combining the ODI geometric mark with the colorful Kids wordmark. Perfect for digital headers, navigation bars, and compact spaces where the full logo might be too large.
            </p>
          </motion.div>

          {/* Horizontal Logo Showcase */}
          <ODIKidsHorizontalLogoShowcase />
        </div>
      </section>

      {/* Color System */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#06B6D4]/10 to-[#7C3AED]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
              <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">02 — Color System</span>
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-gray-900">
              Vibrant Color Palette
            </h3>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
              A carefully selected palette designed to engage young minds while maintaining visual harmony and accessibility standards.
            </p>
          </motion.div>

          {/* Primary Colors */}
          <div className="mb-16">
            <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Primary Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { name: 'Playful Pink', hex: '#FF6B9D', rgb: 'RGB 255, 107, 157', usage: 'Primary accent, interactive elements, highlights' },
                { name: 'Sunny Yellow', hex: '#FFB800', rgb: 'RGB 255, 184, 0', usage: 'Secondary accent, attention, warmth' },
                { name: 'Ocean Blue', hex: '#06B6D4', rgb: 'RGB 6, 182, 212', usage: 'Technology elements, calm areas' },
                { name: 'Magic Purple', hex: '#7C3AED', rgb: 'RGB 124, 58, 237', usage: 'Premium features, depth' },
              ].map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                >
                  <div className="h-48 relative" style={{ backgroundColor: color.hex }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-4xl font-black mb-2 drop-shadow-lg">{color.hex}</div>
                        <div className="text-white/90 text-sm font-medium drop-shadow">{color.rgb}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h5 className="text-lg font-bold text-gray-900 mb-2">{color.name}</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">{color.usage}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Neutral Colors */}
          <div>
            <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Neutral Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Gray 50', hex: '#F9FAFB' },
                { name: 'Gray 100', hex: '#F3F4F6' },
                { name: 'Gray 500', hex: '#6B7280' },
                { name: 'Gray 700', hex: '#374151' },
                { name: 'Gray 900', hex: '#111827' },
              ].map((color, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <div className="h-24" style={{ backgroundColor: color.hex }}></div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-900 mb-1">{color.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colorful Learning Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635243180684-7f2c8cea1906?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwcGxheWluZyUyMGVkdWNhdGlvbmFsJTIwZ2FtZXMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MzczMTQwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Kids engaging with educational technology"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-8">
                <div>
                  <h5 className="text-white font-black text-2xl md:text-3xl mb-2">Technology Meets Play</h5>
                  <p className="text-white/90 text-base md:text-lg">Colors that inspire curiosity and encourage exploration</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#7C3AED]/10 to-[#FF6B9D]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#FF6B9D] bg-clip-text text-transparent">03 — Typography</span>
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-extrabold text-gray-900">
              Typography System
            </h3>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
              We use Kodchasan for its friendly, rounded appearance that's perfect for educational content while remaining highly legible for young readers.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Headings */}
            <div className="bg-gradient-to-br from-[#FFF5F7] to-white rounded-2xl p-8 md:p-12 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-8">Display & Headings</h4>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-sm text-gray-500 mb-2">Display / Kodchasan Bold</p>
                  <h5 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#FFB800] bg-clip-text text-transparent">
                    Adventure Awaits
                  </h5>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-sm text-gray-500 mb-2">Heading 1 / Kodchasan Bold</p>
                  <h5 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Learning Through Play
                  </h5>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-sm text-gray-500 mb-2">Heading 2 / Kodchasan Semibold</p>
                  <h5 className="text-3xl md:text-4xl font-semibold text-gray-900">
                    Explore New Worlds
                  </h5>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Heading 3 / Kodchasan Medium</p>
                  <h5 className="text-2xl md:text-3xl font-medium text-gray-900">
                    Interactive Experience
                  </h5>
                </div>
              </div>
            </div>

            {/* Body Text */}
            <div className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-2xl p-8 md:p-12 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-8">Body Text</h4>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-sm text-gray-500 mb-2">Large / Kodchasan Medium</p>
                  <p className="text-xl font-medium text-gray-700 leading-relaxed">
                    Engaging content designed to inspire curiosity and foster learning through immersive 3D experiences.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-sm text-gray-500 mb-2">Regular / Kodchasan Regular</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Our platform combines cutting-edge spatial technology with age-appropriate educational content to create memorable learning experiences for children.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Small / Kodchasan Light</p>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    Perfect for captions, labels, and supplementary information throughout the interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Applications */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#FFB800]/10 to-[#06B6D4]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
              <span className="bg-gradient-to-r from-[#FFB800] to-[#06B6D4] bg-clip-text text-transparent">04 — Brand Applications</span>
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-gray-900">
              In Action
            </h3>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
              Real-world applications showcasing how the ODI KIds brand comes to life across digital and physical touchpoints.
            </p>
          </motion.div>

          {/* Digital App Interface */}
          <div className="mb-16">
            <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Digital Interface</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mobile App */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-[280px]">
                    <div className="bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-900">
                      <div className="bg-gradient-to-br from-[#FFF5F7] via-[#FFF9E6] to-[#F0F9FF] rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
                        {/* Status Bar */}
                        <div className="h-12 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 text-gray-900 text-xs font-medium">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-3 border-2 border-gray-900 rounded-sm"></div>
                          </div>
                        </div>
                        
                        {/* App Content */}
                        <div className="p-6">
                          <div className="w-16 mb-6">
                            <ODIKidsLogoFull color="#7C3AED" />
                          </div>
                          
                          <h5 className="text-2xl font-black bg-gradient-to-r from-[#FF6B9D] to-[#FFB800] bg-clip-text text-transparent mb-3">
                            Today's Adventures
                          </h5>
                          
                          <div className="space-y-3">
                            {[
                              { title: 'Space Explorer', progress: 75, color: 'from-[#7C3AED] to-[#06B6D4]' },
                              { title: 'Ocean Discovery', progress: 45, color: 'from-[#06B6D4] to-[#FFB800]' },
                              { title: 'Dino Adventure', progress: 90, color: 'from-[#FFB800] to-[#FF6B9D]' },
                            ].map((item, i) => (
                              <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-bold text-gray-900">{item.title}</span>
                                  <span className="text-xs font-semibold text-gray-600">{item.progress}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`} 
                                    style={{ width: `${item.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center mt-6">Mobile app interface with progress tracking</p>
              </div>

              {/* Desktop Interface */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="bg-gradient-to-br from-[#FFF5F7] via-[#FFF9E6] to-[#F0F9FF] rounded-xl overflow-hidden border-2 border-gray-300">
                  <div className="aspect-[16/10] p-8">
                    {/* Browser Chrome */}
                    <div className="bg-white rounded-t-lg border border-gray-200 mb-4 p-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded px-3 py-1">
                        <p className="text-xs text-gray-500">odikids.com</p>
                      </div>
                    </div>
                    
                    {/* Hero Content */}
                    <div className="bg-gradient-to-r from-[#7C3AED] to-[#FF6B9D] rounded-lg p-6 text-white">
                      <div className="w-12 mb-4 filter brightness-0 invert">
                        <svg viewBox="0 0 194.875 194.873" className="w-full h-auto">
                          <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="white"/>
                          <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="white"/>
                        </svg>
                      </div>
                      <h5 className="text-lg font-black mb-2">Explore & Learn</h5>
                      <p className="text-xs text-white/90 mb-3">Interactive 3D experiences</p>
                      <button className="px-4 py-2 bg-white text-[#7C3AED] rounded-lg text-xs font-bold">
                        Start Adventure
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center mt-6">Web platform hero section</p>
              </div>
            </div>
          </div>

          {/* Sample Application - Typography in Use */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12"
          >
            <h4 className="text-xs md:text-sm uppercase tracking-wider text-gray-500 mb-6 md:mb-8 font-medium">Sample Application</h4>
            
            {/* Learning Card Example */}
            <div className="bg-gradient-to-br from-[#7C3AED] to-[#FF6B9D] rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="bg-white rounded-2xl p-8 md:p-10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FFB800] to-[#FF6B9D] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      Space Explorer Mission
                    </h5>
                    <p className="text-lg font-medium text-gray-700 mb-4">
                      Journey through the solar system and discover amazing facts about planets, stars, and galaxies!
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed mb-6">
                      This interactive 3D experience will take you on an educational adventure through space. Learn about gravity, orbit patterns, and the mysteries of the universe while completing fun challenges along the way.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#FF6B9D] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                        Start Mission
                      </button>
                      <button className="px-6 py-3 border-2 border-[#7C3AED] text-[#7C3AED] rounded-xl font-bold hover:scale-105 transition-transform">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#FF6B9D] bg-clip-text text-transparent mb-1">8</p>
                    <p className="text-sm text-gray-600 font-light">Planets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#FFB800] to-[#FF6B9D] bg-clip-text text-transparent mb-1">12</p>
                    <p className="text-sm text-gray-600 font-light">Missions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent mb-1">45min</p>
                    <p className="text-sm text-gray-600 font-light">Duration</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/80 text-center mt-6">Example of typography hierarchy in content cards</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Mockup Section */}
      <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-[#9C27B0]/5 via-[#7C3AED]/5 to-[#06B6D4]/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 md:px-4 py-1.5 bg-gradient-to-r from-[#9C27B0]/10 to-[#7C3AED]/10 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-gray-200">
              <span className="bg-gradient-to-r from-[#9C27B0] to-[#7C3AED] bg-clip-text text-transparent">05 — Product Showcase</span>
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-gray-900">
              Physical Products
            </h3>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 mb-12 md:mb-16 lg:mb-20 max-w-3xl leading-relaxed">
              The ODI Kids Space Explorer product line demonstrates how our brand translates to physical packaging and educational materials, creating a cohesive experience across all touchpoints.
            </p>
          </motion.div>

          {/* Hero Mockup Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#9C27B0] to-[#7C3AED] rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200">
              <img
                src="https://via.placeholder.com/800x600"
                alt="ODI Kids Space Explorer Product Mockup"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Product Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '📦',
                title: 'Packaging Design',
                description: 'Bold, space-themed packaging that captures attention while maintaining brand consistency with vibrant colors and clear typography.'
              },
              {
                icon: '🎓',
                title: 'Educational Content',
                description: '3D learning materials that combine physical interaction with digital experiences, creating an immersive educational journey.'
              },
              {
                icon: '👓',
                title: 'Premium Accessories',
                description: 'Includes FREE 3D glasses and interactive components that enhance the learning experience and bring content to life.'
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h5 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h5>
                <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Brand Elements Used */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-gradient-to-br from-[#7C3AED] to-[#FF6B9D] rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h4 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">Brand Elements in Action</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Logo', value: 'ODI Kids Horizontal', color: 'from-[#06B6D4] to-[#9C27B0]' },
                { label: 'Primary Color', value: 'Ocean Blue #06B6D4', color: 'from-[#06B6D4] to-[#00BCD4]' },
                { label: 'Typography', value: 'Kodchasan Bold', color: 'from-[#FFB800] to-[#FF6B9D]' },
                { label: 'Visual Theme', value: 'Space Explorer', color: 'from-[#7C3AED] to-[#9C27B0]' },
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-xs uppercase tracking-wider text-white/70 mb-2 font-semibold">{item.label}</p>
                  <div className="h-1 w-full bg-gradient-to-r ${item.color} rounded-full mb-3"></div>
                  <p className="text-base font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/wip')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7C3AED] rounded-xl font-black shadow-lg hover:scale-105 transition-transform"
              >
                <span>Explore Full Product Vision</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-[#7C3AED] via-[#FF6B9D] to-[#FFB800]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <div className="w-32 mx-auto mb-4">
              <div className="filter brightness-0 invert">
                <svg viewBox="0 0 194.875 194.873" className="w-full h-auto mb-2">
                  <path d="M65.16 12.83V54.67C65.16 56.09 64.56 57.46 63.49 58.4C52.59 67.88 45.71 81.86 45.71 97.45C45.71 113.04 52.59 127 63.49 136.49C64.56 137.42 65.16 138.79 65.16 140.22V182.07C65.16 185.65 61.48 188.12 58.2 186.67C23.93 171.56 0 137.29 0 97.44C0 57.59 23.93 23.32 58.2 8.23C61.48 6.79 65.16 9.25 65.16 12.83Z" fill="white"/>
                  <path d="M194.86 99.19C193.92 152.68 149.33 195.72 95.84 194.86C93.84 194.83 91.86 194.74 89.9 194.59C87.31 194.39 85.32 192.2 85.32 189.6V153.72C85.32 150.72 87.95 148.39 90.92 148.76C93.5 149.08 96.14 149.22 98.82 149.15C125.71 148.45 147.84 126.82 149.1 99.95C150.5 70.23 126.83 45.7 97.43 45.7C95.22 45.7 93.04 45.84 90.9 46.11C87.93 46.48 85.31 44.15 85.31 41.15V5.27C85.31 2.68 87.29 0.49 89.88 0.29C92.47 0.09 94.9 0 97.44 0C151.84 0 195.82 44.57 194.86 99.19Z" fill="white"/>
                </svg>
                <div className="text-2xl text-white tracking-normal" style={{ fontFamily: 'Kodchasan, sans-serif', fontWeight: 800 }}>Kids</div>
              </div>
            </div>
          </motion.div>
          <p className="text-white font-bold text-base mb-2">Educational Entertainment for Young Minds</p>
          <p className="text-white/80 text-sm">© 2026 Oceaniek Dimension Industries - ODI KIDS Division</p>
        </div>
      </footer>
    </div>
  );
}