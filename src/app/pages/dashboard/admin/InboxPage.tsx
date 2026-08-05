import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Headphones, AlertCircle } from 'lucide-react';
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

const NOTIF_PER_PAGE = 20;
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

const STATUSES: SupportTicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

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
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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
        listAdminSupportTickets(ticketPage, TICKET_PER_PAGE),
      ]);
      setNotifications(notifRes.notifications);
      setNotifMeta(notifRes.meta);
      setTickets(ticketRes.tickets);
      setTicketMeta(ticketRes.meta);
      bootstrapped.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
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
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="font-bold text-sm text-white">Could not load inbox</p>
        <p className="text-xs text-neutral-400">{error}</p>
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
        eyebrow="Ops"
        title="Inbox"
        accent="& Support."
        subtitle="Your admin notifications and customer support tickets."
      />

      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <Card title="Notification history" action={<Bell className="w-4 h-4 text-neutral-600" />}>
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" subtitle="Order and catalog alerts appear here." />
          ) : (
            <>
              <ul className={`divide-y divide-white/[0.04] max-h-[640px] overflow-y-auto ${paging ? 'opacity-60' : ''}`}>
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => void onNotifClick(n)}
                      className={`w-full text-left px-5 py-4 hover:bg-white/[0.03] ${n.is_read ? 'opacity-75' : ''}`}
                    >
                      <p className="text-sm font-bold text-white">{n.title}</p>
                      {n.body && <p className="text-xs text-neutral-400 mt-1">{n.body}</p>}
                      <p className="text-[10px] text-neutral-600 mt-2">{formatDate(n.created_at)}</p>
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

        <Card title="Support tickets" action={<Headphones className="w-4 h-4 text-neutral-600" />}>
          {tickets.length === 0 ? (
            <EmptyState icon={Headphones} title="No tickets" subtitle="Customer tickets will show here." />
          ) : (
            <>
              <ul className={`divide-y divide-white/[0.04] max-h-[640px] overflow-y-auto ${paging ? 'opacity-60' : ''}`}>
                {tickets.map((t) => (
                  <li key={t.id} className="px-5 py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{t.subject}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {t.user_name || t.user_email || t.user_id.slice(0, 8)} · {formatDate(t.created_at)}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2 whitespace-pre-wrap">{t.message}</p>
                      </div>
                    </div>
                    <select
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) => void onStatusChange(t.id, e.target.value as SupportTicketStatus)}
                      className="px-3 py-1.5 rounded-lg bg-[#050505] border border-white/[0.08] text-xs text-white outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
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
    </motion.div>
  );
}
