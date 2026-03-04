'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://everest-backend-qquj.onrender.com').replace(/\/api\/?$/, '');

function getRefLink(code: string) {
  return `${API_BASE}/ref/${encodeURIComponent(code)}`;
}

type PromoCode = {
  id: number;
  code: string;
  isActive: boolean;
  createdAt: string;
  influencer: { id: number; name: string; email: string };
};

type Influencer = { id: number; name: string; email: string; isDisabled?: boolean };

export default function PromoCodesPage() {
  const [promos, setPromos] = useState<{ promo_codes: PromoCode[] } | null>(null);
  const [influencers, setInfluencers] = useState<{ influencers: Influencer[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formCode, setFormCode] = useState('');
  const [formInfluencerId, setFormInfluencerId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyLink = async (code: string) => {
    const link = getRefLink(code);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      alert('Failed to copy');
    }
  };

  const load = async () => {
    const [p, i] = await Promise.all([api.getPromoCodes(), api.getPromoAssignments()]);
    setPromos(p);
    setInfluencers(await api.getInfluencers());
    const counts: Record<string, number> = {};
    (i.assignments ?? []).forEach((a: { promoCode: string }) => {
      counts[a.promoCode] = (counts[a.promoCode] || 0) + 1;
    });
    setUsageCounts(counts);
  };

  useEffect(() => {
    load().catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formInfluencerId) return;
    setSubmitting(true);
    try {
      await api.createPromoCode({ code: formCode.trim().toUpperCase(), influencer_id: formInfluencerId as number });
      setFormCode('');
      setFormInfluencerId('');
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><div className="text-white">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Generate Promo Code'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Code *</label>
              <input value={formCode} onChange={(e) => setFormCode(e.target.value.toUpperCase())} placeholder="PROMO20" required className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Influencer *</label>
              <select value={formInfluencerId} onChange={(e) => setFormInfluencerId(e.target.value ? parseInt(e.target.value, 10) : '')} required className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600">
                <option value="">Select...</option>
                {(influencers?.influencers ?? []).filter((i) => !i.isDisabled).map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Influencer</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Usage Count</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(promos?.promo_codes ?? []).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-white font-mono">{p.code}</td>
                <td className="px-4 py-3 text-slate-300">{p.influencer?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs truncate max-w-[180px]" title={getRefLink(p.code)}>
                      {getRefLink(p.code)}
                    </span>
                    <button
                      onClick={() => copyLink(p.code)}
                      className="shrink-0 px-2 py-1 rounded bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      {copiedCode === p.code ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">{p.isActive ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span>}</td>
                <td className="px-4 py-3 text-white">{usageCounts[p.code] ?? 0}</td>
                <td className="px-4 py-3 text-slate-400">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
