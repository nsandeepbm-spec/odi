import React from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';

export default function AdminOrdersPage() {
  const orders = [
    { id: 'ORD-0923', customer: 'Anita Desai', date: 'Oct 25, 2026', total: '₹2598', status: 'Processing', items: 2 },
    { id: 'ORD-0922', customer: 'Rahul Sharma', date: 'Oct 24, 2026', total: '₹1299', status: 'Processing', items: 1 },
    { id: 'ORD-0921', customer: 'Sandeep', date: 'Oct 24, 2026', total: '₹1299', status: 'Shipped', items: 1 },
    { id: 'ORD-0814', customer: 'Vikram Singh', date: 'Sep 12, 2026', total: '₹3897', status: 'Delivered', items: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">All Orders</h1>
          <p className="text-neutral-500">Manage and update order statuses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-neutral-500">{order.date}</td>
                  <td className="px-6 py-4 text-center">{order.items}</td>
                  <td className="px-6 py-4 font-bold">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-500">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
