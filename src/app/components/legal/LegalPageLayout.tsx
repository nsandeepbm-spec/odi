import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPageLayout({
  eyebrow,
  title,
  titleAccent,
  lastUpdated,
  intro,
  sections,
}: LegalPageLayoutProps) {
  return (
    <main style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <section style={{ background: T.bg, paddingTop: 128, paddingBottom: 48 }} className="border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-8 lg:px-16">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>
              {eyebrow}
            </p>
            <h1
              className="font-black leading-none tracking-tight mb-4"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.03em' }}
            >
              {title}
              {titleAccent ? (
                <>
                  {' '}
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    {titleAccent}
                  </span>
                </>
              ) : null}
            </h1>
            <p className="text-sm mb-2" style={{ color: T.sub }}>
              Last updated: {lastUpdated}
            </p>
            <p className="text-base leading-relaxed" style={{ color: T.sub }}>
              {intro}
            </p>
          </FadeUp>
        </div>
      </section>

      <section style={{ background: T.bgAlt, padding: '64px 0 96px' }}>
        <div className="max-w-3xl mx-auto px-8 lg:px-16">
          <nav
            className="mb-12 p-5 rounded-lg"
            style={{ background: T.bg, border: `1px solid ${T.border}` }}
            aria-label="On this page"
          >
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: T.sub }}>
              On this page
            </p>
            <ol className="space-y-2">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm font-medium hover:underline underline-offset-2"
                    style={{ color: T.text }}
                  >
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <FadeUp key={section.id} delay={i * 0.04}>
                <article id={section.id} className="scroll-mt-28">
                  <h2
                    className="font-black tracking-tight mb-4 pb-3 border-b"
                    style={{ fontSize: '1.35rem', letterSpacing: '-0.02em', borderColor: T.border }}
                  >
                    {section.title}
                  </h2>
                  <div
                    className="space-y-4 text-sm leading-relaxed legal-prose"
                    style={{ color: T.sub }}
                  >
                    {section.content}
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div
              className="mt-16 pt-8 border-t flex flex-wrap gap-4 text-sm"
              style={{ borderColor: T.border }}
            >
              <span style={{ color: T.sub }}>Related:</span>
              <Link to="/privacy" className="font-bold hover:underline underline-offset-2" style={{ color: T.text }}>
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-bold hover:underline underline-offset-2" style={{ color: T.text }}>
                Terms of Service
              </Link>
              <Link to="/cookies" className="font-bold hover:underline underline-offset-2" style={{ color: T.text }}>
                Cookies Policy
              </Link>
              <Link to="/contact" className="font-bold hover:underline underline-offset-2" style={{ color: T.text }}>
                Contact
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function LegalUl({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2">{children}</ul>;
}
