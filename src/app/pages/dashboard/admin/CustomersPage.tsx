import React, { useEffect, useMemo, useState } from 'react';
import { Search, UserX, Shield, ShieldOff, UserMinus, Ban, CheckCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, Card, EmptyState, TableSkeleton } from '../../../components/dashboard/shared';
import { listUsers, adminUpdateUser, adminDeleteUser, type AppUser } from '../../../lib/api';
import { displayName, getInitials } from '../../../lib/auth';
import { useAuth } from '../../../lib/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

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
  if (status === 'active') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (status === 'banned') return 'bg-red-500/10 text-red-400 border border-red-500/20';
  return 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditUserDialog({
  user,
  isSuperAdmin,
  currentUserId,
  onUpdate,
  onRemoved,
}: {
  user: AppUser;
  isSuperAdmin: boolean;
  currentUserId: string;
  onUpdate: (updated: AppUser) => void;
  onRemoved: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draftRole, setDraftRole] = useState<AppUser['role']>(user.role);
  const [draftStatus, setDraftStatus] = useState<AppUser['status']>(user.status);

  const isSelf = user.id === currentUserId;
  const canDelete = !isSelf && !user.is_super_admin && (user.role !== 'admin' || isSuperAdmin);

  useEffect(() => {
    setDraftRole(user.role);
    setDraftStatus(user.status);
  }, [user.role, user.status]);

  const apply = async () => {
    const patch: Parameters<typeof adminUpdateUser>[1] = {};
    if (draftStatus !== user.status) patch.status = draftStatus;
    if (isSuperAdmin && draftRole !== user.role) patch.role = draftRole;
    if (!('status' in patch) && !('role' in patch)) {
      setDialogOpen(false);
      return;
    }

    setBusy(true);
    try {
      const updated = await adminUpdateUser(user.id, patch);
      onUpdate(updated);
      setDialogOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const result = await adminDeleteUser(user.id);
      if (result.deleted) {
        onRemoved(user.id);
      } else if (result.user) {
        onUpdate(result.user);
      }
      setConfirmDelete(false);
      setDialogOpen(false);
      alert(result.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={busy || isSelf}
        title={isSelf ? 'Cannot modify your own account' : 'Edit customer'}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
      </button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setConfirmDelete(false);
        }}
      >
        <DialogContent className="max-w-xl border-white/10 bg-[#0A0A0A] p-0 text-white shadow-2xl">
          <DialogHeader className="border-b border-white/[0.06] bg-[#0d0d0d] px-6 py-5">
            <DialogTitle className="text-left text-xl font-black tracking-tight text-white">
              Edit Customer
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-neutral-400">
              Update access and account status for {displayName(user)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-5">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{displayName(user)}</p>
                  <p className="mt-1 text-sm text-neutral-400 break-all">{user.email}</p>
                  <p className="mt-1 text-xs font-mono text-neutral-500">{user.id}</p>
                </div>
                {user.is_super_admin && (
                  <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-400">
                    Super
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Status
                </label>
                <div className="grid gap-2">
                  {([
                    {
                      value: 'active',
                      label: 'Active',
                      hint: 'Customer can sign in and place orders.',
                      icon: CheckCircle,
                      activeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                    },
                    {
                      value: 'inactive',
                      label: 'Inactive',
                      hint: 'Customer account stays visible but limited.',
                      icon: UserMinus,
                      activeClass: 'border-neutral-400/30 bg-white/[0.05] text-white',
                    },
                    {
                      value: 'banned',
                      label: 'Banned',
                      hint: 'Blocks account access until restored.',
                      icon: Ban,
                      activeClass: 'border-red-500/30 bg-red-500/10 text-red-300',
                    },
                  ] as const).map((option) => {
                    const Icon = option.icon;
                    const selected = draftStatus === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDraftStatus(option.value)}
                        className={`rounded-xl border p-3 text-left transition-colors ${
                          selected
                            ? option.activeClass
                            : 'border-white/[0.08] bg-[#050505] text-neutral-300 hover:border-white/[0.14]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-sm font-bold">{option.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-400">{option.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Permission
                </label>
                {isSuperAdmin ? (
                  <div className="grid gap-2">
                    {([
                      {
                        value: 'user',
                        label: 'Customer',
                        hint: 'Standard customer account access.',
                        icon: ShieldOff,
                        activeClass: 'border-white/[0.16] bg-white/[0.05] text-white',
                      },
                      {
                        value: 'admin',
                        label: 'Admin',
                        hint: 'Can access dashboard and manage store data.',
                        icon: Shield,
                        activeClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
                      },
                    ] as const).map((option) => {
                      const Icon = option.icon;
                      const selected = draftRole === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDraftRole(option.value)}
                          className={`rounded-xl border p-3 text-left transition-colors ${
                            selected
                              ? option.activeClass
                              : 'border-white/[0.08] bg-[#050505] text-neutral-300 hover:border-white/[0.14]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="text-sm font-bold">{option.label}</span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-400">{option.hint}</p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/[0.06] bg-[#050505] p-4">
                    <p className="text-sm font-bold text-white capitalize">{user.role}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Only super admins can change customer permissions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-white/[0.06] bg-[#0d0d0d] px-6 py-4">
            {confirmDelete ? (
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-red-300">
                  Removes Firebase login so they cannot sign in again. If they have orders, the
                  profile is banned instead of deleted.
                </p>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={busy}
                    className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-bold text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove()}
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Confirm delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                {canDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={busy}
                    className="mr-auto inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDraftRole(user.role);
                    setDraftStatus(user.status);
                    setDialogOpen(false);
                  }}
                  className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-bold text-neutral-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void apply()}
                  disabled={busy || isSelf}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_18px_rgba(56,189,248,0.22)] transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = !!(currentUser as AppUser | null)?.is_super_admin;

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

  const handleUserUpdate = (updated: AppUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleUserRemoved = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setTotal((n) => Math.max(0, n - 1));
  };

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

      <Card className="relative z-10">
        <div className="px-6 py-5 border-b border-white/[0.04] bg-[#0d0d0d]">
          <div className="flex items-center gap-3 max-w-md px-4 py-2.5 rounded-xl bg-[#050505] border border-white/[0.06] shadow-inner focus-within:border-white/[0.2] transition-colors">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton cols={7} rows={7} />
        ) : error ? (
          <EmptyState icon={UserX} title="Couldn't load customers" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={UserX} title="No customers found" subtitle="Try a different name or email." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[860px]">
              <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Last Login</th>
                  <th className="px-4 py-4 text-center">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((u, i) => {
                  const name = displayName(u);
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={name}
                              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white text-[11px] font-black shrink-0 ring-1 ring-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                            >
                              {getInitials(u.full_name, u.email)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                              {name}
                              {u.is_super_admin && (
                                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Super</span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-500 font-mono mt-0.5">{u.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-300 font-medium">{u.email}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{u.phone || '—'}</div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 font-medium">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded border ${
                            u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/[0.03] text-neutral-400 border-white/[0.1]'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded border ${statusClass(u.status)}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-400 font-medium">{formatDate(u.last_login_at)}</td>
                      <td className="px-4 py-4 text-center">
                        <EditUserDialog
                          user={u}
                          isSuperAdmin={isSuperAdmin}
                          currentUserId={currentUser?.id ?? ''}
                          onUpdate={handleUserUpdate}
                          onRemoved={handleUserRemoved}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-5 border-t border-white/[0.04] bg-[#0d0d0d] text-xs text-neutral-500 font-bold tracking-wide">
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
