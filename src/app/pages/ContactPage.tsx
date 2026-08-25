import { useRef, useState, type FormEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { submitContactInquiry } from '../lib/api';

// ─── DESIGN TOKENS (matches LearnMorePage) ────────────────────────────────────
const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

// ─── FADE UP ──────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── POLYGON SHARD ────────────────────────────────────────────────────────────
function Shard({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" fill="none" stroke={T.border} strokeWidth="1" />
      <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill={T.border} opacity="0.06" />
    </svg>
  );
}

const serviceOptions = [
  'Stereo Conversion',
  '3D Books',
  '3D Short Films',
  'Immersive Advertising',
  'Depth Compositing',
  'VR / Vision Pro',
  'Other / Not sure',
];

const highlights = [
  { num: '14+', label: 'Years of depth', desc: 'A decade of high-end stereo conversion for cinema and digital.' },
  { num: '∞', label: 'Platforms supported', desc: 'Cinema, OTT, mobile, VR — we deliver for every screen.' },
  { num: '100%', label: 'Frame precision', desc: 'Every frame treated with surgical accuracy, no shortcuts.' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: T.bg,
  border: `1px solid ${T.border}`,
  borderRadius: 4,
  padding: '14px 16px',
  color: T.text,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Inter, system-ui, sans-serif',
};

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitContactInquiry({
        name,
        email,
        company: company.trim() || null,
        service,
        message,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setCompany('');
      setService('');
      setMessage('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not send inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══ 01 · HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '70vh', background: T.bg, paddingTop: 128 }} className="relative flex items-center overflow-hidden">
        <Shard size={52} className="absolute top-24 right-[10%] opacity-50" />
        <Shard size={30} className="absolute bottom-24 right-[28%] opacity-25" />
        <Shard size={42} className="absolute top-[40%] left-[1%] opacity-20" />

        <div className="w-full max-w-screen-xl mx-auto px-8 lg:px-16 pb-20">
          <FadeUp delay={0.04}>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: T.sub }}>
              Service inquiry
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-black leading-none tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)', letterSpacing: '-0.03em' }}>
              Let&apos;s create<br />something with{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                real depth.
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className="text-base mb-10 leading-relaxed max-w-lg" style={{ color: T.sub }}>
              Tell us about your project — stereo conversion, immersive books, spatial advertising, or anything
              in between. We&apos;ll come back with how we can help.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="text-sm" style={{ color: T.sub }}>
              Applying for a role?{' '}
              <Link to="/careers#apply" className="font-bold underline underline-offset-2" style={{ color: T.text }}>
                Use the careers form →
              </Link>
            </p>
          </FadeUp>
        </div>

        <div className="absolute bottom-0 left-8 right-8 lg:left-16 lg:right-16 h-px" style={{ background: T.border }} />
      </section>

      {/* ══ 02 · HIGHLIGHTS ════════════════════════════════════════════════════════ */}
      <section style={{ background: T.bgAlt, padding: '72px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ border: `1px solid ${T.border}` }}>
            {highlights.map((h, i) => (
              <FadeUp key={h.label} delay={i * 0.08}>
                <div className="flex flex-col p-8 h-full"
                  style={{ background: T.bg, borderRight: `1px solid ${T.border}` }}>
                  <span className="font-black mb-2"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.03em', color: T.text }}>
                    {h.num}
                  </span>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>
                    {h.label}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: T.sub }}>{h.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 03 · FORM ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: T.bg, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left — context */}
            <FadeUp className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: T.sub }}>
                Tell us about your project
              </p>
              <h2 className="font-black leading-none tracking-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.03em' }}>
                Start the<br />conversation.
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: T.sub }}>
                Fill in what you know — scope, timelines, platform — and we&apos;ll take it from there.
                We typically reply within one working day.
              </p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                {[['odistudio24@gmail.com', 'Email'], ['India · Worldwide', 'Location']].map(([v, l]) => (
                  <div key={l} className="mb-4">
                    <div className="text-sm font-bold">{v}</div>
                    <div className="text-[10px] tracking-wide uppercase mt-0.5" style={{ color: T.sub }}>{l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Right — form */}
            <FadeUp delay={0.1} className="lg:col-span-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-20 px-8"
                  style={{ border: `1px solid ${T.border}` }}>
                  <CheckCircle2 className="w-10 h-10 mb-4" style={{ color: '#6366f1' }} />
                  <h3 className="font-black text-xl mb-2 tracking-tight">Inquiry received</h3>
                  <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: T.sub }}>
                    Thanks — we saved your project details. Our team will review and get back to you.
                  </p>
                  <button onClick={() => setSubmitted(false)}
                    className="text-sm font-bold underline underline-offset-2" style={{ color: T.text }}>
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  action="#"
                  method="post"
                  style={{ border: `1px solid ${T.border}` }}
                >
                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <div className="p-6 md:p-8" style={{ borderRight: `1px solid ${T.border}` }}>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Your name" style={inputStyle} />
                    </div>
                    <div className="p-6 md:p-8">
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Work email</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com" style={inputStyle} />
                    </div>
                  </div>

                  {/* Company + Service */}
                  <div className="grid md:grid-cols-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <div className="p-6 md:p-8" style={{ borderRight: `1px solid ${T.border}` }}>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>
                        Company / brand <span className="normal-case tracking-normal font-normal">(optional)</span>
                      </label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                        placeholder="Studio or brand name" style={inputStyle} />
                    </div>
                    <div className="p-6 md:p-8">
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Service interest</label>
                      <select required value={service} onChange={(e) => setService(e.target.value)} style={inputStyle}>
                        <option value="" disabled>Select a service</option>
                        {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="p-6 md:p-8" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Project details</label>
                    <textarea required rows={6} value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Scope, timelines, deliverables, platforms (cinema, OTT, kids books, ads…)"
                      style={{ ...inputStyle, resize: 'none' }} />
                  </div>

                  {/* Submit */}
                  <div className="p-6 md:p-8">
                    {submitError && (
                      <p className="text-sm text-red-600 mb-4">{submitError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-10 py-4 text-sm font-bold tracking-widest uppercase inline-flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                      style={{ background: T.text, color: T.bg }}
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting ? 'Sending…' : 'Send service inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </FadeUp>
          </div>
        </div>
      </section>
    </main>
  );
}
