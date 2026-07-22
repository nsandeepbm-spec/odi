import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle2, Package, ArrowRight, Download, MapPin } from 'lucide-react';
import { useCheckout } from '../../lib/checkout';
import { useCartStore } from '../../store/cartStore';
import { formatInr } from '../../data/products';

export default function CheckoutSuccessPage() {
  const { product, quantity, lastOrderId, shipping } = useCheckout();
  const { items, getTotal } = useCartStore();
  
  const orderId = lastOrderId ?? '—';
  const displayItems = items.length > 0 ? items : (product ? [{...product, quantity, imageUrl: product.images[0]}] : []);
  const finalTotal = items.length > 0 ? getTotal() : (product ? product.pricePaise * quantity : 0);
  
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
      
      {/* Left Column: Success Message */}
      <div className="lg:col-span-8 flex flex-col justify-center py-10 lg:py-20 lg:pr-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-[#00a680]/10 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-10 h-10 text-[#00a680]" />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 mb-6"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-neutral-500 mb-10 max-w-lg leading-relaxed"
        >
          Thank you for your purchase. We are getting your order ready to be shipped. We will notify you when it has been sent.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/dashboard/orders"
            className="px-8 py-4 rounded-xl bg-black text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
          >
            <Package className="w-5 h-5" />
            Track Order Status
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 rounded-xl border-2 border-neutral-200 text-neutral-900 font-bold tracking-wide hover:border-neutral-900 transition-colors flex items-center justify-center gap-3"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Right Column: Premium Receipt */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="lg:col-span-4 flex flex-col gap-6"
      >
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
          
          <div className="flex items-start justify-between mb-8 border-b border-neutral-100 pb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">Order Number</p>
              <p className="text-lg font-black text-neutral-900">#{orderId}</p>
            </div>
            <button className="p-2 bg-neutral-50 text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Product Rows */}
          <div className="flex flex-col gap-4 mb-6">
            {displayItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#f7f7f7] rounded-lg border border-neutral-200 flex items-center justify-center p-2 shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <Package className="w-6 h-6 text-neutral-300" />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-neutral-900 leading-tight">{item.name}</span>
                    <span className="font-bold text-neutral-900 shrink-0">
                      {formatInr(item.pricePaise * (item.quantity || 1))}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 mb-1">Qty: {item.quantity || 1}</span>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-neutral-100 my-4" />

          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-neutral-600">Total Paid</span>
            <span className="font-black text-xl text-neutral-900">{formatInr(finalTotal)}</span>
          </div>

          <hr className="border-neutral-100 my-6" />

          {/* Customer & Shipping */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">Customer Information</p>
              <p className="text-sm font-bold text-neutral-900">{shipping.firstName || 'Guest User'}</p>
              <p className="text-sm text-neutral-500">{shipping.email}</p>
              <p className="text-sm text-neutral-500">{shipping.phone}</p>
            </div>
            
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">Shipping Address</p>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div className="text-sm text-neutral-600 leading-relaxed">
                  <p>{shipping.street}</p>
                  <p>{shipping.city}, {shipping.postalCode}</p>
                  <p>India</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
