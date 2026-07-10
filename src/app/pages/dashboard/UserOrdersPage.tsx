import React from 'react';
import { Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

export default function UserOrdersPage() {
  const orders = [
    { id: 'ORD-0921', date: 'Oct 24, 2026', total: '₹1299', status: 'Processing', item: 'Space Explorer 3D Book' },
    { id: 'ORD-0814', date: 'Sep 12, 2026', total: '₹999', status: 'Delivered', item: 'Dinosaur Explorer 3D Book' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">My Orders</h1>
        <p className="text-neutral-500">View and track your previous purchases.</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-neutral-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{order.item}</h3>
                <div className="text-sm text-neutral-500 mt-1 space-x-3">
                  <span>Order {order.id}</span>
                  <span>&bull;</span>
                  <span>{order.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 md:gap-8 border-t md:border-none border-neutral-100 pt-4 md:pt-0">
              <div className="text-left md:text-right">
                <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">Status</div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">Total</div>
                <div className="font-black">{order.total}</div>
              </div>
              <Link to="#" className="p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                <ExternalLink className="w-5 h-5 text-neutral-400" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
