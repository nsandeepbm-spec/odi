import { motion } from 'motion/react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white pt-24 md:pt-32 pb-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Let's <span className="bg-gradient-to-r from-[#FF6B9D] to-[#06B6D4] bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-xl text-white/70">
            For collaboration or opportunities, we’d love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl"
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#06B6D4] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#06B6D4] transition-colors"
                  />
                  <Mail className="absolute right-4 top-3.5 w-5 h-5 text-white/30" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Message</label>
              <div className="relative">
                <textarea 
                  rows={6}
                  placeholder="Tell us about your project..."
                  className="w-full bg-[#0D1B2A]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#06B6D4] transition-colors resize-none"
                />
                <MessageSquare className="absolute right-4 top-4 w-5 h-5 text-white/30" />
              </div>
            </div>

            <button 
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF6B9D] to-[#06B6D4] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
