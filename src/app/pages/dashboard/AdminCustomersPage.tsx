import React from 'react';
import { Search, Mail, ExternalLink } from 'lucide-react';

export default function AdminCustomersPage() {
  const customers = [
    { id: 'CUST-012', name: 'Sandeep', email: 'sandeep@example.com', orders: 2, spent: '₹2598', joined: 'Sep 10, 2026' },
    { id: 'CUST-013', name: 'Rahul Sharma', email: 'rahul.s@example.com', orders: 1, spent: '₹1299', joined: 'Oct 24, 2026' },
    { id: 'CUST-014', name: 'Anita Desai', email: 'anita.d@example.com', orders: 4, spent: '₹5196', joined: 'Aug 05, 2026' },
    { id: 'CUST-015', name: 'Vikram Singh', email: 'vikram.singh@example.com', orders: 1, spent: '₹3897', joined: 'Sep 12, 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Customers</h1>
          <p className="text-neutral-500">View and manage your customer base.</p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">{customer.name}</div>
                    <div className="text-xs text-neutral-400">{customer.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-neutral-500 hover:text-indigo-600 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      {customer.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">{customer.orders}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">{customer.spent}</td>
                  <td className="px-6 py-4 text-neutral-500">{customer.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-500">
                      <ExternalLink className="w-4 h-4" />
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
