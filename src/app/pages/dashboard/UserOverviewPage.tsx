import React from 'react';
import { Package, Clock, CreditCard } from 'lucide-react';

export default function UserOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome, Sandeep</h1>
        <p className="text-neutral-500">Here's what's happening with your account today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: '2', icon: Package },
          { label: 'Pending Deliveries', value: '1', icon: Clock },
          { label: 'Saved Cards', value: '1', icon: CreditCard },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">{stat.label}</p>
              <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-bold">Recent Orders</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium">#ORD-0921</td>
                <td className="px-6 py-4">Space Explorer 3D Book</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">Processing</span>
                </td>
                <td className="px-6 py-4 text-neutral-500">Oct 24, 2026</td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium">#ORD-0814</td>
                <td className="px-6 py-4">Dinosaur Explorer 3D Book</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full">Delivered</span>
                </td>
                <td className="px-6 py-4 text-neutral-500">Sep 12, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
