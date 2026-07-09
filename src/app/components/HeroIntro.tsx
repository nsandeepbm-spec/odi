import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, X, Check, ArrowRight, MessageSquare, Send,
  Sparkles, CreditCard, ShoppingBag, ShieldCheck, HeartHandshake, User, RefreshCw
} from 'lucide-react';
import { ODILogo } from './ODILogo';
import { useNavigate } from 'react-router';

interface BillingInfo {
  name: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface ChatMessage {
  id: string;
  sender: 'alex' | 'user';
  text: string;
  timestamp: Date;
}

export function HeroIntro() {
  const navigate = useNavigate();
  // Video and Playback States
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);



  // Support Chat States
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'alex',
      text: "Hi there! I'm Alex from ODI Stereo Labs. Ready to elevate your content into natural stereoscopic 3D?",
      timestamp: new Date()
    }
  ]);

  // Handle Play/Pause of Background Video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
      }
      setIsPlaying(!isPlaying);
    }
  };



  // Pre-configured Chat Options
  const handleChatQuestion = (question: string, answer: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: question,
      timestamp: new Date()
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const alexMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'alex',
        text: answer,
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, alexMsg]);
    }, 1500);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };
    setChatMessages((prev) => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "That's an interesting question! For detailed integration specs or custom pricing, feel free to start a configurations order, or leave your email and our engineering team will get right back to you.";

      if (query.includes('price') || query.includes('cost') || query.includes('buy')) {
        reply = "Our Creator tier is $299/mo, and Studio Pro is $999/mo. Click the 'Buy Now' button on our home page to see features and configure your full stack live!";
      } else if (query.includes('kids') || query.includes('book')) {
        reply = "We offer stereoscopic 3D Learning books specifically for kids! Check out our dedicated 'ODI Kids' section in the main navbar for details.";
      } else if (query.includes('ss1') || query.includes('video')) {
        reply = "ODI_SS1 is our flagship stereoscopic converter engine. It delivers natural 3D depth layers without needing dedicated stereo camera rigs.";
      }

      const alexMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'alex',
        text: reply,
        timestamp: new Date()
      };
      setChatMessages((prev) => [...prev, alexMsg]);
    }, 1500);
  };

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#020617]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-1000"
        >
          <source src="/ODI_SS1.mp4" type="video/mp4" />
        </video>
        {/* Dark Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/70 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
      </div>

      {/* Main Overlay Content */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 h-full flex flex-col justify-between pt-24 pb-8 md:pt-32 md:pb-10 min-h-screen">
        {/* Spacer */}
        <div className="flex-grow w-full" />

        {/* Hero Text / CTAs Layout (Samsung Style - Bottom/Center-Left) */}
        <div className="flex flex-col items-start text-left max-w-xl mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              style={{ fontFamily: '"Afacad Flux", sans-serif' }}
              className="text-2xl md:text-3xl lg:text-[40px] font-black tracking-tight text-white uppercase leading-[1.05] mb-4"
            >
              Step Into Real 3D.<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Space Explorer
              </span>
            </h1>

            <p
              className="text-xs md:text-sm lg:text-[15px] text-white/80 font-medium max-w-md leading-[1.5] tracking-wide mb-6"
            >
              A stereoscopic adventure where every page reveals a new world of depth. Put on your 3D glasses and experience space like never before.
            </p>

            {/* CTA Container */}
            <div className="flex flex-row items-center gap-6">
              {/* Afacad Flux Variable Weight Flex Button */}
              <motion.button
                onClick={() => navigate('/checkout?product=space-explorer')}
                whileHover={{
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.55)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  fontFamily: '"Afacad Flux", sans-serif',
                  fontWeight: 400
                }}
                className="px-6 py-3 bg-white text-black border border-white rounded-full text-[11px] tracking-wider uppercase cursor-pointer hover:bg-cyan-400 hover:border-cyan-400 transition-colors duration-300 font-bold shadow-md"
              >
                Buy Now
              </motion.button>

              <button
                onClick={() => navigate('/learn-more')}
                className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors duration-200"
              >
                <span className="border-b border-white/40 group-hover:border-white transition-all pb-0.5">
                  Learn more
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar: Play/Pause controls & Minimal Scroll Line */}
        <div className="w-full flex items-center justify-between pt-6 md:pt-10">
          {/* Circular Play/Pause (Samsung Mockup style) */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 z-30"
            title={isPlaying ? 'Pause Background' : 'Play Background'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Minimal line scroll indicator */}
          <div className="hidden md:flex flex-col items-center gap-2 cursor-pointer" onClick={scrollDown}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Scroll Down</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
          </div>

          <div className="w-11 h-11" /> {/* Spacer alignment */}
        </div>
      </div>

      {/* ==========================================
          FLOATING CHATBOT SUPPORT ASSISTANT (SAMSUNG STYLE)
          ========================================== */}
      {/* Support Badge / Bubble in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="w-[360px] h-[480px] bg-slate-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl flex flex-col mb-4"
            >
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-cyan-400/20 to-indigo-600/20 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-wide uppercase text-white flex items-center gap-1.5">
                      Alex
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-white/50">ODI Customer Support</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Content Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] ${msg.sender === 'user' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-cyan-400'
                      }`}>
                      {msg.sender === 'user' ? <User className="w-3 h-3" /> : <HeartHandshake className="w-3 h-3" />}
                    </div>

                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                      ? 'bg-cyan-400 text-black rounded-tr-none'
                      : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                      <HeartHandshake className="w-3 h-3" />
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-300" />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions */}
              {chatMessages.length === 1 && (
                <div className="p-3 bg-white/[0.02] border-t border-white/5 space-y-2">
                  <div className="text-[9px] uppercase tracking-widest text-white/40 px-1 font-bold">Suggested Questions:</div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleChatQuestion(
                        "What is the difference between Creator & Pro?",
                        "Creator tier ($299/mo) is optimized for shorter contents (social, reels) and individual work. Studio Pro ($999/mo) grants full volumetric rendering pipelines, depth plugins, VR formats, and high-performance encoding support."
                      )}
                      className="text-left w-full px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 text-[11px] text-white/70 hover:text-cyan-400 transition-all uppercase tracking-wide font-sans"
                    >
                      Creator vs Pro Suites?
                    </button>
                    <button
                      onClick={() => handleChatQuestion(
                        "How long does the conversion setup take?",
                        "Instantly! As soon as your checkout config completes, you'll receive setup keys in your email inbox to activate the software suite immediately."
                      )}
                      className="text-left w-full px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 text-[11px] text-white/70 hover:text-cyan-400 transition-all uppercase tracking-wide font-sans"
                    >
                      Software Setup Duration?
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Input Footer */}
              <form onSubmit={handleSendCustomMessage} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask Alex a custom question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  className="p-2 bg-white text-black hover:bg-cyan-400 rounded-xl transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Support floating button trigger */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
        >
          {showChat ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <MessageSquare className="w-6 h-6 text-black" />
          )}
          {/* Subtle notification badge */}
          {!showChat && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-400 border-2 border-[#020617] rounded-full" />
          )}

          {/* Tooltip */}
          <span className="absolute right-16 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold tracking-widest text-white px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Support Chat
          </span>
        </button>
      </div>
    </section>
  );
}