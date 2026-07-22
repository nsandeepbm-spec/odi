import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { formatInr } from '../../data/products';
import { persistCheckoutProduct } from '../../lib/checkout';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;

    const item = items[0];
    persistCheckoutProduct(item.id, item.quantity);
    closeDrawer();
    navigate(`/checkout/review?product=${item.id}`);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h2 className="text-lg font-black text-neutral-900">Your Cart</h2>
                <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {items.length}
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                  <ShoppingBag className="w-16 h-16 text-neutral-200 mb-4" />
                  <p className="font-bold text-neutral-900 mb-2">Your cart is empty</p>
                  <p className="text-sm">Looks like you haven't added any products yet.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-neutral-50 rounded-lg border border-neutral-200 p-2 shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-neutral-900 leading-tight">{item.name}</h3>
                          <p className="text-xs text-neutral-500 mt-1">{formatInr(item.pricePaise)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="w-7 h-7 flex items-center justify-center border-l border-r border-neutral-300 text-xs font-bold">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 text-neutral-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-neutral-900 ml-auto">
                          {formatInr(item.pricePaise * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-6 bg-neutral-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-neutral-600">Subtotal</span>
                  <span className="font-black text-xl text-neutral-900">{formatInr(getTotal())}</span>
                </div>
                <p className="text-xs text-neutral-500 text-center mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl bg-black text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
