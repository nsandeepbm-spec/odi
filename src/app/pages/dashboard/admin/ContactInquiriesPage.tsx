import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, AlertCircle } from 'lucide-react';
import { PageHeader, Card, EmptyState, TableSkeleton, ListPager } from '../../../components/dashboard/shared';
import {
  listAdminContactInquiries,
  updateAdminContactInquiry,
  type ContactInquiry,
  type InquiryStatus,
} from '../../../lib/api';

const PER_PAGE = 20;
const STATUSES: InquiryStatus[] = ['new', 'in_review', 'closed'];

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

export default function AdminContactInquiriesPage() {
  const [items, setItems] = useState<ContactInquiry[]>([]);
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
      const result = await listAdminContactInquiries(page, PER_PAGE, statusFilter || undefined);
      setItems(result.inquiries);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
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
      const updated = await updateAdminContactInquiry(id, { status });
      setItems((prev) => prev.map((row) => (row.id === id ? updated : row)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <PageHeader
        eyebrow="Leads"
        title="Contact"
        accent="Inquiries."
        subtitle="Service and project requests from the public contact form."
      />

      <Card className="relative z-10">
        <div className="px-8 py-5 border-b border-white/[0.04] flex flex-wrap gap-2.5">
          {[{ id: '', label: 'All' }, ...STATUSES.map((s) => ({ id: s, label: s.replace('_', ' ') }))].map((f) => (
            <button
              key={f.id || 'all'}
              type="button"
              onClick={() => {
                setStatusFilter(f.id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                statusFilter === f.id
                  ? 'bg-white/10 text-white border-white/15'
                  : 'text-neutral-500 border-white/[0.06] hover:text-white hover:border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <TableSkeleton cols={5} rows={6} />
        ) : error ? (
          <EmptyState icon={AlertCircle} title="Couldn't load inquiries" subtitle={error} />
        ) : items.length === 0 ? (
          <EmptyState icon={Mail} title="No inquiries yet" subtitle="New contact form submissions will appear here." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[860px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-8 py-5">From</th>
                    <th className="px-8 py-5">Service</th>
                    <th className="px-8 py-5">Received</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {items.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-bold text-white">{row.name}</p>
                          <p className="text-xs text-neutral-500 mt-1">{row.email}</p>
                          {row.company && <p className="text-[11px] text-neutral-600 mt-1">{row.company}</p>}
                        </td>
                        <td className="px-8 py-5 text-neutral-300">{row.service}</td>
                        <td className="px-8 py-5 text-neutral-400 text-xs whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-8 py-5">
                          <select
                            value={row.status}
                            disabled={updatingId === row.id}
                            onChange={(e) => void onStatusChange(row.id, e.target.value as InquiryStatus)}
                            className={`px-3.5 py-2 rounded-xl bg-[#050505] border text-xs outline-none ${statusClass(row.status)}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-8 py-5">
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
                          <td colSpan={5} className="px-8 py-5 bg-white/[0.02]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Project details</p>
                            <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">{row.message}</p>
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
