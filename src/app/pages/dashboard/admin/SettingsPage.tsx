import React from 'react';
import { PageHeader, Card } from '../../../components/dashboard/shared';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm';
const labelCls = 'text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Platform"
        accent="Settings."
        subtitle="Store configuration, team access and notifications."
      />

      <div className="space-y-6 max-w-3xl">
        <Card title="Store Details">
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelCls}>Store Name</label>
                <input type="text" defaultValue="ODI Kids Store" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Support Email</label>
                <input type="email" defaultValue="support@odi.com" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Currency</label>
                <input type="text" defaultValue="INR (₹)" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Shipping Fee</label>
                <input type="text" defaultValue="Free" className={inputCls} />
              </div>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold tracking-wide hover:-translate-y-0.5 transition-transform">
              Save Changes
            </button>
          </div>
        </Card>

        <Card title="Notifications">
          <div className="p-6 divide-y divide-neutral-100">
            {[
              { label: 'New booking alerts', desc: 'Get notified whenever a new booking is placed.', on: true },
              { label: 'Payment failures', desc: 'Alert when a payment fails or needs review.', on: true },
              { label: 'Low stock warnings', desc: 'Notify when a product drops below 20 units.', on: true },
              { label: 'Weekly summary', desc: 'A digest of revenue and bookings every Monday.', on: false },
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

        <Card title="Team Access">
          <div className="p-6">
            <div className="divide-y divide-neutral-100">
              {[
                { name: 'Sandeep', email: 'sandeep@example.com', role: 'Owner' },
                { name: 'Ananya Iyer', email: 'ananya@odi.com', role: 'Manager' },
              ].map((m) => (
                <div key={m.email} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                    {m.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{m.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{m.email}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-500 shrink-0">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-5 px-6 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold tracking-wide hover:bg-neutral-50 transition-colors">
              Invite Member
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
