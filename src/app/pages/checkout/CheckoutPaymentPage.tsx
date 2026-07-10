import React from 'react';
import { useNavigate, Link } from 'react-router';
import { CreditCard, CheckCircle2 } from 'lucide-react';

export default function CheckoutPaymentPage() {
  const navigate = useNavigate();

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/checkout/success');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
      
      {/* Left: Form */}
      <div className="w-full md:w-3/5 p-8 md:p-12">
        <h2 className="text-2xl font-black tracking-tight mb-8">Payment Method</h2>
        
        <form onSubmit={handlePay} className="space-y-6">
          
          <div className="space-y-4">
            {/* Credit Card Option (Selected by default) */}
            <div className="border-2 border-indigo-500 rounded-xl p-4 bg-indigo-50/30 flex items-center gap-4 cursor-pointer">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              <div className="flex-1">
                <div className="font-bold text-neutral-900">Credit / Debit Card</div>
                <div className="text-xs text-neutral-500">Secure encrypted payment</div>
              </div>
              <CreditCard className="w-6 h-6 text-indigo-500" />
            </div>

            {/* Other Options (Disabled for demo) */}
            <div className="border border-neutral-200 rounded-xl p-4 flex items-center gap-4 opacity-50 cursor-not-allowed">
              <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
              <div className="flex-1">
                <div className="font-bold text-neutral-900">UPI / Netbanking</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Card Number</label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">Expiry Date</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider uppercase text-neutral-500">CVC</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="123" />
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-4">
            <Link to="/checkout" className="px-6 py-4 rounded-xl font-bold text-neutral-500 hover:bg-neutral-50 transition-colors">
              Back
            </Link>
            <button type="submit" className="flex-1 py-4 rounded-xl bg-neutral-900 text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors shadow-lg">
              Pay ₹1299
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
