import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  LegalPageLayout,
  LegalP,
  LegalUl,
  LegalH3,
  LegalContactCard,
  LegalInline,
} from './LegalPageLayout';
import { getPublicLegalPage, type LegalBlock, type LegalCompany, type LegalSlug } from '../../lib/api';

function Blocks({ blocks, company }: { blocks: LegalBlock[]; company: LegalCompany }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'p') return <LegalP key={i}>{block.text}</LegalP>;
        if (block.type === 'h3') return <LegalH3 key={i}>{block.text}</LegalH3>;
        if (block.type === 'ul') {
          return (
            <LegalUl key={i}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <LegalInline text={item} />
                </li>
              ))}
            </LegalUl>
          );
        }
        return <LegalContactCard key={i} company={company} />;
      })}
    </>
  );
}

export default function LegalCmsPage({ slug }: { slug: LegalSlug }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [payload, setPayload] = useState<Awaited<ReturnType<typeof getPublicLegalPage>> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicLegalPage(slug);
      setPayload(data);
    } catch (err) {
      setPayload(null);
      setError(err instanceof Error ? err.message : 'Could not load this page');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white flex items-center justify-center px-6">
        <p className="text-sm font-medium text-neutral-500">Loading…</p>
      </main>
    );
  }

  if (error || !payload) {
    return (
      <main className="min-h-[70vh] bg-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-lg font-bold text-neutral-900 mb-2">This page is unavailable</p>
          <p className="text-sm text-neutral-500 mb-6">{error ?? 'Please try again.'}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setReloadKey((n) => n + 1)}
              className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-semibold"
            >
              Try again
            </button>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-900"
            >
              Contact us
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { page, company } = payload;

  return (
    <LegalPageLayout
      title={page.title}
      titleAccent={page.titleAccent}
      lastUpdated={page.lastUpdated}
      effectiveDate={page.effectiveDate}
      intro={page.intro}
      sections={page.sections.map((section) => ({
        id: section.id,
        title: section.title,
        content: <Blocks blocks={section.blocks} company={company} />,
      }))}
    />
  );
}
