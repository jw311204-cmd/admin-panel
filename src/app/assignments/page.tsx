'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

type Assignment = {
  userId: number;
  userEmail: string;
  userName: string;
  promoCode: string;
  influencerName: string;
  influencerEmail: string;
  assignedAt: string;
};

export default function AssignmentsPage() {
  const [data, setData] = useState<{ assignments: Assignment[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPromoAssignments().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-white">Loading...</div></Layout>;

  const assignments = data?.assignments ?? [];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-6">Promo Assignments</h1>
      <p className="text-slate-400 text-sm mb-4">Users who applied a promo code.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Promo Code</th>
              <th className="px-4 py-3">Influencer</th>
              <th className="px-4 py-3">Assigned At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {assignments.map((a, i) => (
              <tr key={`${a.userId}-${a.promoCode}-${i}`}>
                <td className="px-4 py-3 text-white">{a.userName || '—'}</td>
                <td className="px-4 py-3 text-slate-300">{a.userEmail}</td>
                <td className="px-4 py-3 font-mono text-indigo-400">{a.promoCode}</td>
                <td className="px-4 py-3 text-slate-300">{a.influencerName}</td>
                <td className="px-4 py-3 text-slate-400">{a.assignedAt ? new Date(a.assignedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
