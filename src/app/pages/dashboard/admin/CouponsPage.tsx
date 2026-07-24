import React, { useEffect, useState } from 'react';
import { Tag, Plus, Search, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, Card, EmptyState, inrFromPaise } from '../../../components/dashboard/shared';
import { listAdminCoupons, updateAdminCoupon, createAdminCoupon, type AdminCoupon } from '../../../lib/api';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Coupon form state
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed_paise'>('percent');
  const [newValue, setNewValue] = useState(10);
  const [newMinSubtotal, setNewMinSubtotal] = useState(0);

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);
    try {
      const res = await listAdminCoupons(1, 100);
      setCoupons(res.coupons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const updated = await updateAdminCoupon(id, { active: !current });
      setCoupons(coupons.map(c => c.id === id ? updated : c));
    } catch (err) {
      alert('Failed to update coupon status');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setSaving(true);
    try {
      await createAdminCoupon({
        code: newCode,
        type: newType,
        value: newType === 'fixed_paise' ? newValue * 100 : newValue,
        min_subtotal_paise: newMinSubtotal * 100,
        active: true,
      });
      setIsCreating(false);
      setNewCode('');
      setNewValue(10);
      setNewMinSubtotal(0);
      await loadCoupons();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  if (loading && coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Loading coupons…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Promotions &"
        accent="Coupons."
        subtitle="Create discount codes to drive sales and track their usage."
        action={
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:bg-neutral-800 transition-colors rounded-xl"
          >
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        }
      />

      {isCreating && (
        <Card title="Create New Coupon" className="mb-6">
          <form onSubmit={handleCreate} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Code</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Discount Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed_paise">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Value {newType === 'percent' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                required
                min="1"
                max={newType === 'percent' ? "100" : undefined}
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Minimum Order Subtotal (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={newMinSubtotal}
                onChange={(e) => setNewMinSubtotal(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Coupon
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {error ? (
          <EmptyState icon={AlertCircle} title="Could not load coupons" subtitle={error} />
        ) : coupons.length === 0 ? (
          <EmptyState icon={Tag} title="No coupons found" subtitle="Create your first discount code above." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[720px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">Discount</th>
                  <th className="px-6 py-3.5">Usage</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold font-mono text-indigo-600 text-base">{c.code}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">
                        {c.type === 'percent' ? `${c.value}% OFF` : `${inrFromPaise(c.value)} OFF`}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {c.min_subtotal_paise > 0 ? `Min order ${inrFromPaise(c.min_subtotal_paise)}` : 'No minimum'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-600">
                      {c.used_count} {c.max_uses ? `/ ${c.max_uses}` : ''}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{formatDate(c.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleActive(c.id, c.active)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
                          c.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
