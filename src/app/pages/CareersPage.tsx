import { useRef, useState, type FormEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Send, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router';

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

const CAREERS_INBOX = 'odistudio24@gmail.com';
const roleOptions = ['Designers', '3D Artists', 'Editors', 'Creative thinkers', 'Other'];

const benefits = [
  { label: 'Real projects', desc: 'Ship spatial media and immersive content that reaches audiences worldwide — not mock briefs.' },
  { label: 'Learn fast', desc: 'Grow beside specialists in stereo conversion, 3D storytelling, and depth craft.' },
  { label: 'Future-ready', desc: 'Master workflows built for screens, spaces, and next-gen immersive platforms.' },
];

const roles = [
  { num: '01', title: 'Designers', desc: 'Visual systems, product UI, and brand craft for immersive experiences.' },
  { num: '02', title: '3D Artists', desc: 'Modeling, lighting, and spatial storytelling that feels natural in depth.' },
  { num: '03', title: 'Editors', desc: 'Pace, rhythm, and frame-perfect finishing for stereo and spatial content.' },
  { num: '04', title: 'Creative thinkers', desc: 'Ideas that push how stories, products, and brands live in 3D.' },
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

export default function CareersPage() {
  const [roleVal, setRoleVal] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const prefillRole = (title: string) => {
    setRoleVal(title);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Careers Application] ${roleVal || 'Open role'} — ${fullName}`);
    const body = encodeURIComponent(
      ['CAREERS APPLICATION', '──────────────────',
        `Role: ${roleVal}`, `Name: ${fullName}`, `Email: ${email}`,
        `Phone: ${phone || '—'}`, `Portfolio: ${portfolio || '—'}`, '', 'Cover note:', note,
      ].join('\n'),
    );
    window.location.href = `mailto:${CAREERS_INBOX}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══ 01 · HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', background: T.bg }} className="relative flex items-center overflow-hidden">
        <Shard size={56} className="absolute top-20 right-[13%] opacity-40" />
        <Shard size={32} className="absolute bottom-28 right-[30%] opacity-20" />
        <Shard size={44} className="absolute top-[45%] left-[1%] opacity-15" />

        <div className="w-full max-w-screen-xl mx-auto px-8 lg:px-16 grid grid-cols-12 gap-8 items-center py-28">
          {/* Left — copy */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <FadeUp delay={0.08}>
              <h1 className="font-black leading-none tracking-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.03em' }}>
                Join the team<br />behind the{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  depth.
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.14}>
              <p className="text-base mb-10 leading-relaxed max-w-sm" style={{ color: T.sub }}>
                Shape spatial media and immersive content with a studio that lives for stereoscopic storytelling.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap gap-3">
                <a href="#apply"
                  className="px-7 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                  style={{ background: T.text, color: T.bg }}>
                  Apply Now <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#open-roles"
                  className="px-7 py-3.5 text-sm font-semibold tracking-wide border transition-transform hover:-translate-y-0.5"
                  style={{ background: 'transparent', color: T.text, borderColor: T.border }}>
                  See open roles
                </a>
              </div>
            </FadeUp>
          </div>

          {/* Right — image */}
          <div className="col-span-12 lg:col-span-7 flex items-center justify-center">
            <FadeUp delay={0.2} className="w-full">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ border: `1px solid ${T.border}` }}>
                <img
                  src="/Footer.png"
                  alt="ODI Studio 3D workspace"
                  className="w-full h-auto max-h-[520px] object-cover object-center"
                />
              </div>
            </FadeUp>
          </div>
        </div>

        <div className="absolute bottom-0 left-8 right-8 lg:left-16 lg:right-16 h-px" style={{ background: T.border }} />
      </section>

      {/* ══ 02 · WHY JOIN ══════════════════════════════════════════════════════════ */}
      <section style={{ background: T.bgAlt, padding: '96px 0' }}>
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>01 — Why join us</p>
            <h2 className="font-black leading-none tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}>
              More than a{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                job.
              </span>
            </h2>
            <p className="text-base mb-14 max-w-lg leading-relaxed" style={{ color: T.sub }}>
              Perks matter, but what we really offer is craft. Real stereoscopic work, real audiences, real depth.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ border: `1px solid ${T.border}` }}>
            {benefits.map((b, i) => (
              <FadeUp key={b.label} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="flex flex-col p-8"
                  style={{ background: T.bg, borderRight: `1px solid ${T.border}` }}>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: T.sub }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-black mb-3 tracking-tight" style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', letterSpacing: '-0.02em' }}>
                    {b.label}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.sub }}>{b.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 03 · OPEN ROLES ════════════════════════════════════════════════════════ */}
      <section id="open-roles" style={{ background: T.bg, padding: '96px 0' }} className="scroll-mt-24">
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>02 — We are looking for</p>
            <h2 className="font-black leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}>
              Your craft,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                our studio.
              </span>
            </h2>
            <p className="text-base mb-14 max-w-md leading-relaxed" style={{ color: T.sub }}>
              Tap a role to pre-fill the application below.
            </p>
          </FadeUp>

          <div style={{ border: `1px solid ${T.border}` }}>
            {roles.map((r, i) => (
              <FadeUp key={r.title} delay={i * 0.06}>
                <motion.button
                  type="button"
                  onClick={() => prefillRole(r.title)}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="w-full text-left flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 p-6 md:p-8 group"
                  style={{ borderBottom: i < roles.length - 1 ? `1px solid ${T.border}` : 'none', background: T.bg }}
                >
                  <span className="text-xs font-bold tracking-widest shrink-0" style={{ color: T.border }}>{r.num}</span>
                  <h3 className="font-black tracking-tight shrink-0 sm:w-44"
                    style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', letterSpacing: '-0.02em' }}>
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: T.sub }}>{r.desc}</p>
                  <span className="text-xs font-semibold tracking-widest uppercase shrink-0 inline-flex items-center gap-1.5"
                    style={{ color: T.sub }}>
                    Apply <ArrowRight className="w-3 h-3" />
                  </span>
                </motion.button>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 04 · APPLICATION FORM ══════════════════════════════════════════════════ */}
      <section id="apply" style={{ background: T.bgAlt, padding: '96px 0' }} className="scroll-mt-24">
        <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left — context */}
            <FadeUp className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: T.sub }}>03 — Apply</p>
              <h2 className="font-black leading-none tracking-tight mb-5"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.03em' }}>
                Send us<br />your work.
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: T.sub }}>
                This form is for job applications only — role, portfolio, and a short note about your experience.
              </p>
              <p className="text-sm" style={{ color: T.sub }}>
                For project or service inquiries,{' '}
                <Link to="/contact" className="font-bold underline underline-offset-2" style={{ color: T.text }}>
                  use the contact form
                </Link>
                .
              </p>
            </FadeUp>

            {/* Right — form */}
            <FadeUp delay={0.1} className="lg:col-span-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 px-8"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <CheckCircle2 className="w-10 h-10 mb-4" style={{ color: '#6366f1' }} />
                  <h3 className="font-black text-xl mb-2 tracking-tight">Application draft ready</h3>
                  <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: T.sub }}>
                    Your email client should open with the form pre-filled. Send it to complete your submission.
                  </p>
                  <button onClick={() => setSubmitted(false)}
                    className="text-sm font-bold underline underline-offset-2" style={{ color: T.text }}>
                    Submit another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  {/* field helper */}
                  {([
                    null, // role select — handled separately
                  ])}

                  {/* Role */}
                  <div className="p-6 md:p-8" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>
                      Role you&apos;re applying for
                    </label>
                    <select required value={roleVal} onChange={(e) => setRoleVal(e.target.value)} style={inputStyle}>
                      <option value="" disabled>Select a role</option>
                      {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <div className="p-6 md:p-8" style={{ borderRight: `1px solid ${T.border}` }}>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Full name</label>
                      <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name" style={inputStyle} />
                    </div>
                    <div className="p-6 md:p-8">
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Email</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com" style={inputStyle} />
                    </div>
                  </div>

                  {/* Phone + Portfolio */}
                  <div className="grid md:grid-cols-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <div className="p-6 md:p-8" style={{ borderRight: `1px solid ${T.border}` }}>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>
                        Phone <span className="normal-case tracking-normal font-normal">(optional)</span>
                      </label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 …" style={inputStyle} />
                    </div>
                    <div className="p-6 md:p-8">
                      <label className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>
                        Portfolio / LinkedIn <LinkIcon className="w-3 h-3" />
                      </label>
                      <input required type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://" style={inputStyle} />
                    </div>
                  </div>

                  {/* Cover note */}
                  <div className="p-6 md:p-8" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>Cover note</label>
                    <textarea required rows={5} value={note} onChange={(e) => setNote(e.target.value)}
                      placeholder="Tell us about your experience, tools, and why you want to join ODI…"
                      style={{ ...inputStyle, resize: 'none' }} />
                  </div>

                  {/* Submit */}
                  <div className="p-6 md:p-8">
                    <button type="submit"
                      className="w-full sm:w-auto px-10 py-4 text-sm font-bold tracking-widest uppercase inline-flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5"
                      style={{ background: T.text, color: T.bg }}>
                      <Send className="w-4 h-4" />
                      Submit application
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
