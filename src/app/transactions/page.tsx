'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

type Transaction = {
  id: number;
  userId: number;
  userName: string | null;
  userEmail: string;
  amountCents: number;
  amountUsd: string;
  currency: string;
  store: string | null;
  eventType: string | null;
  transactionId: string | null;
  revenuecatEventId: string | null;
  createdAt: string;
};

export default function TransactionsPage() {
  const [data, setData] = useState<{ transactions: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransactions().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-white">Loading...</div></Layout>;

  const transactions = data?.transactions ?? [];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-6">All Transactions</h1>
      <p className="text-slate-400 text-sm mb-4">
        Strava profile (name, email) linked to each purchase — see which user made the payment.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Strava Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-mono text-slate-400">{t.id}</td>
                <td className="px-4 py-3 text-white">{t.userName ?? '—'}</td>
                <td className="px-4 py-3 text-slate-300">{t.userEmail}</td>
                <td className="px-4 py-3 text-white">${t.amountUsd}</td>
                <td className="px-4 py-3 text-slate-400">{t.store ?? '—'}</td>
                <td className="px-4 py-3 text-slate-400">{t.eventType ?? '—'}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500 max-w-[120px] truncate" title={t.transactionId ?? undefined}>
                  {t.transactionId ?? '—'}
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <p className="text-slate-500 mt-4">No transactions yet.</p>
      )}
    </Layout>
  );
}
