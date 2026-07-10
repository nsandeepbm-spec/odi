import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

// Hexagon shard motif borrowed from the Learn More page
export function Shard({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke={T.border} strokeWidth="1" />
      <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill={T.border} opacity="0.06" />
    </svg>
  );
}

export const authInput =
  'w-full px-4 py-3.5 text-sm border outline-none transition-colors bg-white placeholder:text-neutral-400 focus:border-neutral-900';

export function AuthShell({
  headline,
  accent,
  tagline,
  points,
  children,
}: {
  headline: string;
  accent: string;
  tagline: string;
  points: string[];
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative"
      style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: T.sub }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* ── Left · Brand panel ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: T.bgAlt, borderRight: `1px solid ${T.border}` }}
      >
        <Shard size={64} className="absolute top-24 right-[12%] opacity-60" />
        <Shard size={36} className="absolute top-[55%] right-[28%] opacity-40" />
        <Shard size={48} className="absolute bottom-24 left-[8%] opacity-30" />

        <div className="pt-10">
          <Link to="/" className="font-black text-3xl tracking-tight">
            ODI
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">.</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2
            className="font-black leading-none tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.25rem, 3.5vw, 3.75rem)', letterSpacing: '-0.03em' }}
          >
            {headline}
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {accent}
            </span>
          </h2>
          <p className="text-base leading-relaxed max-w-sm mb-12" style={{ color: T.sub }}>
            {tagline}
          </p>
          <div className="flex flex-col gap-4">
            {points.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-4"
              >
                <div className="w-4 h-px" style={{ background: T.text }} />
                <span className="text-sm font-semibold tracking-wide">{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-8" style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
          {[['3D Books', 'Stereo Real'], ['Free', 'Shipping'], ['Secure', 'Checkout']].map(([v, l]) => (
            <div key={l}>
              <div className="text-sm font-bold">{v}</div>
              <div className="text-[10px] tracking-wide uppercase mt-0.5" style={{ color: T.sub }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right · Form ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-6 md:p-12 relative overflow-hidden" style={{ background: T.bg }}>
        <Shard size={44} className="absolute top-16 right-[10%] opacity-40 lg:hidden" />
        <Shard size={28} className="absolute bottom-20 left-[12%] opacity-30 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthShell;
