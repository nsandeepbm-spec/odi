import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Bell } from 'lucide-react';
import {
  clearBellNotifications,
  markNotificationRead,
  previewNotifications,
  type AppNotification,
} from '../../lib/api';

export const NOTIFICATIONS_REFRESH_EVENT = 'odi:notifications-refresh';

export function requestNotificationsRefresh() {
  window.dispatchEvent(new Event(NOTIFICATIONS_REFRESH_EVENT));
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

/** Bell: latest 4 uncleared. Clear hides from bell; history keeps them. */
export default function NotificationBell({ inboxPath = '/dashboard/inbox' }: { inboxPath?: string }) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [clearing, setClearing] = useState(false);

  const loadPreview = useCallback(async () => {
    try {
      const data = await previewNotifications(4);
      setItems(data.notifications);
      setUnread(data.unreadCount);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadPreview();
    const id = window.setInterval(() => void loadPreview(), 15000);
    const onFocus = () => void loadPreview();
    const onRefresh = () => void loadPreview();
    window.addEventListener('focus', onFocus);
    window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, onRefresh);
    };
  }, [loadPreview]);

  useEffect(() => {
    if (!open) return;
    void loadPreview();
  }, [open, loadPreview]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onItemClick = async (n: AppNotification) => {
    if (!n.is_read) {
      try {
        await markNotificationRead(n.id);
        setItems((prev) =>
          prev.map((x) =>
            x.id === n.id ? { ...x, is_read: true, read_at: new Date().toISOString() } : x
          )
        );
        setUnread((c) => Math.max(0, c - 1));
      } catch {
        /* still navigate */
      }
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const onClear = async () => {
    setClearing(true);
    try {
      await clearBellNotifications();
      setItems([]);
      setUnread(0);
    } catch {
      /* ignore */
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl hover:bg-white/[0.06] text-neutral-500 hover:text-neutral-200 transition-all border border-transparent hover:border-white/[0.06]"
        aria-label={unread > 0 ? `${unread} unread notifications` : 'Notifications'}
        aria-expanded={open}
      >
        <Bell className="w-4.5 h-4.5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-[9px] font-black text-white flex items-center justify-center ring-[1.5px] ring-[#050505]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-[76px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[360px] w-auto max-w-full rounded-2xl border border-white/[0.08] bg-[#0c0c0e] shadow-2xl shadow-black/60 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-white">Notifications</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {unread > 0 ? `${unread} unread` : 'Latest updates'}
              </p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                disabled={clearing}
                onClick={() => void onClear()}
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white disabled:opacity-50 shrink-0"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-[calc(100vh-220px)] sm:max-h-[320px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-neutral-500">
                No new notifications. See full history on Inbox.
              </p>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => void onItemClick(n)}
                      className={`w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors ${
                        n.is_read ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                            n.is_read ? 'bg-transparent' : 'bg-cyan-400'
                          }`}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white leading-snug">{n.title}</p>
                          {n.body && (
                            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{n.body}</p>
                          )}
                          <p className="text-[10px] text-neutral-600 mt-1">{formatRelative(n.created_at)}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
            <Link
              to={inboxPath}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              View all & support →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
