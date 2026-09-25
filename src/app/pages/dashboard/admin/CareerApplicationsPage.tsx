import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, EmptyState, TableSkeleton, ListPager } from '../../../components/dashboard/shared';
import {
  listAdminCareerApplications,
  updateAdminCareerApplication,
  type CareerApplication,
  type InquiryStatus,
} from '../../../lib/api';

const PER_PAGE = 20;
const STATUSES: InquiryStatus[] = ['new', 'in_review', 'closed'];
const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusClass(status: InquiryStatus) {
  if (status === 'new') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  if (status === 'in_review') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
}

function StatusSelect({
  value,
  disabled,
  onChange,
  className = '',
}: {
  value: InquiryStatus;
  disabled: boolean;
  onChange: (status: InquiryStatus) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as InquiryStatus)}
      className={`px-3.5 py-2.5 rounded-xl bg-[#050505] border text-xs outline-none ${statusClass(value)} ${className}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace('_', ' ')}
        </option>
      ))}
    </select>
  );
}

export default function AdminCareerApplicationsPage() {
  const [items, setItems] = useState<CareerApplication[]>([]);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: PER_PAGE, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminCareerApplications(page, PER_PAGE, statusFilter || undefined);
      setItems(result.applications);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const onStatusChange = async (id: string, status: InquiryStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateAdminCareerApplication(id, { status });
      setItems((prev) => prev.map((row) => (row.id === id ? updated : row)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0"
    >
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/25 bg-violet-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">
              <Briefcase className="w-3 h-3" />
              Inbox & leads
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
              Careers form
            </span>
          </div>
          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
          >
            Career{' '}
            <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Applications.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
            Job applications from the public careers form.
          </p>
        </div>
      </header>

      <Card className={`relative z-10 min-w-0 ${panel}`}>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-500/40 flex gap-2 overflow-x-auto">
          {[{ id: '', label: 'All' }, ...STATUSES.map((s) => ({ id: s, label: s.replace('_', ' ') }))].map((f) => (
            <button
              key={f.id || 'all'}
              type="button"
              onClick={() => {
                setStatusFilter(f.id);
                setPage(1);
                setOpenId(null);
              }}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                statusFilter === f.id
                  ? 'bg-white/10 text-white border-neutral-400/50'
                  : 'text-neutral-500 border-neutral-500/40 hover:text-white hover:border-neutral-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <TableSkeleton cols={5} rows={6} />
        ) : error ? (
          <EmptyState icon={AlertCircle} title="Couldn't load applications" subtitle={error} />
        ) : items.length === 0 ? (
          <EmptyState icon={Briefcase} title="No applications yet" subtitle="New career form submissions will appear here." />
        ) : (
          <>
            <div className="md:hidden divide-y divide-white/[0.04]">
              {items.map((row) => {
                const open = openId === row.id;
                return (
                  <div key={row.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white break-words">{row.full_name}</p>
                        <p className="text-xs text-neutral-500 mt-1 break-all">{row.email}</p>
                        {row.phone ? (
                          <p className="text-[11px] text-neutral-600 mt-1">{row.phone}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenId((id) => (id === row.id ? null : row.id))}
                        className="shrink-0 text-xs font-bold text-cyan-400 hover:text-cyan-300 py-1"
                      >
                        {open ? 'Hide' : 'View'}
                      </button>
                    </div>
                    <p className="text-sm text-neutral-300 mt-2 break-words">{row.role}</p>
                    <a
                      href={row.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      Open portfolio <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-neutral-500 mt-1">{formatDate(row.created_at)}</p>
                    <StatusSelect
                      value={row.status}
                      disabled={updatingId === row.id}
                      onChange={(status) => void onStatusChange(row.id, status)}
                      className="mt-3 w-full"
                    />
                    {open ? (
                      <div className="mt-3 rounded-2xl border border-white/[0.06] bg-[#050505] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                          Cover note
                        </p>
                        <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed break-words">
                          {row.cover_note}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Applicant</th>
                    <th className="px-4 lg:px-6 py-4">Role</th>
                    <th className="px-4 lg:px-6 py-4">Portfolio</th>
                    <th className="px-4 lg:px-6 py-4">Received</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {items.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 lg:px-6 py-4">
                          <p className="font-bold text-white">{row.full_name}</p>
                          <p className="text-xs text-neutral-500 mt-1 break-all">{row.email}</p>
                          {row.phone && <p className="text-[11px] text-neutral-600 mt-1">{row.phone}</p>}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-neutral-300">{row.role}</td>
                        <td className="px-4 lg:px-6 py-4">
                          <a
                            href={row.portfolio_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-neutral-400 text-xs whitespace-nowrap">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <StatusSelect
                            value={row.status}
                            disabled={updatingId === row.id}
                            onChange={(status) => void onStatusChange(row.id, status)}
                          />
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setOpenId((id) => (id === row.id ? null : row.id))}
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                          >
                            {openId === row.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {openId === row.id && (
                        <tr>
                          <td colSpan={6} className="px-4 lg:px-6 py-4 bg-white/[0.02]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                              Cover note
                            </p>
                            <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
                              {row.cover_note}
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <ListPager
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
}
