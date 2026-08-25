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
      {/* Hero */}
      <section
        className="border-b border-neutral-100"
        style={{
          background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgAlt} 100%)`,
          paddingTop: 120,
          paddingBottom: 56,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>
              {eyebrow}
            </p>
            <h1
              className="font-black leading-[1.05] tracking-tight mb-5 max-w-3xl"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', letterSpacing: '-0.03em' }}
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
            <p className="text-sm font-medium mb-4" style={{ color: T.sub }}>
              Last updated: {lastUpdated}
            </p>
            <p className="text-base sm:text-lg leading-relaxed max-w-3xl" style={{ color: T.sub }}>
              {intro}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Body: TOC + content */}
      <section style={{ background: T.bgAlt, padding: '56px 0 96px' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-16">
            {/* Sidebar TOC */}
            <aside className="mb-10 lg:mb-0">
              <nav
                className="lg:sticky lg:top-28 rounded-2xl p-5 sm:p-6"
                style={{ background: T.bg, border: `1px solid ${T.border}` }}
                aria-label="On this page"
              >
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: T.sub }}>
                  On this page
                </p>
                <ol className="space-y-1.5">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex gap-2.5 rounded-lg px-2 py-1.5 text-[13px] sm:text-sm font-medium leading-snug transition-colors hover:bg-neutral-50"
                        style={{ color: T.text }}
                      >
                        <span className="shrink-0 tabular-nums text-neutral-400 group-hover:text-cyan-500">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="group-hover:underline underline-offset-2">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Main article */}
            <div className="min-w-0">
              <div
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12"
                style={{ background: T.bg, border: `1px solid ${T.border}` }}
              >
                <div className="space-y-10 sm:space-y-12">
                  {sections.map((section, i) => (
                    <FadeUp key={section.id} delay={Math.min(i * 0.03, 0.24)}>
                      <article
                        id={section.id}
                        className="scroll-mt-28 pb-10 sm:pb-12 border-b last:border-b-0 last:pb-0"
                        style={{ borderColor: T.border }}
                      >
                        <div className="flex items-baseline gap-3 mb-4">
                          <span
                            className="text-xs font-bold tracking-widest tabular-nums shrink-0"
                            style={{ color: '#22d3ee' }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h2
                            className="font-black tracking-tight"
                            style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', letterSpacing: '-0.02em' }}
                          >
                            {section.title}
                          </h2>
                        </div>
                        <div
                          className="pl-0 sm:pl-9 space-y-4 text-[15px] sm:text-base leading-7 [&_strong]:font-semibold [&_strong]:text-neutral-800 [&_a]:font-semibold [&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-neutral-300 hover:[&_a]:decoration-neutral-700"
                          style={{ color: T.sub }}
                        >
                          {section.content}
                        </div>
                      </article>
                    </FadeUp>
                  ))}
                </div>
              </div>

              <FadeUp delay={0.15}>
                <div
                  className="mt-10 pt-8 border-t flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5 text-sm"
                  style={{ borderColor: T.border }}
                >
                  <span className="font-medium" style={{ color: T.sub }}>
                    Related policies
                  </span>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
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
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p className="max-w-none">{children}</p>;
}

export function LegalUl({ children }: { children: ReactNode }) {
  return (
    <ul className="list-none space-y-3.5 pl-0 [&>li]:relative [&>li]:pl-5 [&>li]:leading-7 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-cyan-400">
      {children}
    </ul>
  );
}
