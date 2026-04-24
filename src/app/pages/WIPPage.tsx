import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Rocket, Package, BookOpen, Youtube, Sparkles, TrendingUp, Layers, CheckCircle } from 'lucide-react';
import mockupImage from 'figma:asset/4f16876573933f4dc758f37f619865788a865182.png';
import unboxingMockup from 'figma:asset/1f5a9a9d2e4a0d07337ea57fe62f258ebf09e17a.png';
import bookSpine from 'figma:asset/c6e88e108f40b435afb24f04fb1dc157c95c5086.png';
import packagingBox from 'figma:asset/df6a076901e67404246994e517080c6335ebeaee.png';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function WIPPage() {
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      icon: Sparkles,
      category: "Vision",
      title: "ODI Kids – 3D Learning Experience",
      gradient: "from-[#FF6B9D] to-[#FFB800]",
      content: [
        "We are not creating a book.",
        "We are creating a premium 3D learning product for kids, combining education, interaction, and immersive visuals."
      ],
      highlight: true,
      image: "https://images.unsplash.com/photo-1759101920821-44dc1fc44649?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHdvbmRlciUyMGRpc2NvdmVyeXxlbnwxfHx8fDE3NzM3MzYxNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 2,
      icon: Rocket,
      category: "Product Concept",
      title: "ODI Kids Space Explorer",
      gradient: "from-[#7C3AED] to-[#FF6B9D]",
      subtitle: "A premium 3D anaglyph learning kit for kids",
      features: [
        "3D Book",
        "3D Glasses",
        "Collectible Badge",
        "Interactive learning experience"
      ],
      showBookSpine: true
    },
    {
      id: 3,
      icon: Package,
      category: "Packaging Concept",
      title: "Premium Explorer Kit Packaging",
      gradient: "from-[#06B6D4] to-[#7C3AED]",
      subtitle: "Designed like a premium product, not a normal book",
      subtext: "Inspired by Apple-style unboxing experience",
      features: [
        "Magnetic box",
        "Organized compartments",
        "Cinematic visuals",
        "Strong shelf presence"
      ],
      showPackaging: true
    },
    {
      id: 4,
      icon: Package,
      category: "Inside Experience",
      title: "Unboxing Experience",
      gradient: "from-[#FFB800] to-[#FF6B9D]",
      quote: "We are designing a moment, not just a product.",
      steps: [
        "Open box → Welcome Explorer message",
        "Pick glasses",
        "Start 3D journey",
        "Collect badge"
      ],
      image: "https://images.unsplash.com/photo-1759563871365-4b90aa1ddd5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmJveGluZyUyMGV4cGVyaWVuY2UlMjBsdXh0dXJ8ZW58MXx8fHwxNzczNzM2MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 5,
      icon: BookOpen,
      category: "Book Concept",
      title: "3D Learning Book Structure",
      gradient: "from-[#9C27B0] to-[#06B6D4]",
      features: [
        "Space story-based learning",
        "Interactive pages",
        "Strong depth visuals",
        "Short, engaging facts",
        "Hidden object challenges"
      ],
      image: "https://images.unsplash.com/photo-1705660800046-2113f479369a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGVkdWNhdGlvbmFsJTIwYm9vayUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MzczNjE1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 6,
      icon: TrendingUp,
      category: "Why This Will Work",
      title: "Market Opportunity",
      gradient: "from-[#FF6B9D] to-[#7C3AED]",
      problems: [
        "Existing 3D books are outdated",
        "No premium positioning",
        "No learning + experience combination"
      ],
      solution: "ODI Kids = Premium + Educational + Interactive"
    },
    {
      id: 7,
      icon: Layers,
      category: "Expansion Plan",
      title: "Series Plan (Phase 1)",
      gradient: "from-[#06B6D4] to-[#FFB800]",
      quote: "This is a scalable product line, not a single book.",
      series: [
        "Space Explorer",
        "Dino World",
        "Ocean Depths",
        "Animal Kingdom",
        "Amazing Machines"
      ]
    },
    {
      id: 8,
      icon: Youtube,
      category: "YouTube Integration",
      title: "Connected Learning Ecosystem",
      gradient: "from-[#FFB800] to-[#9C27B0]",
      subtitle: "Book → QR Code → YouTube → Back to Book",
      features: [
        "Video explanations",
        "Missions",
        "Interactive learning"
      ],
      image: "https://images.unsplash.com/photo-1740479048952-e493c94bbf6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0dWJlJTIwbGVhcm5pbmclMjBjaGlsZHJlbnxlbnwxfHx8fDE3NzM3MzYxNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 9,
      icon: CheckCircle,
      category: "Brand Strength",
      title: "ODI Kids Identity",
      gradient: "from-[#7C3AED] to-[#06B6D4]",
      features: [
        "Premium design",
        "Consistent visual system",
        "Recognizable packaging",
        "Collectible series"
      ],
      image: "https://images.unsplash.com/photo-1728467459756-211f3c738697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwZGVzaWduJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczNzM2MTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 10,
      icon: Sparkles,
      category: "Vision Statement",
      title: "Building a New Category",
      gradient: "from-[#FF6B9D] via-[#FFB800] to-[#06B6D4]",
      quote: "We are building a new category: Premium 3D learning experience for kids.",
      highlight: true,
      image: "https://images.unsplash.com/photo-1714646793071-6bed9a14ecf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHJlYWRpbmclMjAzRCUyMGJvb2slMjBnbGFzc2VzfGVufDF8fHx8MTc3MzczNjE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white odi-kids-font">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/odi-kids')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white backdrop-blur-sm rounded-full border-2 border-[#FF6B9D]/20 hover:border-[#FF6B9D]/40 transition-all shadow-lg hover:shadow-xl group"
      >
        <ArrowLeft className="w-4 h-4 text-[#FF6B9D] group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold text-gray-700">Back to ODI Kids</span>
      </motion.button>

      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 md:px-6 lg:px-8 py-20 bg-gradient-to-br from-[#FFF5F7] via-[#FFF9E6] to-[#F0F9FF]">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${150 + Math.random() * 300}px`,
                height: `${150 + Math.random() * 300}px`,
                background: `radial-gradient(circle, ${
                  ['#FF6B9D', '#FFB800', '#06B6D4', '#7C3AED'][Math.floor(Math.random() * 4)]
                }20, transparent)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B9D] to-[#FFB800] rounded-full mb-8 shadow-xl"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-black text-white tracking-wide">WORK IN PROGRESS</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 bg-gradient-to-r from-[#FF6B9D] via-[#FFB800] to-[#06B6D4] bg-clip-text text-transparent">
              ODI Kids Vision
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-semibold mb-4">
              Building a New Category in Children's Education
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Explore our comprehensive product vision and strategy for creating premium 3D learning experiences
            </p>
          </motion.div>

          {/* Right: Book Spine Design */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm">
              <img src={bookSpine} alt="ODI Kids Space Explorer Book Spine" className="w-full h-auto drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Mockup Section */}
      <section className="py-24 px-4">
        <div className="max-w-xl mx-auto space-y-16">
          <div className="py-12">
            <img src={mockupImage} alt="Product" className="w-full scale-[2]" />
          </div>
          <img src={unboxingMockup} alt="Unboxing" className="w-full" />
        </div>
      </section>

      {/* Slides Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`relative bg-white rounded-3xl overflow-hidden shadow-xl border-2 ${
                slide.highlight ? 'border-[#FFB800]' : 'border-gray-200'
              }`}
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${slide.gradient} p-8 md:p-10`}>
                <div className="flex items-start gap-4">
                  {/* Slide Number */}
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-white">
                      {slide.id.toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                      <slide.icon className="w-5 h-5 text-white" />
                      <span className="text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">
                        {slide.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">
                      {slide.title}
                    </h2>

                    {/* Subtitle */}
                    {slide.subtitle && (
                      <p className="text-base md:text-lg text-white/90 font-semibold">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Subtext */}
                    {slide.subtext && (
                      <p className="text-sm md:text-base text-white/80 font-medium mt-2 italic">
                        {slide.subtext}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-8 md:p-10">
                {/* Content paragraphs */}
                {slide.content && (
                  <div className="space-y-4 mb-6">
                    {slide.content.map((text, i) => (
                      <p
                        key={i}
                        className={`${
                          i === 0 ? 'text-xl md:text-2xl font-bold text-gray-900' : 'text-lg md:text-xl text-gray-700 font-medium'
                        }`}
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                )}

                {/* Features List */}
                {slide.features && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {slide.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.gradient}`} />
                        <span className="text-base md:text-lg font-semibold text-gray-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Steps */}
                {slide.steps && (
                  <div className="space-y-3 mb-6">
                    {slide.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${slide.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                          {i + 1}
                        </div>
                        <p className="text-base md:text-lg font-semibold text-gray-800 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Problems */}
                {slide.problems && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Current Problems</h4>
                    {slide.problems.map((problem, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                        <span className="text-red-500 font-bold text-lg">✗</span>
                        <p className="text-base md:text-lg font-semibold text-gray-800">{problem}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Solution */}
                {slide.solution && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 font-bold text-2xl">✓</span>
                      <p className="text-xl md:text-2xl font-black text-gray-900">{slide.solution}</p>
                    </div>
                  </div>
                )}

                {/* Series */}
                {slide.series && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {slide.series.map((item, i) => (
                      <div
                        key={i}
                        className={`p-5 bg-gradient-to-br ${slide.gradient} rounded-2xl text-center shadow-lg transform hover:scale-105 transition-transform`}
                      >
                        <div className="text-4xl mb-2">
                          {['🚀', '🦖', '🌊', '🦁', '⚙️'][i]}
                        </div>
                        <p className="text-lg font-black text-white">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quote */}
                {slide.quote && (
                  <div className={`p-6 md:p-8 bg-gradient-to-r ${slide.gradient} rounded-2xl border-4 border-white shadow-2xl`}>
                    <div className="flex items-start gap-4">
                      <div className="text-5xl text-white/40 font-serif leading-none">"</div>
                      <p className="text-xl md:text-2xl lg:text-3xl font-black text-white italic">
                        {slide.quote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Book Spine Design */}
                {slide.showBookSpine && (
                  <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xs">
                      <img src={bookSpine} alt="ODI Kids Space Explorer Book Spine" className="w-full h-auto drop-shadow-2xl" />
                    </div>
                  </div>
                )}

                {/* Packaging Design */}
                {slide.showPackaging && (
                  <div className="mt-6 flex justify-center">
                    <div className="w-full max-w-xs">
                      <img src={packagingBox} alt="ODI Kids Space Explorer Packaging" className="w-full h-auto drop-shadow-2xl" />
                    </div>
                  </div>
                )}

                {/* Image */}
                {slide.image && (
                  <div className="mt-6 flex justify-center">
                    <ImageWithFallback
                      src={slide.image}
                      alt={slide.title}
                      className="w-full max-w-md h-48 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-[#7C3AED] via-[#FF6B9D] to-[#FFB800]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
            Let's Build the Future of Learning
          </h3>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-semibold">
            This vision is just the beginning. Stay tuned for updates as we bring this experience to life.
          </p>
          <button
            onClick={() => navigate('/odi-kids')}
            className="px-8 py-4 bg-white text-[#7C3AED] rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform"
          >
            Back to Brand Guidelines
          </button>
        </motion.div>
      </section>
    </div>
  );
}