import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

export default function CheckoutLayout() {
  const location = useLocation();
  
  const steps = [
    { name: 'Details', path: '/checkout' },
    { name: 'Payment', path: '/checkout/payment' },
    { name: 'Confirmation', path: '/checkout/success' }
  ];

  const currentStepIndex = steps.findIndex(s => location.pathname === s.path || location.pathname === s.path + '/');
  
  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.bgAlt, color: T.text }}>
      
      {/* Minimal Checkout Header */}
      <header className="bg-white border-b border-neutral-100 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-neutral-900 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <div className="font-black text-xl tracking-tight">ODI<span className="text-indigo-500">.</span> Checkout</div>
          <div className="w-[100px]" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Stepper */}
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 -z-10" />
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            return (
              <div key={step.name} className="flex flex-col items-center gap-2 bg-[#F7F7F5] px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted ? 'bg-indigo-500 text-white' : 
                  isActive ? 'bg-neutral-900 text-white ring-4 ring-neutral-200' : 'bg-white border border-neutral-200 text-neutral-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive || isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 pb-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
