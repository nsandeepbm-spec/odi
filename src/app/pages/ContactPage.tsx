import { motion } from 'motion/react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
 return (
 <div className="min-h-screen bg-white text-neutral-900 pt-24 md:pt-32 pb-20 relative overflow-hidden selection:bg-indigo-100">
 <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
 
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16"
 >
 <div className="flex items-center justify-center gap-4 mb-4">
    <div className="h-px bg-indigo-500/30 w-8"></div>
    <span className="text-indigo-500 font-bold tracking-widest text-[11px] uppercase">Get In Touch</span>
    <div className="h-px bg-indigo-500/30 w-8"></div>
 </div>
 <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-neutral-900">
 Let's <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Connect</span>
 </h1>
 <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
 For collaboration or opportunities, we’d love to hear from you.
 </p>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 md:p-12 shadow-xl"
 >
 <form className="space-y-6"onSubmit={(e) => e.preventDefault()}>
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-500 tracking-widest uppercase ml-1">Name</label>
 <div className="relative">
 <input 
 type="text"
 placeholder="John Doe"
 className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
 />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-500 tracking-widest uppercase ml-1">Email</label>
 <div className="relative">
 <input 
 type="email"
 placeholder="john@example.com"
 className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
 />
 <Mail className="absolute right-4 top-4 w-5 h-5 text-neutral-400"/>
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-neutral-500 tracking-widest uppercase ml-1">Message</label>
 <div className="relative">
 <textarea 
 rows={6}
 placeholder="Tell us about your project..."
 className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-4 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-sm"
 />
 <MessageSquare className="absolute right-4 top-4 w-5 h-5 text-neutral-400"/>
 </div>
 </div>

 <button 
 className="w-full py-5 rounded-xl font-black uppercase tracking-widest text-sm text-white bg-neutral-900 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 shadow-md"
 >
 <Send className="w-4 h-4"/>
 Send Message
 </button>
 </form>
 </motion.div>

 </div>
 </div>
 );
}
