import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Scale,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Save,
} from 'lucide-react';
import { PageHeader, Card, DashboardSkeleton } from '../../../components/dashboard/shared';
import {
  getAdminLegalPage,
  updateAdminLegalPage,
  restoreAdminLegalPage,
  updateAdminLegalCompany,
  type LegalCompany,
  type LegalPageDto,
  type LegalSectionDto,
  type LegalSlug,
} from '../../../lib/api';
import { blocksToText, textToBlocks } from '../../../lib/legalFormat';

const fieldCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-[#050505] text-sm text-white outline-none focus:border-cyan-500/40';
const labelCls = 'text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-1.5 block';
const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 disabled:opacity-50';
const btnGhost =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.1] text-sm font-semibold text-white hover:bg-white/[0.04] disabled:opacity-50';

type Tab = LegalSlug | 'company';

const TABS: { id: Tab; label: string; href?: string }[] = [
  { id: 'terms', label: 'Terms', href: '/terms' },
  { id: 'privacy', label: 'Privacy', href: '/privacy' },
  { id: 'cookies', label: 'Cookies', href: '/cookies' },
  { id: 'company', label: 'Company' },
];

function slugify(value: string, fallback: string) {
  const id = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return id || fallback;
}

function uniqueId(desired: string, existing: string[]) {
  const base = slugify(desired, 'section');
  if (!existing.includes(base)) return base;
  let n = 2;
  while (existing.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = index + dir;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const tmp = copy[index];
  copy[index] = copy[next];
  copy[next] = tmp;
  return copy;
}

function SectionEditor({
  section,
  body,
  index,
  total,
  onTitle,
  onBody,
  onRemove,
  onMove,
}: {
  section: LegalSectionDto;
  body: string;
  index: number;
  total: number;
  onTitle: (title: string) => void;
  onBody: (body: string) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-4 sm:px-5 py-3 bg-[#0d0d0d] border-b border-white/[0.06] flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tabular-nums text-cyan-400">{String(index + 1).padStart(2, '0')}</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none"
          value={section.title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="Section title"
        />
        <div className="flex items-center gap-1">
          <button type="button" className={btnGhost + ' !px-2.5'} disabled={index === 0} onClick={() => onMove(-1)}>
            <ChevronUp className="w-4 h-4" />
          </button>
          <button type="button" className={btnGhost + ' !px-2.5'} disabled={index === total - 1} onClick={() => onMove(1)}>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button type="button" className={btnGhost + ' !px-2.5 text-red-300'} disabled={total <= 1} onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <textarea
          className={`${fieldCls} min-h-[160px] resize-y leading-7`}
          value={body}
          onChange={(e) => onBody(e.target.value)}
          placeholder={'Write the section.\n\nBlank line = new paragraph\n- bullet\n## subheading\n@company'}
        />
      </div>
    </div>
  );
}

export default function AdminLegalPagesPage() {
  const [tab, setTab] = useState<Tab>('privacy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [page, setPage] = useState<LegalPageDto | null>(null);
  const [bodies, setBodies] = useState<string[]>([]);
  const [company, setCompany] = useState<LegalCompany | null>(null);

  const load = useCallback(async (next: Tab) => {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      if (next === 'company') {
        const data = await getAdminLegalPage('privacy');
        setCompany(data.company);
        setPage(null);
        setBodies([]);
      } else {
        const data = await getAdminLegalPage(next);
        setPage(data.page);
        setBodies(data.page.sections.map((s) => blocksToText(s.blocks)));
        setCompany(data.company);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  const ids = useMemo(() => page?.sections.map((s) => s.id) ?? [], [page]);
  const publicHref = TABS.find((t) => t.id === tab)?.href;

  async function savePage() {
    if (!page) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await updateAdminLegalPage(page.slug, {
        eyebrow: page.eyebrow || '',
        title: page.title,
        titleAccent: page.titleAccent,
        intro: page.intro,
        effectiveDate: page.effectiveDate,
        lastUpdated: page.lastUpdated,
        sections: page.sections.map((section, i) => ({
          ...section,
          id: slugify(section.id || section.title, uniqueId(section.title, ids)),
          blocks: textToBlocks(bodies[i] ?? blocksToText(section.blocks)),
        })),
      });
      setPage(saved);
      setBodies(saved.sections.map((s) => blocksToText(s.blocks)));
      setNotice('Saved. Refresh the public page to see it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function restorePage() {
    if (!page) return;
    if (!window.confirm('Replace this page with the official copy? Unsaved edits will be lost.')) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const data = await restoreAdminLegalPage(page.slug);
      setPage(data.page);
      setBodies(data.page.sections.map((s) => blocksToText(s.blocks)));
      setCompany(data.company);
      setNotice('Restored official copy.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed');
    } finally {
      setSaving(false);
    }
  }

  async function saveCompany() {
    if (!company) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await updateAdminLegalCompany(company);
      setCompany(saved);
      setNotice('Company card updated on all legal pages.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Legal"
        accent="pages"
        subtitle="Edit the copy. Public pages format headings, lists and the company card for you."
        action={
          publicHref ? (
            <Link to={publicHref} target="_blank" rel="noreferrer" className={`${btnGhost} w-full sm:w-auto`}>
              <ExternalLink className="w-4 h-4" /> View live
            </Link>
          ) : undefined
        }
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              tab === t.id
                ? 'bg-white text-black border-white'
                : 'border-white/[0.1] text-neutral-300 hover:bg-white/[0.04]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}
      {notice ? (
        <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{notice}</div>
      ) : null}

      {loading ? (
        <DashboardSkeleton />
      ) : tab === 'company' && company ? (
        <Card title="Company card">
          <div className="p-4 sm:p-6 space-y-4">
            <p className="text-sm text-neutral-400">Shown wherever a section includes @company.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ['brand', 'Brand'],
                  ['entity', 'Legal entity'],
                  ['gstin', 'GSTIN'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['websiteLabel', 'Website label'],
                  ['websiteHref', 'Website URL'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className={key === 'websiteHref' ? 'sm:col-span-2' : ''}>
                  <label className={labelCls}>{label}</label>
                  <input
                    className={fieldCls}
                    value={company[key]}
                    onChange={(e) => setCompany({ ...company, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <textarea
                  className={`${fieldCls} min-h-[88px] resize-y`}
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                />
              </div>
            </div>
            <button type="button" className={btnPrimary} disabled={saving} onClick={() => void saveCompany()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save company
            </button>
          </div>
        </Card>
      ) : page ? (
        <div className="space-y-6">
          <Card
            title="Page"
            action={
              <button type="button" className={btnPrimary} disabled={saving} onClick={() => void savePage()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            }
          >
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Title</label>
                  <input className={fieldCls} value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Accent</label>
                  <input
                    className={fieldCls}
                    value={page.titleAccent}
                    onChange={(e) => setPage({ ...page, titleAccent: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Effective</label>
                  <input
                    className={fieldCls}
                    value={page.effectiveDate}
                    onChange={(e) => setPage({ ...page, effectiveDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Last updated</label>
                  <input
                    className={fieldCls}
                    value={page.lastUpdated}
                    onChange={(e) => setPage({ ...page, lastUpdated: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Intro</label>
                  <textarea
                    className={`${fieldCls} min-h-[88px] resize-y`}
                    value={page.intro}
                    onChange={(e) => setPage({ ...page, intro: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Sections"
            action={
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  const id = uniqueId('new-section', ids);
                  setPage({
                    ...page,
                    sections: [
                      ...page.sections,
                      { id, title: 'New section', blocks: [{ type: 'p', text: 'Add your copy here.' }] },
                    ],
                  });
                  setBodies((prev) => [...prev, 'Add your copy here.']);
                }}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            }
          >
            <div className="px-4 sm:px-6 pt-4 text-xs text-neutral-500">
              Blank line = new paragraph · <code className="text-neutral-300">- </code> bullet ·{' '}
              <code className="text-neutral-300">## </code> subheading · <code className="text-neutral-300">@company</code> company
              card
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {page.sections.map((section, i) => (
                <SectionEditor
                  key={`${section.id}-${i}`}
                  section={section}
                  body={bodies[i] ?? ''}
                  index={i}
                  total={page.sections.length}
                  onTitle={(title) =>
                    setPage({ ...page, sections: page.sections.map((s, j) => (j === i ? { ...s, title } : s)) })
                  }
                  onBody={(body) => setBodies((prev) => prev.map((b, j) => (j === i ? body : b)))}
                  onRemove={() => {
                    setPage({ ...page, sections: page.sections.filter((_, j) => j !== i) });
                    setBodies((prev) => prev.filter((_, j) => j !== i));
                  }}
                  onMove={(dir) => {
                    setPage({ ...page, sections: moveItem(page.sections, i, dir) });
                    setBodies((prev) => moveItem(prev, i, dir));
                  }}
                />
              ))}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button type="button" className={btnGhost} disabled={saving} onClick={() => void restorePage()}>
              <RotateCcw className="w-4 h-4" /> Restore official
            </button>
            <button type="button" className={`${btnPrimary} w-full sm:w-auto`} disabled={saving} onClick={() => void savePage()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>
      ) : (
        <Card>
          <div className="p-8 flex items-center gap-3 text-neutral-400 text-sm">
            <Scale className="w-4 h-4" />
            Nothing to edit.
          </div>
        </Card>
      )}
    </div>
  );
}
