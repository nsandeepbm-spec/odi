import React from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-neutral-500">Overview of your store's performance.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹145,850', icon: IndianRupee, trend: '+12.5%' },
          { label: 'Total Orders', value: '146', icon: ShoppingBag, trend: '+5.2%' },
          { label: 'Active Customers', value: '1,204', icon: Users, trend: '+18.1%' },
          { label: 'Conversion Rate', value: '3.4%', icon: TrendingUp, trend: '+1.2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900">{stat.value}</p>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-bold">Needs Attention</h2>
          <button className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">View All Orders</button>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium text-indigo-600">#ORD-0922</td>
                <td className="px-6 py-4">Rahul Sharma</td>
                <td className="px-6 py-4">Space Explorer 3D Book</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">Processing</span>
                </td>
                <td className="px-6 py-4 text-right font-bold">₹1299</td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium text-indigo-600">#ORD-0921</td>
                <td className="px-6 py-4">Sandeep</td>
                <td className="px-6 py-4">Space Explorer 3D Book</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">Processing</span>
                </td>
                <td className="px-6 py-4 text-right font-bold">₹1299</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
