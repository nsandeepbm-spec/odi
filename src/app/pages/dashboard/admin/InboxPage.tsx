import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Headphones, AlertCircle, Loader2, ChevronDown, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  PageHeader,
  Card,
  EmptyState,
  DashboardSkeleton,
  ListPager,
} from '../../../components/dashboard/shared';
import {
  listAdminSupportTickets,
  listNotifications,
  markNotificationRead,
  updateAdminSupportTicket,
  type AppNotification,
  type SupportTicket,
  type SupportTicketStatus,
} from '../../../lib/api';
import { requestNotificationsRefresh } from '../../../components/dashboard/NotificationBell';

const NOTIF_PER_PAGE = 12;
const TICKET_PER_PAGE = 8;

type PageMeta = { total: number; page: number; perPage: number; totalPages: number };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUSES: SupportTicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

function statusChip(status: SupportTicketStatus) {
  const map: Record<SupportTicketStatus, string> = {
    open: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    in_progress: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    resolved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    closed: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };
  return (
    <span
      className={`shrink-0 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${map[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminInboxPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifMeta, setNotifMeta] = useState<PageMeta>({
    total: 0,
    page: 1,
    perPage: NOTIF_PER_PAGE,
    totalPages: 1,
  });
  const [ticketMeta, setTicketMeta] = useState<PageMeta>({
    total: 0,
    page: 1,
    perPage: TICKET_PER_PAGE,
    totalPages: 1,
  });
  const [notifPage, setNotifPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [saveMsg, setSaveMsg] = useState<Record<string, string>>({});
  const bootstrapped = React.useRef(false);

  const load = useCallback(async () => {
    if (!bootstrapped.current) setLoading(true);
    else setPaging(true);
    setError(null);
    try {
      const [notifRes, ticketRes] = await Promise.all([
        listNotifications({
          includeCleared: true,
          page: notifPage,
          perPage: NOTIF_PER_PAGE,
        }),
        listAdminSupportTickets(ticketPage, TICKET_PER_PAGE, statusFilter || undefined),
      ]);
      setNotifications(notifRes.notifications);
      setNotifMeta(notifRes.meta);
      setTickets(ticketRes.tickets);
      setTicketMeta(ticketRes.meta);
      setReplyDraft((prev) => {
        const next = { ...prev };
        for (const t of ticketRes.tickets) {
          if (next[t.id] === undefined) next[t.id] = t.admin_note ?? '';
        }
        return next;
      });
      bootstrapped.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
      setPaging(false);
    }
  }, [notifPage, ticketPage, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const onNotifClick = async (n: AppNotification) => {
    if (!n.is_read) {
      try {
        await markNotificationRead(n.id);
        setNotifications((prev) =>
          prev.map((x) =>
            x.id === n.id ? { ...x, is_read: true, read_at: new Date().toISOString() } : x
          )
        );
        requestNotificationsRefresh();
      } catch {
        /* continue */
      }
    }
    if (n.link) navigate(n.link);
  };

  const onSaveReply = async (id: string) => {
    const note = (replyDraft[id] ?? '').trim();
    setUpdatingId(id);
    setSaveMsg((prev) => ({ ...prev, [id]: '' }));
    try {
      const updated = await updateAdminSupportTicket(id, { admin_note: note || null });
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setReplyDraft((prev) => ({ ...prev, [id]: updated.admin_note ?? '' }));
      setSaveMsg((prev) => ({ ...prev, [id]: 'Reply sent to the customer.' }));
      requestNotificationsRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reply failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const onStatusChange = async (id: string, status: SupportTicketStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateAdminSupportTicket(id, { status });
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <DashboardSkeleton cols={6} rows={8} />;

  if (error) {
    return (
      <div className="min-w-0 bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-6 sm:p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="font-bold text-sm text-white">Could not load inbox</p>
        <p className="text-xs text-neutral-400 break-words">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-2 w-full sm:w-auto px-4 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-w-0"
    >
      <PageHeader
        eyebrow="Ops"
        title="Inbox"
        accent="& Support."
        subtitle="Order alerts and customer tickets — open a ticket to reply."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
        <Card
          className="lg:col-span-5 min-w-0"
          title="Notification history"
          action={
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {notifMeta.total} total
            </span>
          }
        >
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" subtitle="Order and catalog alerts appear here." />
          ) : (
            <>
              <ul className={`divide-y divide-white/[0.04] ${paging ? 'opacity-60' : ''}`}>
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => void onNotifClick(n)}
                      className="w-full text-left px-4 sm:px-6 py-4 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                            n.is_read ? 'bg-neutral-700' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm tracking-tight ${n.is_read ? 'font-semibold text-neutral-300' : 'font-bold text-white'}`}>
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">{n.body}</p>
                          )}
                          <p className="text-[10px] text-neutral-600 mt-2">{formatDate(n.created_at)}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <ListPager
                page={notifMeta.page}
                totalPages={notifMeta.totalPages}
                total={notifMeta.total}
                disabled={paging}
                onPageChange={setNotifPage}
              />
            </>
          )}
        </Card>

        <Card
          className="lg:col-span-7 min-w-0"
          title="Support tickets"
          action={
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {ticketMeta.total} total
            </span>
          }
        >
          <div className="px-4 sm:px-6 py-4 border-b border-white/[0.04] flex gap-2 overflow-x-auto">
            {[{ id: '', label: 'All' }, ...STATUSES.map((s) => ({ id: s, label: s.replace('_', ' ') }))].map((f) => (
              <button
                key={f.id || 'all'}
                type="button"
                onClick={() => {
                  setStatusFilter(f.id);
                  setTicketPage(1);
                  setOpenId(null);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                  statusFilter === f.id
                    ? 'bg-white/10 text-white border-white/15'
                    : 'text-neutral-500 border-white/[0.06] hover:text-white hover:border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {tickets.length === 0 ? (
            <EmptyState icon={Headphones} title="No tickets" subtitle="Customer tickets will show here." />
          ) : (
            <>
              <ul className={`divide-y divide-white/[0.04] ${paging ? 'opacity-60' : ''}`}>
                {tickets.map((t) => {
                  const open = openId === t.id;
                  return (
                    <li key={t.id} className="px-4 sm:px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : t.id)}
                        className="w-full text-left min-w-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-white break-words">{t.subject}</p>
                              {statusChip(t.status)}
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-1 break-words">
                              {t.user_name || t.user_email || 'Customer'} · {formatDate(t.created_at)}
                            </p>
                            <p className={`text-xs text-neutral-400 mt-2 leading-relaxed ${open ? 'break-words' : 'line-clamp-2'}`}>
                              {t.message}
                            </p>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-neutral-500 mt-1 transition-transform ${
                              open ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {open && (
                        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#050505] p-3 sm:p-4 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
                              Status
                            </label>
                            <select
                              value={t.status}
                              disabled={updatingId === t.id}
                              onChange={(e) => void onStatusChange(t.id, e.target.value as SupportTicketStatus)}
                              className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/[0.08] text-xs font-bold text-white outline-none focus:border-cyan-500/40"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s.replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
                              Reply to customer
                            </label>
                            <textarea
                              value={replyDraft[t.id] ?? t.admin_note ?? ''}
                              onChange={(e) => setReplyDraft((prev) => ({ ...prev, [t.id]: e.target.value }))}
                              disabled={updatingId === t.id}
                              rows={4}
                              maxLength={2000}
                              placeholder="Write a reply the customer will see in their inbox…"
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0A0A0A] text-sm text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500/40 resize-y"
                            />
                          </div>

                          {saveMsg[t.id] && (
                            <p className="text-xs font-medium text-emerald-400">{saveMsg[t.id]}</p>
                          )}

                          <button
                            type="button"
                            onClick={() => void onSaveReply(t.id)}
                            disabled={updatingId === t.id}
                            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-400 to-indigo-500 disabled:opacity-50"
                          >
                            {updatingId === t.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            Save reply
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <ListPager
                page={ticketMeta.page}
                totalPages={ticketMeta.totalPages}
                total={ticketMeta.total}
                disabled={paging}
                onPageChange={setTicketPage}
              />
            </>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
