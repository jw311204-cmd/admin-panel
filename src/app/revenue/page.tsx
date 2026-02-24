'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

type SummaryItem = {
  code: string;
  influencerName: string;
  totalRevenueUsd: string;
  influencerShareUsd: string;
  eventCount: number;
  commissionPercentage: number;
};

export default function RevenuePage() {
  const [data, setData] = useState<{ summary: SummaryItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRevenueSummary().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-white">Loading...</div></Layout>;

  const summary = data?.summary ?? [];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-6">Revenue</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3">Influencer</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Total Revenue</th>
              <th className="px-4 py-3">Commission %</th>
              <th className="px-4 py-3">Share</th>
              <th className="px-4 py-3">Purchases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {summary.map((r, i) => (
              <tr key={`${r.code}-${i}`}>
                <td className="px-4 py-3 text-white">{r.influencerName}</td>
                <td className="px-4 py-3 font-mono text-slate-300">{r.code}</td>
                <td className="px-4 py-3 text-white">${r.totalRevenueUsd}</td>
                <td className="px-4 py-3 text-slate-400">{r.commissionPercentage}%</td>
                <td className="px-4 py-3 text-indigo-400">${r.influencerShareUsd}</td>
                <td className="px-4 py-3 text-slate-400">{r.eventCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
