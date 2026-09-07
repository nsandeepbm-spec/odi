import { motion } from 'motion/react';
import { ArrowRight, BookOpen, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

const ease = [0.25, 0.1, 0.25, 1] as const;

interface PageCTAProps {
  heading?: string;
  subtext?: string;
  showServices?: boolean;
  showOrder?: boolean;
  showContact?: boolean;
}

export function PageCTA({
  heading = "Let's build something real.",
  subtext = "Every project is different, and we treat each one like a blank canvas. Let's talk about how we can bring true depth to your next idea.",
  showServices = true,
  showOrder = true,
  showContact = true,
}: PageCTAProps) {
  return (
    <section className="bg-neutral-900 px-6 py-28 text-center text-white md:py-36 overflow-hidden relative">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 110%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="relative mx-auto max-w-3xl"
      >
        <motion.p
          className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
        >
          Ready to get started?
        </motion.p>

        <h2
          className="mb-6 font-bold tracking-tight text-white"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
          }}
        >
          {heading}
        </h2>

        <p className="mb-14 text-lg font-medium leading-relaxed text-neutral-400 max-w-2xl mx-auto md:text-xl">
          {subtext}
        </p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        >
          {showServices && (
            <Link
              to="/services"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              <BookOpen className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
              Explore Services
              <ArrowRight className="h-4 w-4 text-white/40 group-hover:translate-x-0.5 group-hover:text-white transition-all duration-300" />
            </Link>
          )}

          {showOrder && (
            <Link
              to="/checkout?product=space-explorer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-indigo-500/40 bg-indigo-600/20 px-7 py-3.5 text-sm font-semibold text-indigo-300 backdrop-blur-sm transition-all hover:border-indigo-400/60 hover:bg-indigo-600/30 hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              Order Now
              <ArrowRight className="h-4 w-4 text-indigo-400/60 group-hover:translate-x-0.5 group-hover:text-white transition-all duration-300" />
            </Link>
          )}

          {showContact && (
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-neutral-900 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-2xl"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          )}
        </motion.div>

        <div className="mt-16 flex items-center justify-center gap-6 text-neutral-700">
          <div className="h-px w-16 bg-neutral-800" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600">
            ODI Studio
          </span>
          <div className="h-px w-16 bg-neutral-800" />
        </div>
      </motion.div>
    </section>
  );
}
