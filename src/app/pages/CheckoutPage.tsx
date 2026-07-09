import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  CreditCard, ShieldCheck, CheckCircle2, Lock, Star, ArrowLeft,
  Phone, Mail, MapPin, User, Smartphone, Tag, Plus, Minus, Home,
  Briefcase, CheckCheck, Package2, BadgeCheck, ChevronLeft, ChevronRight,
  RotateCcw, Truck, LucideIcon
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const IMAGES = [
  '/Book Mockup1.png',
  '/Book Mockup2.png',
  '/Book Mockup3.png',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli', 'Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const UNIT_PRICE = 1299;
const MRP = 1599;
const COD_FEE = 49;
const COUPONS: Record<string, number> = { 'SPACE10': 10, 'ODI20': 20, 'LAUNCH15': 15 };

// ─── Types ────────────────────────────────────────────────────────────────────
type PayMethod = 'card' | 'upi' | 'cod';
type AddrType = 'home' | 'work' | 'other';

// ─── Input style helper ───────────────────────────────────────────────────────
const inp = (err: boolean, hasIcon = true) =>
  `w-full ${hasIcon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 rounded-lg border text-sm text-neutral-900 placeholder:text-neutral-400 bg-white focus:outline-none transition-all duration-150 ${err
    ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-100'
    : 'border-neutral-200 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-100'
  }`;

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, err, Icon, children }: {
  label: string;
  err?: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none z-10" />}
        {children}
      </div>
      {err && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{err}</p>}
    </div>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────
function AccordionSection({ idx, activeIdx, doneIdx, title, summary, children, onEdit }: {
  idx: number;
  activeIdx: number;
  doneIdx: number;
  title: string;
  summary?: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  const isActive = activeIdx === idx;
  const isDone = doneIdx > idx;
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isActive ? 'border-neutral-800 shadow-md' : isDone ? 'border-emerald-200 bg-emerald-50/30' : 'border-neutral-200 opacity-50 pointer-events-none'}`}>
      <div className={`flex items-center justify-between px-5 py-3.5 ${isActive ? 'bg-neutral-900' : isDone ? 'bg-emerald-50' : 'bg-neutral-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${isActive ? 'bg-white text-neutral-900' : isDone ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
            {isDone ? <CheckCheck className="w-3.5 h-3.5" /> : idx + 1}
          </div>
          <div>
            <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-white' : isDone ? 'text-emerald-700' : 'text-neutral-400'}`}>{title}</span>
            {isDone && summary && (
              <p className="text-[10px] text-emerald-600 font-medium mt-0 hidden sm:block">{summary}</p>
            )}
          </div>
        </div>
        {isDone && onEdit && (
          <button
            onClick={onEdit}
            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wider transition-colors cursor-pointer border border-emerald-300 px-2 py-0.5 rounded-md hover:bg-emerald-100"
          >
            Edit
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 py-5 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Trust badge ──────────────────────────────────────────────────────────────
function TrustBadge({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-full px-2.5 py-1">
      <Icon className="w-3 h-3 flex-shrink-0" />
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();

  // Image carousel
  const [imgIdx, setImgIdx] = useState(0);
  const [imgDir, setImgDir] = useState(1);
  const prevImg = useCallback(() => { setImgDir(-1); setImgIdx(i => (i - 1 + IMAGES.length) % IMAGES.length); }, []);
  const nextImg = useCallback(() => { setImgDir(1); setImgIdx(i => (i + 1) % IMAGES.length); }, []);

  // Quantity & coupon
  const [qty, setQty] = useState(1);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Accordion step
  const [activeSection, setActiveSection] = useState(0);
  const [doneSection, setDoneSection] = useState(0);

  // Form data
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '' });
  const [addrType, setAddrType] = useState<AddrType>('home');
  const [addr, setAddr] = useState({ address1: '', address2: '', city: '', state: '', pinCode: '' });
  const [orderNote, setOrderNote] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [card, setCard] = useState({ nameOnCard: '', cardNumber: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');

  // Processing / success
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMsg, setProcessMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Pricing ──────────────────────────────────────────────────────────────
  const subtotal = UNIT_PRICE * qty;
  const mrpTotal = MRP * qty;
  const savings = mrpTotal - subtotal;
  const couponSaving = couponDiscount > 0 ? Math.round(subtotal * couponDiscount / 100) : 0;
  const grandTotal = subtotal - couponSaving;
  const finalTotal = payMethod === 'cod' ? grandTotal + COD_FEE : grandTotal;

  // ── Coupon ───────────────────────────────────────────────────────────────
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Enter a coupon code'); return; }
    if (COUPONS[code]) {
      setCouponApplied(code); setCouponDiscount(COUPONS[code]); setCouponError('');
    } else {
      setCouponError('Invalid or expired code'); setCouponApplied(''); setCouponDiscount(0);
    }
  };
  const removeCoupon = () => { setCouponApplied(''); setCouponDiscount(0); setCouponInput(''); setCouponError(''); };

  // ── Validators ───────────────────────────────────────────────────────────
  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!contact.fullName.trim()) e.fullName = 'Full name is required';
    if (!/\S+@\S+\.\S+/.test(contact.email)) e.email = 'Valid email required';
    if (!/^[6-9]\d{9}$/.test(contact.phone)) e.phone = 'Valid 10-digit mobile number';
    setErrors(e); return !Object.keys(e).length;
  };
  const validateAddr = () => {
    const e: Record<string, string> = {};
    if (!addr.address1.trim()) e.address1 = 'Address is required';
    if (!addr.city.trim()) e.city = 'City is required';
    if (!addr.state) e.state = 'Please select your state';
    if (!/^\d{6}$/.test(addr.pinCode)) e.pinCode = 'Enter valid 6-digit pin code';
    setErrors(e); return !Object.keys(e).length;
  };
  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (payMethod === 'card') {
      if (!card.nameOnCard.trim()) e.nameOnCard = 'Name on card is required';
      if (card.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter valid 16-digit card number';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = 'Format: MM/YY';
      if (card.cvv.length < 3) e.cvv = 'Enter valid CVV';
    } else if (payMethod === 'upi') {
      if (!/.+@.+/.test(upiId)) e.upiId = 'Enter valid UPI ID (e.g. name@upi)';
    }
    setErrors(e); return !Object.keys(e).length;
  };

  // ── Formatters ───────────────────────────────────────────────────────────
  const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

  // ── Step handlers ────────────────────────────────────────────────────────
  const submitContact = () => { if (validateContact()) { setErrors({}); setActiveSection(1); setDoneSection(s => Math.max(s, 1)); } };
  const submitAddr = () => { if (validateAddr()) { setErrors({}); setActiveSection(2); setDoneSection(s => Math.max(s, 2)); } };
  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;
    setIsProcessing(true);
    const msgs = ['🔒 Establishing secure connection...', '✅ Verifying payment details...', '📦 Reserving your kit...', '🚀 Confirming your order...'];
    let i = 0;
    setProcessMsg(msgs[0]);
    const iv = setInterval(() => {
      i++;
      if (i < msgs.length) setProcessMsg(msgs[i]);
      else { clearInterval(iv); setOrderId(`ODI-${Date.now().toString().slice(-6)}`); setIsProcessing(false); setIsSuccess(true); }
    }, 900);
  };

  // ─── Success screen ───────────────────────────────────────────────────────
  if (isSuccess) return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased flex flex-col items-center justify-center px-4 pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.15, damping: 12 }}
            className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </motion.div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 block mb-2">Order Confirmed</span>
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
            Adventure Awaits!
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Your Space Explorer Kit is on its way to{' '}
            <span className="font-bold text-neutral-800">{addr.city}</span>.
            {' '}Confirmation sent to{' '}
            <span className="font-bold text-neutral-800">{contact.email}</span>.
          </p>
        </motion.div>

        {/* Receipt card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Product strip */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-neutral-100">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
              <img src={IMAGES[0]} alt="Space Explorer Kit" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-neutral-900">Space Explorer 3D Book</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Stereoscopic 3D + Anaglyph Glasses · {qty} {qty > 1 ? 'kits' : 'kit'}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black text-neutral-900">₹{finalTotal.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Total Paid</p>
            </div>
          </div>

          {/* Order meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-100">
            {([
              ['Order ID', orderId],
              ['Payment', payMethod === 'card' ? 'Credit Card' : payMethod === 'upi' ? 'UPI' : 'Cash on Delivery'],
              ['Dispatch', '1–2 Business Days'],
              ['Delivery', '4–6 Business Days'],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="px-5 py-4">
                <p className="text-[9px] uppercase font-black text-neutral-400 tracking-widest">{k}</p>
                <p className="text-xs font-bold text-neutral-800 mt-1">{v}</p>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-start gap-3">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] uppercase font-black text-neutral-400 tracking-widest mb-1">Shipping To</p>
              <p className="text-xs font-bold text-neutral-800">{contact.fullName} · {contact.phone}</p>
              <p className="text-[11px] text-neutral-500">{addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}, {addr.city}, {addr.state} – {addr.pinCode}</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="flex flex-col sm:flex-row gap-3 mt-5"
        >
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3.5 bg-neutral-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer"
          >
            Return Home
          </button>
          <button
            onClick={() => navigate('/products/space-explorer')}
            className="flex-1 py-3.5 border border-neutral-200 text-neutral-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            View Product
          </button>
        </motion.div>
      </motion.div>
    </div>
  );

  // ─── Main Layout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 font-sans antialiased">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-24 pb-12">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer mb-6 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        {/* Page title */}
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight mb-6">Checkout</h1>

        {/* ── Responsive grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-6 xl:gap-8 items-start">

          {/* ══ LEFT: Product + Form ═══════════════════════════════════════ */}
          <div className="space-y-6 min-w-0">

            {/* ── Product card with image carousel ─────────────────────── */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">

                {/* Image carousel */}
                <div className="relative bg-neutral-50 border-b sm:border-b-0 sm:border-r border-neutral-100 select-none">
                  <div className="aspect-[4/3] sm:aspect-square flex items-center justify-center overflow-hidden">
                    <AnimatePresence initial={false} custom={imgDir} mode="wait">
                      <motion.img
                        key={imgIdx}
                        src={IMAGES[imgIdx]}
                        alt={`Space Explorer Book – view ${imgIdx + 1}`}
                        custom={imgDir}
                        variants={{
                          enter: (d: number) => ({ opacity: 0, x: d * 32 }),
                          center: { opacity: 1, x: 0 },
                          exit: (d: number) => ({ opacity: 0, x: d * -32 }),
                        }}
                        initial="enter" animate="center" exit="exit"
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="w-full h-full object-contain p-6"
                        draggable={false}
                      />
                    </AnimatePresence>
                  </div>

                  {/* Arrows */}
                  <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-all">
                    <ChevronLeft className="w-3.5 h-3.5 text-neutral-700" />
                  </button>
                  <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-all">
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-700" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {IMAGES.map((_, i) => (
                      <button key={i} onClick={() => { setImgDir(i > imgIdx ? 1 : -1); setImgIdx(i); }}
                        className={`rounded-full transition-all cursor-pointer ${i === imgIdx ? 'bg-neutral-800 w-4 h-1.5' : 'bg-neutral-300 w-1.5 h-1.5 hover:bg-neutral-400'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product details */}
                <div className="p-5 sm:p-6 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">ODI Kids · Space Series</p>
                      <h2 className="text-lg font-black text-neutral-900 mt-1 leading-snug">Space Explorer 3D Book</h2>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        Stereoscopic 3D illustrations with anaglyph glasses included. Explore 10 planets and cosmic phenomena in stunning depth.
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                      </div>
                      <span className="text-xs text-neutral-500 font-medium">4.9 · 128 reviews</span>
                    </div>

                    {/* Trust pills */}
                    <div className="flex flex-wrap gap-1.5">
                      <TrustBadge Icon={RotateCcw} label="7-Day Returns" />
                      <TrustBadge Icon={Truck} label="Free Delivery" />
                      <TrustBadge Icon={ShieldCheck} label="Secure Checkout" />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2">
                      {IMAGES.map((src, i) => (
                        <button key={i} onClick={() => { setImgDir(i > imgIdx ? 1 : -1); setImgIdx(i); }}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-neutral-50 ${i === imgIdx ? 'border-neutral-900' : 'border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-400'}`}
                        >
                          <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-contain p-1" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price + quantity row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-100">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-neutral-900">₹{UNIT_PRICE.toLocaleString('en-IN')}</span>
                        <span className="text-sm line-through text-neutral-400">₹{MRP.toLocaleString('en-IN')}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          {Math.round((savings / MRP) * 100)}% OFF
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Inclusive of all taxes · Free delivery</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Qty</span>
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer border-r border-neutral-200">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-black text-neutral-900">{qty}</span>
                        <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer border-l border-neutral-200">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {qty > 1 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      Bulk order · {qty} kits · ₹{subtotal.toLocaleString('en-IN')} total
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── "Complete Your Order" accordion ──────────────────────── */}
            <div className="space-y-3">
              <h2 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-black">2</span>
                Complete Your Order
              </h2>

              {/* Section 1 – Contact */}
              <AccordionSection
                idx={0} activeIdx={activeSection} doneIdx={doneSection}
                title="Contact Information"
                summary={contact.fullName ? `${contact.fullName} · ${contact.email}` : undefined}
                onEdit={() => setActiveSection(0)}
              >
                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="Full Name" err={errors.fullName} Icon={User}>
                    <input type="text" value={contact.fullName}
                      onChange={e => { setContact({ ...contact, fullName: e.target.value }); if (errors.fullName) setErrors({ ...errors, fullName: '' }); }}
                      className={inp(!!errors.fullName)} placeholder="Your full name" />
                  </Field>
                  <Field label="Email Address" err={errors.email} Icon={Mail}>
                    <input type="email" value={contact.email}
                      onChange={e => { setContact({ ...contact, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: '' }); }}
                      className={inp(!!errors.email)} placeholder="you@example.com" />
                  </Field>
                  <Field label="Mobile Number" err={errors.phone} Icon={Phone}>
                    <input type="tel" value={contact.phone} maxLength={10}
                      onChange={e => { setContact({ ...contact, phone: e.target.value.replace(/\D/g, '') }); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                      className={inp(!!errors.phone)} placeholder="10-digit mobile" />
                  </Field>
                </div>
                <button onClick={submitContact} className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-neutral-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2">
                  Continue to Delivery <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </AccordionSection>

              {/* Section 2 – Delivery */}
              <AccordionSection
                idx={1} activeIdx={activeSection} doneIdx={doneSection}
                title="Delivery Address"
                summary={addr.city ? `${addr.city}, ${addr.state}` : undefined}
                onEdit={() => setActiveSection(1)}
              >
                {/* Address type */}
                <div className="flex gap-2 mb-4">
                  {([['home', Home, 'Home'], ['work', Briefcase, 'Work'], ['other', MapPin, 'Other']] as [AddrType, LucideIcon, string][]).map(([t, Icon, label]) => (
                    <button key={t} type="button" onClick={() => setAddrType(t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${addrType === t ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Field label="Address Line 1" err={errors.address1} Icon={MapPin}>
                      <input type="text" value={addr.address1}
                        onChange={e => { setAddr({ ...addr, address1: e.target.value }); if (errors.address1) setErrors({ ...errors, address1: '' }); }}
                        className={inp(!!errors.address1)} placeholder="Flat/House no., Street name" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Address Line 2 (optional)">
                      <input type="text" value={addr.address2}
                        onChange={e => setAddr({ ...addr, address2: e.target.value })}
                        className={inp(false, false)} placeholder="Landmark, Area" />
                    </Field>
                  </div>
                  <Field label="City" err={errors.city}>
                    <input type="text" value={addr.city}
                      onChange={e => { setAddr({ ...addr, city: e.target.value }); if (errors.city) setErrors({ ...errors, city: '' }); }}
                      className={inp(!!errors.city, false)} placeholder="e.g. Mumbai" />
                  </Field>
                  <Field label="Pin Code" err={errors.pinCode}>
                    <input type="text" value={addr.pinCode} maxLength={6}
                      onChange={e => { setAddr({ ...addr, pinCode: e.target.value.replace(/\D/g, '') }); if (errors.pinCode) setErrors({ ...errors, pinCode: '' }); }}
                      className={inp(!!errors.pinCode, false)} placeholder="6-digit pin" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="State" err={errors.state}>
                      <select value={addr.state}
                        onChange={e => { setAddr({ ...addr, state: e.target.value }); if (errors.state) setErrors({ ...errors, state: '' }); }}
                        className={`w-full pl-3 pr-8 py-2.5 rounded-lg border text-sm bg-white focus:outline-none appearance-none transition-all ${errors.state ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-neutral-200 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-100'} ${!addr.state ? 'text-neutral-400' : 'text-neutral-900'}`}
                      >
                        <option value="" disabled>Select your state</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Delivery Instructions (optional)</label>
                    <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={2}
                      className="w-full pl-3 pr-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 bg-white focus:outline-none focus:border-neutral-800 focus:ring-2 focus:ring-neutral-100 resize-none transition-all"
                      placeholder="e.g. Leave at door, call before delivery…"
                    />
                  </div>
                </div>
                <button onClick={submitAddr} className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-neutral-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-2">
                  Continue to Payment <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </AccordionSection>

              {/* Section 3 – Payment */}
              <AccordionSection
                idx={2} activeIdx={activeSection} doneIdx={doneSection}
                title="Payment Method"
                onEdit={() => setActiveSection(2)}
              >
                {/* Payment tabs */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {([
                    ['card', CreditCard, 'Credit / Debit Card'],
                    ['upi', Smartphone, 'UPI Payment'],
                    ['cod', Package2, 'Cash on Delivery'],
                  ] as [PayMethod, LucideIcon, string][]).map(([m, Icon, label]) => (
                    <button key={m} type="button" onClick={() => { setPayMethod(m); setErrors({}); }}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${payMethod === m ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 bg-white'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:block text-center leading-tight">{label}</span>
                      <span className="sm:hidden">{label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={submitPayment} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {payMethod === 'card' && (
                      <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <Field label="Name on Card" err={errors.nameOnCard} Icon={User}>
                            <input type="text" value={card.nameOnCard}
                              onChange={e => { setCard({ ...card, nameOnCard: e.target.value }); if (errors.nameOnCard) setErrors({ ...errors, nameOnCard: '' }); }}
                              className={inp(!!errors.nameOnCard)} placeholder="As printed on card" />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Card Number" err={errors.cardNumber} Icon={CreditCard}>
                            <input type="text" value={card.cardNumber} maxLength={19}
                              onChange={e => { setCard({ ...card, cardNumber: fmtCard(e.target.value) }); if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' }); }}
                              className={inp(!!errors.cardNumber)} placeholder="0000 0000 0000 0000" />
                          </Field>
                        </div>
                        <Field label="Expiry (MM/YY)" err={errors.expiry}>
                          <input type="text" value={card.expiry} maxLength={5}
                            onChange={e => { setCard({ ...card, expiry: fmtExp(e.target.value) }); if (errors.expiry) setErrors({ ...errors, expiry: '' }); }}
                            className={inp(!!errors.expiry, false)} placeholder="MM/YY" />
                        </Field>
                        <Field label="CVV" err={errors.cvv}>
                          <input type="password" value={card.cvv} maxLength={4}
                            onChange={e => { setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }); if (errors.cvv) setErrors({ ...errors, cvv: '' }); }}
                            className={inp(!!errors.cvv, false)} placeholder="•••" />
                        </Field>
                      </motion.div>
                    )}
                    {payMethod === 'upi' && (
                      <motion.div key="upi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-3">
                        <Field label="UPI ID" err={errors.upiId} Icon={Smartphone}>
                          <input type="text" value={upiId}
                            onChange={e => { setUpiId(e.target.value); if (errors.upiId) setErrors({ ...errors, upiId: '' }); }}
                            className={inp(!!errors.upiId)} placeholder="name@paytm / name@ybl" />
                        </Field>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-medium">
                          A payment request will be sent to your UPI app. Open your app and approve to confirm the order.
                        </div>
                      </motion.div>
                    )}
                    {payMethod === 'cod' && (
                      <motion.div key="cod" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 space-y-1.5">
                          <p className="text-sm font-black text-amber-900">Cash on Delivery</p>
                          <p className="text-xs text-amber-700">Pay ₹{finalTotal.toLocaleString('en-IN')} in cash when your kit is delivered. A ₹{COD_FEE} handling charge is applied.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Processing state */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 py-2">
                        <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin flex-shrink-0" />
                        <p className="text-xs text-neutral-500 font-medium">{processMsg}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isProcessing && (
                    <>
                      <button type="submit"
                        className="w-full py-4 bg-neutral-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-neutral-900/10"
                      >
                        <Lock className="w-4 h-4" />
                        {payMethod === 'cod' ? `Place Order · ₹${finalTotal.toLocaleString('en-IN')} (COD)` : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                      </button>
                      <div className="flex items-center justify-center gap-5 flex-wrap">
                        {(['SSL Secured', '256-bit Encryption', 'PCI Compliant'] as string[]).map(t => (
                          <span key={t} className="flex items-center gap-1 text-[9px] text-neutral-400 font-medium">
                            <ShieldCheck className="w-3 h-3" />{t}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </form>
              </AccordionSection>
            </div>
          </div>

          {/* ══ RIGHT: Order Summary (sticky) ══════════════════════════════ */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-neutral-50 border-b border-neutral-100 px-5 py-3.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-600">Order Summary</h3>
              </div>
              <div className="p-5 space-y-5">

                {/* Product row */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 flex-shrink-0">
                    <img src={IMAGES[imgIdx]} alt="Space Explorer Kit" className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-neutral-900 leading-snug">Space Explorer 3D Book</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">+ Anaglyph Glasses Included</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Qty:</span>
                      <span className="text-xs font-black text-neutral-900">{qty}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] line-through text-neutral-400">₹{mrpTotal.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Coupon */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5"><Tag className="w-3 h-3" />Promo Code</p>
                  {couponApplied ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs font-black text-emerald-700">{couponApplied} · {couponDiscount}% OFF applied</span>
                      </div>
                      <button onClick={removeCoupon} className="text-[10px] font-bold text-red-500 hover:text-red-700 cursor-pointer ml-2">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                        className="flex-1 pl-3 pr-2 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-200 uppercase font-bold tracking-wider placeholder:normal-case placeholder:font-normal"
                        placeholder="Enter coupon code"
                      />
                      <button onClick={applyCoupon} className="px-4 py-2 bg-neutral-900 text-white text-xs font-black rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap">Apply</button>
                    </div>
                  )}
                  {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5 border-t border-neutral-100 pt-4">
                  {([
                    ['Price', null, `₹${mrpTotal.toLocaleString('en-IN')}`, `₹${subtotal.toLocaleString('en-IN')}`],
                    ['Discount', null, null, `− ₹${savings.toLocaleString('en-IN')}`],
                    ...(couponSaving > 0 ? [['Coupon Discount', null, null, `− ₹${couponSaving.toLocaleString('en-IN')}`]] : []),
                    ['Delivery', null, null, 'FREE'],
                    ['GST', null, null, 'Included'],
                    ...(payMethod === 'cod' ? [['COD Fee', null, null, `₹${COD_FEE}`]] : []),
                  ] as [string, null, string | null, string][]).map(([label, , strike, value]) => (
                    <div key={label} className="flex justify-between text-xs text-neutral-500">
                      <span>{label}</span>
                      <div className="flex items-center gap-2">
                        {strike && <span className="line-through text-neutral-300">{strike}</span>}
                        <span className={`font-semibold ${value === 'FREE' || value?.startsWith('−') ? 'text-emerald-600' : 'text-neutral-800'}`}>{value}</span>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-end">
                    <span className="text-sm font-black text-neutral-900">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-neutral-900">₹{finalTotal.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        You save ₹{(savings + couponSaving).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 flex items-center gap-3">
              <Truck className="w-4 h-4 text-neutral-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-neutral-700">Free delivery across India</p>
                <p className="text-[10px] text-neutral-400">Estimated 4–6 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
