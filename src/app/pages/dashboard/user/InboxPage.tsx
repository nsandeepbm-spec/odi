import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Headphones, Loader2, Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  PageHeader,
  Card,
  EmptyState,
  DashboardSkeleton,
  ListPager,
} from '../../../components/dashboard/shared';
import {
  createSupportTicket,
  listMySupportTickets,
  listNotifications,
  markNotificationRead,
  type AppNotification,
  type SupportTicket,
  type SupportTicketStatus,
} from '../../../lib/api';
import { requestNotificationsRefresh } from '../../../components/dashboard/NotificationBell';

const NOTIF_PER_PAGE = 10;
const TICKET_PER_PAGE = 10;

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

function statusChip(status: SupportTicketStatus) {
  const map: Record<SupportTicketStatus, string> = {
    open: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    in_progress: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
    resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    closed: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/25',
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${map[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function InboxPage() {
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
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bootstrapped = React.useRef(false);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

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
        listMySupportTickets(ticketPage, TICKET_PER_PAGE),
      ]);
      setNotifications(notifRes.notifications);
      setNotifMeta(notifRes.meta);
      setTickets(ticketRes.tickets);
      setTicketMeta(ticketRes.meta);
      bootstrapped.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbox');
    } finally {
      setLoading(false);
      setPaging(false);
    }
  }, [notifPage, ticketPage]);

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

  const onCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    setSubmitting(true);
    try {
      const ticket = await createSupportTicket({
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubject('');
      setMessage('');
      setFormMsg({ type: 'ok', text: 'Ticket submitted. We’ll get back to you soon.' });
      if (ticketPage === 1) {
        setTickets((prev) => [ticket, ...prev].slice(0, TICKET_PER_PAGE));
        setTicketMeta((m) => ({
          ...m,
          total: m.total + 1,
          totalPages: Math.max(1, Math.ceil((m.total + 1) / m.perPage)),
        }));
      } else {
        setTicketPage(1);
      }
    } catch (err) {
      setFormMsg({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not create ticket.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardSkeleton cols={6} rows={8} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="font-bold text-sm text-white">Could not load inbox</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-2 px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white"
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
    >
      <PageHeader
        eyebrow="Updates & help"
        title="Inbox"
        accent="& Support."
        subtitle="Full notification history and support tickets for your account."
      />

      <div className="grid lg:grid-cols-5 gap-6 relative z-10">
        {/* Notification history */}
        <Card
          className="lg:col-span-3"
          title="Notification history"
          action={<Bell className="w-4 h-4 text-neutral-600" />}
        >
          <div className="px-5 py-3 border-b border-white/[0.04] text-[11px] text-neutral-500">
            Cleared bell items still appear here. New alerts show in the top bell until you clear them.
          </div>
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              subtitle="Order updates and product launches will show up here."
            />
          ) : (
            <>
              <ul className={`divide-y divide-white/[0.04] max-h-[560px] overflow-y-auto ${paging ? 'opacity-60' : ''}`}>
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => void onNotifClick(n)}
                      className={`w-full text-left px-5 py-4 hover:bg-white/[0.03] transition-colors ${
                        n.is_read ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            n.is_read ? 'bg-neutral-700' : 'bg-cyan-400'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-white">{n.title}</p>
                            {n.is_cleared && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 border border-white/[0.06] px-1.5 py-0.5 rounded">
                                Cleared from bell
                              </span>
                            )}
                          </div>
                          {n.body && (
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{n.body}</p>
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

        {/* Support */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="New support ticket" action={<Headphones className="w-4 h-4 text-neutral-600" />}>
            <form onSubmit={onCreateTicket} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500">
                  Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  minLength={3}
                  maxLength={160}
                  placeholder="e.g. Order delivery question"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] focus:border-cyan-500/50 outline-none text-sm text-white placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={5}
                  placeholder="Describe your question or issue…"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] focus:border-cyan-500/50 outline-none text-sm text-white placeholder:text-neutral-600 resize-y"
                />
              </div>
              {formMsg && (
                <p
                  className={`text-xs font-medium ${
                    formMsg.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit ticket
              </button>
            </form>
          </Card>

          <Card title="Your tickets">
            {tickets.length === 0 ? (
              <EmptyState
                icon={Headphones}
                title="No tickets yet"
                subtitle="Use the form above if you need help with an order or product."
              />
            ) : (
              <>
                <ul className={`divide-y divide-white/[0.04] max-h-[320px] overflow-y-auto ${paging ? 'opacity-60' : ''}`}>
                  {tickets.map((t) => (
                    <li key={t.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{t.subject}</p>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{t.message}</p>
                          {t.admin_note && (
                            <p className="text-xs text-cyan-300/90 mt-2 border-l-2 border-cyan-500/40 pl-2">
                              Reply: {t.admin_note}
                            </p>
                          )}
                          <p className="text-[10px] text-neutral-600 mt-2">{formatDate(t.created_at)}</p>
                        </div>
                        {statusChip(t.status)}
                      </div>
                    </li>
                  ))}
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
      </div>
    </motion.div>
  );
}
