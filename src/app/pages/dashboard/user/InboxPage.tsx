import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Headphones, Loader2, Send, AlertCircle, ChevronDown } from 'lucide-react';
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
  const [openId, setOpenId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
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
      setComposeOpen(false);
      setFormMsg({ type: 'ok', text: 'Ticket submitted. We’ll get back to you soon.' });
      setOpenId(ticket.id);
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
      requestNotificationsRefresh();
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
      <div className="min-w-0 bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-6 sm:p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="font-bold text-sm text-white">Could not load inbox</p>
        <p className="text-xs text-neutral-400 max-w-sm break-words">{error}</p>
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
        eyebrow="Updates & help"
        title="Inbox"
        accent="& Support."
        subtitle="Order alerts and support tickets — open a ticket to read the full thread."
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
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              subtitle="Order updates and product launches will show up here."
            />
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
                            n.is_read
                              ? 'bg-neutral-700'
                              : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`text-sm tracking-tight ${
                                n.is_read ? 'font-semibold text-neutral-300' : 'font-bold text-white'
                              }`}
                            >
                              {n.title}
                            </p>
                            {n.is_cleared && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 border border-white/[0.06] px-1.5 py-0.5 rounded-md">
                                Cleared
                              </span>
                            )}
                          </div>
                          {n.body && (
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                              {n.body}
                            </p>
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
            <button
              type="button"
              onClick={() => {
                setComposeOpen((open) => !open);
                setFormMsg(null);
              }}
              className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/15 text-white bg-white/10 hover:bg-white/[0.14] transition-colors"
            >
              {composeOpen ? 'Cancel' : 'New ticket'}
            </button>
          }
        >
          {composeOpen && (
            <form
              onSubmit={onCreateTicket}
              className="mx-4 sm:mx-6 mt-5 mb-2 rounded-2xl border border-white/[0.06] bg-[#050505] p-3 sm:p-4 space-y-4"
            >
              <div>
                <label className="text-[10px] font-black tracking-[0.18em] uppercase text-neutral-500">
                  Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  minLength={3}
                  maxLength={160}
                  placeholder="e.g. Order delivery question"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0A0A0A] focus:border-cyan-500/40 outline-none text-sm text-white placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-[0.18em] uppercase text-neutral-500">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={4}
                  placeholder="Describe your question or issue…"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0A0A0A] focus:border-cyan-500/40 outline-none text-sm text-white placeholder:text-neutral-600 resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit ticket
              </button>
            </form>
          )}

          {formMsg && (
            <p
              className={`px-4 sm:px-6 pt-4 text-xs font-medium ${
                formMsg.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formMsg.text}
            </p>
          )}

          {tickets.length === 0 && !composeOpen ? (
            <EmptyState
              icon={Headphones}
              title="No tickets yet"
              subtitle="Tap New ticket if you need help with an order or product."
            />
          ) : tickets.length === 0 ? (
            <p className="px-4 sm:px-6 py-8 text-xs text-neutral-500">No tickets yet — send the form above to start one.</p>
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
                            <p className="text-[11px] text-neutral-500 mt-1">{formatDate(t.created_at)}</p>
                            <p
                              className={`text-xs text-neutral-400 mt-2 leading-relaxed ${
                                open ? 'break-words' : 'line-clamp-2'
                              }`}
                            >
                              {t.message}
                            </p>
                            {!open && t.admin_note && (
                              <p className="text-[11px] text-cyan-300/80 mt-2 line-clamp-2">
                                Reply: {t.admin_note}
                              </p>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-neutral-500 mt-1 transition-transform ${
                              open ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {open && (
                        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#050505] p-3 sm:p-4 space-y-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
                              Your message
                            </p>
                            <p className="mt-2 text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed break-words">
                              {t.message}
                            </p>
                          </div>
                          {t.admin_note ? (
                            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.06] px-3 sm:px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400/80">
                                ODI reply
                              </p>
                              <p className="mt-2 text-sm text-cyan-100/90 whitespace-pre-wrap leading-relaxed break-words">
                                {t.admin_note}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-500">No reply yet — we’ll notify you here when there is one.</p>
                          )}
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
