import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden text-center p-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
      </motion.div>

      <h1 className="text-4xl font-black tracking-tight mb-4">Order Confirmed!</h1>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto">
        Thank you for your purchase. We've received your order and will begin processing it right away.
      </p>

      <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left border border-neutral-100">
        <h3 className="font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Order Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Order Number</span>
            <span className="font-bold text-neutral-900">#ORD-0924</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Date</span>
            <span className="font-bold text-neutral-900">Oct 26, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Total</span>
            <span className="font-bold text-neutral-900">₹1299</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Payment Method</span>
            <span className="font-bold text-neutral-900">Credit Card ending in 4242</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/dashboard/orders" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
          <Package className="w-5 h-5" />
          Track Order
        </Link>
        <Link to="/" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-200 text-neutral-900 font-bold tracking-wide hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
          Continue Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
