import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy registration
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: T.bgAlt, color: T.text }}>
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: T.sub }}>
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-neutral-100 mt-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">Create Account</h1>
          <p className="text-sm" style={{ color: T.sub }}>Join us to manage your orders and more.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0 bg-neutral-900 shadow-md"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm" style={{ color: T.sub }}>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-neutral-900 hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
