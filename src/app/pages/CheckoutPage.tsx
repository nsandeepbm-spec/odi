import React from 'react';
import { useNavigate } from 'react-router';

export default function CheckoutPage() {
  const navigate = useNavigate();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout/payment');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
      
      {/* Left: Form */}
      <div className="w-full md:w-3/5 p-8 md:p-12">
        <h2 className="text-2xl font-black tracking-tight mb-8">Shipping Details</h2>
        
        <form onSubmit={handleContinue} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold border-b border-neutral-100 pb-2">Contact Information</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Email Address</label>
              <input type="email" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Phone Number</label>
              <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="+91 98765 43210" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold border-b border-neutral-100 pb-2">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">First Name</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Last Name</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Street Address</label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="123 Main St, Apt 4B" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">City</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Postal Code</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" className="w-full py-4 rounded-xl bg-neutral-900 text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors">
              Continue to Payment
            </button>
          </div>
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full md:w-2/5 bg-neutral-50 p-8 md:p-12 border-l border-neutral-100">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-24 bg-white rounded-lg border border-neutral-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
             <img src="/Book Mockup3.png" alt="Space Explorer" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-neutral-900">Space Explorer 3D Book</h3>
            <p className="text-xs text-neutral-500 mt-1">Includes Glasses & Cards</p>
            <div className="text-sm font-bold mt-2">₹1299</div>
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-neutral-200 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>₹1299</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span className="text-emerald-600 font-bold">Free</span>
          </div>
          <div className="flex justify-between font-black text-lg pt-4 border-t border-neutral-200">
            <span>Total</span>
            <span>₹1299</span>
          </div>
        </div>
      </div>
    </div>
  );
}
