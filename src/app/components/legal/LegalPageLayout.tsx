import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { Mail, Phone, Globe, MapPin, Building2 } from 'lucide-react';
import { LEGAL_COMPANY } from '../../data/legalCompany';
import { splitLinkedText } from '../../lib/legalFormat';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };
/** Match Navbar shell: max-w-[1400px] + px-6 md:px-10 lg:px-16 */
const SHELL = 'max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16';

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
  title: string;
  titleAccent?: string;
  lastUpdated: string;
  effectiveDate?: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPageLayout({
  title,
  titleAccent,
  lastUpdated,
  effectiveDate,
  intro,
  sections,
}: LegalPageLayoutProps) {
  return (
    <main style={{ background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <section
        className="border-b border-neutral-100 pt-40 sm:pt-44 md:pt-48 pb-10 sm:pb-12 md:pb-14"
        style={{
          background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgAlt} 100%)`,
        }}
      >
        <div className={SHELL}>
          <FadeUp>
            <h1
              className="font-black leading-[1.05] tracking-tight mb-5 max-w-4xl"
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
            <p className="text-base sm:text-[17px] leading-8 max-w-4xl mb-4" style={{ color: T.sub }}>
              {intro}
            </p>
            <p className="text-sm" style={{ color: '#8A8A8A' }}>
              {effectiveDate ? `Effective ${effectiveDate}` : null}
              {effectiveDate && lastUpdated ? ' · ' : null}
              {lastUpdated ? `Last updated ${lastUpdated}` : null}
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 md:pb-24 pt-8 sm:pt-10 md:pt-12" style={{ background: T.bgAlt }}>
        <div className={SHELL}>
          <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-16">
            <aside className="mb-8 lg:mb-0">
              <nav
                className="lg:sticky lg:top-32 xl:top-36 rounded-2xl p-4 sm:p-5"
                style={{ background: T.bg, border: `1px solid ${T.border}` }}
                aria-label="On this page"
              >
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3 px-1" style={{ color: T.sub }}>
                  On this page
                </p>
                <ol className="flex flex-col gap-1">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex gap-2.5 rounded-xl px-2.5 py-2 text-[13px] sm:text-sm font-medium leading-snug transition-colors hover:bg-neutral-50"
                        style={{ color: T.text }}
                      >
                        <span className="shrink-0 tabular-nums text-[11px] font-bold text-cyan-600 bg-cyan-50 rounded-md px-1.5 py-0.5 h-fit group-hover:bg-cyan-100">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 group-hover:underline underline-offset-2">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="min-w-0">
              <div
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-11"
                style={{ background: T.bg, border: `1px solid ${T.border}` }}
              >
                <div className="divide-y" style={{ borderColor: T.border }}>
                  {sections.map((section, i) => (
                    <FadeUp key={section.id} delay={Math.min(i * 0.03, 0.24)}>
                      <article id={section.id} className="scroll-mt-32 md:scroll-mt-36 py-8 sm:py-10 first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3 sm:gap-4 mb-5">
                          <span className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 text-xs font-black tabular-nums flex items-center justify-center">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h2
                            className="font-black tracking-tight pt-1"
                            style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)', letterSpacing: '-0.02em' }}
                          >
                            {section.title}
                          </h2>
                        </div>
                        <div className="sm:pl-[52px] space-y-4 text-[15px] sm:text-[16px] leading-8">{section.content}</div>
                      </article>
                    </FadeUp>
                  ))}
                </div>
              </div>

              <FadeUp delay={0.15}>
                <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: T.sub }}>
                    Related
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { to: '/privacy', label: 'Privacy Policy' },
                      { to: '/terms', label: 'Terms & Conditions' },
                      { to: '/cookies', label: 'Cookies Policy' },
                      { to: '/contact', label: 'Contact' },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-full px-3.5 py-1.5 text-sm font-semibold border hover:bg-white transition-colors"
                        style={{ color: T.text, borderColor: T.border, background: T.bg }}
                      >
                        {item.label}
                      </Link>
                    ))}
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
  if (typeof children === 'string') {
    return (
      <p className="max-w-none" style={{ color: T.sub }}>
        <LegalInline text={children} />
      </p>
    );
  }
  return (
    <p className="max-w-none" style={{ color: T.sub }}>
      {children}
    </p>
  );
}

export function LegalInline({ text }: { text: string }) {
  return (
    <>
      {splitLinkedText(text).map((part, i) =>
        part.type === 'link' && part.href ? (
          <a
            key={i}
            href={part.href}
            className="font-semibold text-neutral-900 underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-700"
            target={part.href.startsWith('http') ? '_blank' : undefined}
            rel={part.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {part.value}
          </a>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </>
  );
}

export function LegalH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-bold text-neutral-900 text-[15px] sm:text-base tracking-tight pl-3 border-l-2 border-cyan-400 mt-2 first:mt-0 mb-1">
      {children}
    </h3>
  );
}

export function LegalUl({ children }: { children: ReactNode }) {
  return (
    <ul
      className="list-none space-y-2.5 rounded-2xl px-4 sm:px-5 py-4 my-1 [&>li]:relative [&>li]:pl-5 [&>li]:leading-7 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-cyan-400"
      style={{ background: T.bgAlt, border: `1px solid ${T.border}`, color: T.sub }}
    >
      {children}
    </ul>
  );
}

export type LegalCompanyInfo = {
  brand: string;
  entity: string;
  address: string;
  gstin: string;
  email: string;
  phone: string;
  websiteHref: string;
  websiteLabel: string;
};

function phoneHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, '');
  return `tel:${compact}`;
}

export function LegalContactCard({ company }: { company?: LegalCompanyInfo }) {
  const c = company ?? LEGAL_COMPANY;
  const rows = [
    { icon: Building2, label: 'Entity', value: c.entity },
    { icon: MapPin, label: 'Address', value: c.address },
    { icon: Mail, label: 'Email', value: c.email, href: `mailto:${c.email}` },
    { icon: Phone, label: 'Phone', value: c.phone, href: phoneHref(c.phone) },
    { icon: Globe, label: 'Website', value: c.websiteLabel, href: c.websiteHref, external: true },
  ];

  return (
    <address
      className="not-italic rounded-2xl border overflow-hidden my-1"
      style={{ borderColor: T.border, background: T.bgAlt }}
    >
      <div className="px-4 sm:px-5 py-3 border-b" style={{ borderColor: T.border }}>
        <p className="font-bold text-neutral-900">{c.brand}</p>
        <p className="text-xs mt-0.5" style={{ color: T.sub }}>
          GSTIN {c.gstin}
        </p>
      </div>
      <dl className="divide-y" style={{ borderColor: T.border }}>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex gap-3 px-4 sm:px-5 py-3">
              <Icon className="w-4 h-4 mt-0.5 shrink-0 text-cyan-600" />
              <div className="min-w-0">
                <dt className="text-[10px] font-bold tracking-[0.16em] uppercase mb-0.5" style={{ color: T.sub }}>
                  {row.label}
                </dt>
                <dd className="text-[15px] leading-6 text-neutral-800 break-words">
                  {row.href ? (
                    <a
                      href={row.href}
                      className="font-semibold underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-700"
                      target={row.external ? '_blank' : undefined}
                      rel={row.external ? 'noreferrer' : undefined}
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </address>
  );
}
