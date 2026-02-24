'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

type Influencer = {
  id: number;
  name: string;
  email: string;
  commissionPercentage: number;
  isDisabled: boolean;
  promoCount: number;
  totalRevenueUsd: string;
  shareUsd: string;
};

export default function InfluencersPage() {
  const [list, setList] = useState<{ influencers: Influencer[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCommission, setFormCommission] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCommission, setEditCommission] = useState(30);

  const load = () => api.getInfluencers().then(setList).catch(console.error);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createInfluencer({
        name: formName.trim(),
        email: formEmail.trim() || undefined,
        commissionPercentage: formCommission,
      });
      setFormName('');
      setFormEmail('');
      setFormCommission(30);
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatch = async (id: number, commission?: number, isDisabled?: boolean) => {
    try {
      await api.patchInfluencer(id, { commissionPercentage: commission, isDisabled });
      setEditingId(null);
      await load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  if (loading) return <Layout><div className="text-white">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Influencers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Influencer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Name *</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Email</label>
              <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Commission %</label>
              <input type="number" min={0} max={100} value={formCommission} onChange={(e) => setFormCommission(parseInt(e.target.value, 10) || 30)} className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600" />
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Share</th>
              <th className="px-4 py-3">Promos</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(list?.influencers ?? []).map((i) => (
              <tr key={i.id} className={i.isDisabled ? 'opacity-50' : ''}>
                <td className="px-4 py-3 text-white">{i.name}</td>
                <td className="px-4 py-3 text-slate-400">{i.email || '—'}</td>
                <td className="px-4 py-3">
                  {editingId === i.id ? (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editCommission}
                      onChange={(e) => setEditCommission(parseInt(e.target.value, 10) || 30)}
                      className="w-16 px-2 py-1 rounded bg-slate-700 text-white"
                    />
                  ) : (
                    <span className="text-white">{i.commissionPercentage}%</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white">${i.totalRevenueUsd}</td>
                <td className="px-4 py-3 text-indigo-400">${i.shareUsd}</td>
                <td className="px-4 py-3 text-slate-400">{i.promoCount}</td>
                <td className="px-4 py-3">
                  {editingId === i.id ? (
                    <>
                      <button onClick={() => handlePatch(i.id, editCommission)} className="text-indigo-400 text-sm mr-2">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 text-sm">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(i.id); setEditCommission(i.commissionPercentage); }} className="text-indigo-400 text-sm mr-2">Edit</button>
                      <button onClick={() => handlePatch(i.id, undefined, !i.isDisabled)} className="text-slate-400 text-sm">{i.isDisabled ? 'Enable' : 'Disable'}</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
