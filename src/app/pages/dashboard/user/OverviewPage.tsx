import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Package, Truck, CreditCard, ArrowUpRight, Sparkles } from 'lucide-react';
import { PageHeader, StatCard, Card, BookingBadge, inr } from '../../../components/dashboard/shared';
import { myBookings } from '../../../data/mock';
import { displayName, useAuth } from '../../../lib/auth';

export default function OverviewPage() {
  const { user } = useAuth();
  const active = myBookings.find((b) => b.status === 'shipped' || b.status === 'processing' || b.status === 'confirmed');
  const firstName = user ? displayName(user).split(' ')[0] : 'there';

  return (
    <div>
      <PageHeader
        title={`Hey, ${firstName}`}
        accent="👋"
        subtitle="Here's what's happening with your bookings today."
        action={
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:-translate-y-0.5 transition-transform rounded-xl"
          >
            Browse Books <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Bookings" value={`${myBookings.length}`} icon={Package} delay={0} />
        <StatCard label="On the Way" value={active ? '1' : '0'} icon={Truck} delay={0.06} />
        <StatCard label="Total Spent" value={inr(myBookings.filter(b => b.payment === 'paid').reduce((s, b) => s + b.amount, 0))} icon={CreditCard} delay={0.12} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active shipment tracker */}
        <Card title="Active Booking" className="xl:col-span-2">
          {active ? (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <p className="font-black text-lg tracking-tight">{active.product}</p>
                  <p className="text-xs text-neutral-400 font-semibold mt-0.5">#{active.id} · Booked {active.date}</p>
                </div>
                <BookingBadge status={active.status} />
              </div>

              {/* Progress steps */}
              <div className="flex items-center">
                {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                  const stepIndex = ['confirmed', 'processing', 'shipped', 'delivered'].indexOf(active.status);
                  const done = i <= stepIndex;
                  return (
                    <React.Fragment key={step}>
                      {i > 0 && (
                        <div className={`flex-1 h-0.5 ${i <= stepIndex ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-neutral-100'}`} />
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 ${
                            done ? 'bg-gradient-to-br from-cyan-400 to-indigo-500 border-transparent' : 'bg-white border-neutral-200'
                          }`}
                        />
                        <span className={`text-[9px] font-bold tracking-wider uppercase ${done ? 'text-neutral-900' : 'text-neutral-300'}`}>
                          {step}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="font-bold text-sm mb-1">No active bookings</p>
              <p className="text-xs text-neutral-400">When you book a product, you can track it here.</p>
            </div>
          )}
        </Card>

        {/* Promo card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative rounded-2xl overflow-hidden border border-neutral-200/60 shadow-sm bg-white p-6 flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center mb-5">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black tracking-tight text-xl leading-tight mb-2">
            Ocean Explorer is{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              coming.
            </span>
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed flex-1">
            Vol. 02 dives into glowing coral reefs and ocean giants. Be the first to know when it launches.
          </p>
          <button className="mt-5 w-full py-3 text-sm font-semibold tracking-wide border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            Notify Me
          </button>
        </motion.div>
      </div>

      {/* Recent bookings */}
      <Card
        title="Recent Bookings"
        className="mt-6"
        action={
          <Link to="/dashboard/bookings" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
            View All
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[560px]">
            <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
              <tr>
                <th className="px-6 py-3.5">Booking</th>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {myBookings.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">#{b.id}</div>
                    <div className="text-xs text-neutral-400">{b.date}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{b.product}</td>
                  <td className="px-6 py-4"><BookingBadge status={b.status} /></td>
                  <td className="px-6 py-4 text-right font-black">{inr(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
