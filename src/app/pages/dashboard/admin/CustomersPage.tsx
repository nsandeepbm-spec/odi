import React, { useEffect, useMemo, useState } from 'react';
import { Search, UserX, MoreHorizontal, Loader2 } from 'lucide-react';
import { PageHeader, Card, EmptyState } from '../../../components/dashboard/shared';
import { listUsers, type AppUser } from '../../../lib/api';
import { displayName, getInitials } from '../../../lib/auth';

const gradients = [
  'from-cyan-400 to-indigo-500',
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-500',
  'from-emerald-400 to-cyan-500',
  'from-amber-400 to-orange-500',
];

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function statusClass(status: AppUser['status']) {
  if (status === 'active') return 'bg-emerald-50 text-emerald-600';
  if (status === 'banned') return 'bg-red-50 text-red-600';
  return 'bg-neutral-100 text-neutral-400';
}

export default function CustomersPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await listUsers(1, 100);
        if (!cancelled) {
          setUsers(result.users);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load customers');
          setUsers([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = displayName(u).toLowerCase();
      return (
        name.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.phone ?? '').toLowerCase().includes(q)
      );
    });
  }, [query, users]);

  return (
    <div>
      <PageHeader
        title="Customer"
        accent="Directory."
        subtitle="Every customer registered on the platform."
      />

      <Card>
        <div className="px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 max-w-sm px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200/70">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">Loading customers…</span>
          </div>
        ) : error ? (
          <EmptyState icon={UserX} title="Couldn’t load customers" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={UserX} title="No customers found" subtitle="Try a different name or email." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[760px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Last Login</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((u, i) => {
                  const name = displayName(u);
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={name}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white text-[11px] font-black shrink-0`}
                            >
                              {getInitials(u.full_name, u.email)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold">{name}</div>
                            <div className="text-xs text-neutral-400 font-mono">{u.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-600">{u.email}</div>
                        <div className="text-xs text-neutral-400">{u.phone || '—'}</div>
                      </td>
                      <td className="px-6 py-4 text-neutral-500">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusClass(u.status)}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-500">{formatDate(u.last_login_at)}</td>
                      <td className="px-4 py-4">
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors" aria-label="Actions">
                          <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-neutral-100 text-xs text-neutral-400 font-semibold">
          {loading
            ? '…'
            : `${filtered.length} customer${filtered.length === 1 ? '' : 's'}${
                !query.trim() && total > users.length ? ` · ${total} total` : ''
              }`}
        </div>
      </Card>
    </div>
  );
}
