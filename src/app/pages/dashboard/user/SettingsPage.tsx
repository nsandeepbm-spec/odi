import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Shield, Bell, User } from 'lucide-react';
import { PageHeader, Card } from '../../../components/dashboard/shared';
import { displayName, getInitials, useAuth } from '../../../lib/auth';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 outline-none transition-all text-sm text-white placeholder:text-neutral-600';
const labelCls = 'text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500';

export default function SettingsPage() {
  const { user, firebaseUser, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name ?? '');
    setPhone(user.phone ?? '');
  }, [user]);

  if (!user) return null;

  const name = displayName(user);
  const initials = getInitials(user.full_name, user.email);
  const avatarUrl = user.avatar_url || firebaseUser?.photoURL || null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setMessage({ type: 'ok', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not save profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-w-0"
    >
      <PageHeader
        eyebrow="Preferences"
        title="Account"
        accent="Settings."
        subtitle="Manage your profile, security and notification preferences."
      />

      <div className="space-y-6 max-w-3xl relative z-10 min-w-0">
        {/* Profile */}
        <Card title="Profile" action={<User className="w-4 h-4 text-neutral-600" />}>
          <form onSubmit={handleSave} className="p-4 sm:p-6">
            {/* Avatar + meta */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] min-w-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white text-base font-black shrink-0 ring-2 ring-white/10 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-black tracking-tight text-white text-base break-words">{name}</p>
                <p className="text-sm text-neutral-500 break-all">{user.email}</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-600 mt-1">
                  {user.role} · {user.provider}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className={`${inputCls} opacity-40 cursor-not-allowed`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Member Since</label>
                <input
                  type="text"
                  value={new Date(user.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  disabled
                  className={`${inputCls} opacity-40 cursor-not-allowed`}
                />
              </div>
            </div>

            {message && (
              <p
                className={`mt-5 text-xs font-semibold px-4 py-3 rounded-xl border ${
                  message.type === 'ok'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] sm:hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </Card>

        {/* Security */}
        <Card title="Security" action={<Shield className="w-4 h-4 text-neutral-600" />}>
          <div className="p-4 sm:p-6">
            <div className="space-y-5 max-w-md">
              <div className="space-y-2">
                <label className={labelCls}>Current Password</label>
                <input type="password" placeholder="••••••••" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>New Password</label>
                <input type="password" placeholder="••••••••" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Confirm New Password</label>
                <input type="password" placeholder="••••••••" className={inputCls} />
              </div>
            </div>
            <button
              type="button"
              className="mt-6 w-full sm:w-auto px-6 py-2.5 rounded-xl border border-white/[0.08] text-sm font-bold tracking-wide text-neutral-300 hover:bg-white/[0.04] hover:text-white transition-colors"
            >
              Update Password
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications" action={<Bell className="w-4 h-4 text-neutral-600" />}>
          <div className="p-4 sm:p-6 divide-y divide-white/[0.04]">
            {[
              { label: 'Order updates',     desc: 'Status changes for your orders and deliveries.',      on: true },
              { label: 'New releases',      desc: 'Be first to know when a new Explorer volume drops.',  on: true },
              { label: 'Offers & promos',   desc: 'Occasional discounts and bundle offers.',             on: false },
            ].map((n) => (
              <label
                key={n.label}
                className="flex items-start sm:items-center justify-between gap-3 sm:gap-6 py-4 first:pt-0 last:pb-0 cursor-pointer group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white group-hover:text-neutral-100 transition-colors">{n.label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={n.on}
                  className="w-4 h-4 shrink-0 accent-cyan-400"
                />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
