import { motion } from 'motion/react';
import { Layers, Combine, Paintbrush, MonitorSmartphone } from 'lucide-react';

const services = [
  {
    icon: Layers,
    title: 'Stereo 3D Conversion',
    description: 'Transform 2D content into high-quality stereoscopic 3D.',
  },
  {
    icon: Combine,
    title: 'Depth & Roto Pipeline',
    description: 'Precise depth creation for cinematic accuracy.',
  },
  {
    icon: Paintbrush,
    title: 'Stereo Paint & Edge Refinement',
    description: 'Clean edges and refined visuals for production-ready output.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Spatial Media Development',
    description: 'Content designed for immersive and future-ready platforms.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-transparent">
            SERVICES
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            We deliver industry-leading spatial visual technology and conversion services for the next generation of media.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#7C3AED]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-[#06B6D4]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
