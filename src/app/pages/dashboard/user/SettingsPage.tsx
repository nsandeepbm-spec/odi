import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHeader, Card } from '../../../components/dashboard/shared';
import { displayName, getInitials, useAuth } from '../../../lib/auth';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm';
const labelCls = 'text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
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
    <div>
      <PageHeader
        title="Account"
        accent="Settings."
        subtitle="Manage your profile, security and preferences."
      />

      <div className="space-y-6 max-w-3xl">
        <Card title="Profile">
          <form onSubmit={handleSave} className="p-6">
            <div className="flex items-center gap-4 mb-6">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-black">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-black tracking-tight text-lg">{name}</p>
                <p className="text-sm text-neutral-400">{user.email}</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mt-1">
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
                  className={inputCls}
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className={`${inputCls} bg-neutral-50 text-neutral-400 cursor-not-allowed`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 …"
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
                  className={`${inputCls} bg-neutral-50 text-neutral-400 cursor-not-allowed`}
                />
              </div>
            </div>

            {message && (
              <p
                className={`mt-4 text-xs font-semibold px-4 py-3 border ${
                  message.type === 'ok'
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    : 'text-red-500 bg-red-50 border-red-100'
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </Card>

        <Card title="Security">
          <div className="p-6">
            <div className="space-y-4 max-w-md">
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
              className="mt-5 px-6 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold tracking-wide hover:bg-neutral-50 transition-colors"
            >
              Update Password
            </button>
          </div>
        </Card>

        <Card title="Notifications">
          <div className="p-6 divide-y divide-neutral-100">
            {[
              { label: 'Booking updates', desc: 'Status changes for your bookings and deliveries.', on: true },
              { label: 'New releases', desc: 'Be first to know when a new Explorer volume launches.', on: true },
              { label: 'Offers & promotions', desc: 'Occasional discounts and bundle offers.', on: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0 cursor-pointer">
                <div>
                  <p className="text-sm font-bold">{n.label}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{n.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={n.on} className="w-4 h-4 accent-neutral-900 shrink-0" />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
