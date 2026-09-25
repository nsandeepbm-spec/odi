import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Headphones,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Send,
  Inbox,
  Package,
  CreditCard,
  Tag,
  CheckCheck,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  Card,
  EmptyState,
  DashboardSkeleton,
  ListPager,
} from '../../../components/dashboard/shared';
import {
  getUnreadNotificationCount,
  listAdminSupportTickets,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateAdminSupportTicket,
  type AppNotification,
  type SupportTicket,
  type SupportTicketStatus,
} from '../../../lib/api';
import { requestNotificationsRefresh } from '../../../components/dashboard/NotificationBell';

const NOTIF_PER_PAGE = 5;
const TICKET_PER_PAGE = 8;
const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

type PageMeta = { total: number; page: number; perPage: number; totalPages: number };
type NotifFilter = 'all' | 'unread';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function notificationVisual(type: string): {
  icon: LucideIcon;
  label: string;
  iconCls: string;
  accent: string;
} {
  const t = type.toLowerCase();
  if (t.includes('support')) {
    return {
      icon: Headphones,
      label: 'Support',
      iconCls: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      accent: 'bg-amber-400',
    };
  }
  if (t.includes('paid') || t.includes('refund') || t.includes('payment')) {
    return {
      icon: CreditCard,
      label: 'Payment',
      iconCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
      accent: 'bg-emerald-400',
    };
  }
  if (t.includes('product') || t.includes('catalog')) {
    return {
      icon: Tag,
      label: 'Catalog',
      iconCls: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
      accent: 'bg-violet-400',
    };
  }
  if (t.includes('order')) {
    return {
      icon: Package,
      label: 'Order',
      iconCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
      accent: 'bg-cyan-400',
    };
  }
  return {
    icon: Bell,
    label: 'Alert',
    iconCls: 'bg-white/[0.06] text-neutral-300 border-white/[0.1]',
    accent: 'bg-neutral-400',
  };
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
  const [notifFilter, setNotifFilter] = useState<NotifFilter>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
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
      const [notifRes, ticketRes, unread] = await Promise.all([
        listNotifications({
          includeCleared: true,
          unreadOnly: notifFilter === 'unread',
          page: notifPage,
          perPage: NOTIF_PER_PAGE,
        }),
        listAdminSupportTickets(ticketPage, TICKET_PER_PAGE, statusFilter || undefined),
        getUnreadNotificationCount().catch(() => 0),
      ]);
      setNotifications(notifRes.notifications);
      setNotifMeta(notifRes.meta);
      setUnreadCount(unread);
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
  }, [notifPage, ticketPage, statusFilter, notifFilter]);

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
        setUnreadCount((c) => Math.max(0, c - 1));
        requestNotificationsRefresh();
      } catch {
        /* continue */
      }
    }
    if (n.link) navigate(n.link);
  };

  const onMarkAllRead = async () => {
    if (unreadCount === 0 || markingAll) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setUnreadCount(0);
      requestNotificationsRefresh();
      if (notifFilter === 'unread') {
        setNotifications([]);
        setNotifMeta({ total: 0, page: 1, perPage: NOTIF_PER_PAGE, totalPages: 1 });
        setNotifPage(1);
      } else {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            is_read: true,
            read_at: n.read_at ?? new Date().toISOString(),
          }))
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not mark all as read');
    } finally {
      setMarkingAll(false);
    }
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
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
              <Inbox className="w-3 h-3" />
              Inbox & leads
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
              Ops
            </span>
          </div>
          <h1
            className="font-black tracking-tight text-white leading-none"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
          >
            Inbox{' '}
            <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              & Support.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
            Order alerts and customer tickets — open a ticket to reply.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
        <Card
          className={`lg:col-span-5 min-w-0 ${panel}`}
          title="Notification history"
          action={
            <div className="flex items-center gap-2">
              {unreadCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {notifMeta.total} total
                </span>
              )}
            </div>
          }
        >
          <div className="px-4 sm:px-6 py-3.5 border-b border-neutral-500/40 bg-[#0d0d0d] flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#050505] border border-white/[0.06]">
              {(
                [
                  { id: 'all' as const, label: 'All' },
                  { id: 'unread' as const, label: 'Unread' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setNotifFilter(f.id);
                    setNotifPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    notifFilter === f.id
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {f.label}
                  {f.id === 'unread' && unreadCount > 0 ? (
                    <span className="ml-1.5 tabular-nums text-cyan-400">{unreadCount}</span>
                  ) : null}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void onMarkAllRead()}
              disabled={unreadCount === 0 || markingAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-white/[0.06] hover:text-white hover:border-white/15 hover:bg-white/[0.04] transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400"
            >
              {markingAll ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3" />}
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title={notifFilter === 'unread' ? 'All caught up' : 'No notifications'}
              subtitle={
                notifFilter === 'unread'
                  ? 'No unread alerts right now.'
                  : 'Order and catalog alerts appear here.'
              }
            />
          ) : (
            <div className="flex flex-col max-h-[min(420px,55vh)]">
              <ul
                className={`min-h-0 flex-1 overflow-y-auto overscroll-contain divide-y divide-white/[0.04] ${
                  paging ? 'opacity-55 pointer-events-none' : ''
                }`}
              >
                {notifications.map((n) => {
                  const visual = notificationVisual(n.type);
                  const Icon = visual.icon;
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => void onNotifClick(n)}
                        className={`group relative w-full text-left px-4 sm:px-5 py-3 transition-colors ${
                          n.is_read
                            ? 'hover:bg-white/[0.025]'
                            : 'bg-cyan-500/[0.04] hover:bg-cyan-500/[0.07]'
                        }`}
                      >
                        {!n.is_read && (
                          <span
                            className={`absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full ${visual.accent}`}
                            aria-hidden
                          />
                        )}
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${visual.iconCls}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p
                                    className={`text-[13px] tracking-tight leading-snug line-clamp-1 ${
                                      n.is_read ? 'font-semibold text-neutral-300' : 'font-bold text-white'
                                    }`}
                                  >
                                    {n.title}
                                  </p>
                                  {!n.is_read && (
                                    <span className="shrink-0 rounded-md bg-cyan-500/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-300">
                                      New
                                    </span>
                                  )}
                                </div>
                                <span className="mt-1 inline-flex text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                                  {visual.label}
                                </span>
                              </div>
                              <div className="shrink-0 text-right">
                                <p
                                  className="text-[10px] font-semibold tabular-nums text-neutral-500"
                                  title={formatDate(n.created_at)}
                                >
                                  {formatRelative(n.created_at)}
                                </p>
                                {n.link ? (
                                  <ChevronRight className="ml-auto mt-1 h-3.5 w-3.5 text-neutral-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-cyan-400" />
                                ) : null}
                              </div>
                            </div>
                            {n.body ? (
                              <p className="mt-1 text-xs leading-relaxed text-neutral-400 line-clamp-1">
                                {n.body}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-neutral-500/40 bg-[#0d0d0d] flex items-center justify-between gap-3">
                <p className="text-[10px] text-neutral-500 tabular-nums">
                  Page {notifMeta.page} of {Math.max(1, notifMeta.totalPages)}
                  {notifMeta.total > 0 ? ` · ${notifMeta.total} total` : ''}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={paging || notifMeta.page <= 1}
                    onClick={() => setNotifPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-neutral-500/50 text-neutral-300 hover:bg-white/[0.04] hover:border-neutral-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={paging || notifMeta.page >= notifMeta.totalPages}
                    onClick={() => setNotifPage((p) => p + 1)}
                    className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-neutral-500/50 text-neutral-300 hover:bg-white/[0.04] hover:border-neutral-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card
          className={`lg:col-span-7 min-w-0 ${panel}`}
          title="Support tickets"
          action={
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {ticketMeta.total} total
            </span>
          }
        >
          <div className="px-4 sm:px-6 py-4 border-b border-neutral-500/40 flex gap-2 overflow-x-auto">
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
