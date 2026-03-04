'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Layout from '@/components/Layout';

export default function DashboardPage() {
  const [data, setData] = useState<{
    totalInfluencers?: number;
    totalRevenueUsd?: string;
    totalRevenueWithPromoUsd?: string;
    totalAffiliateRevenueUsd?: string;
    totalPurchases?: number;
    totalPurchasesWithPromo?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-white">Loading...</div></Layout>;

  const cards = [
    { label: 'Total Influencers', value: data?.totalInfluencers ?? 0 },
    { label: 'Total Revenue', value: `$${data?.totalRevenueUsd ?? '0.00'}`, sub: `${data?.totalPurchases ?? 0} purchases` },
    { label: 'Total with Promo', value: `$${data?.totalRevenueWithPromoUsd ?? '0.00'}`, sub: `${data?.totalPurchasesWithPromo ?? 0} purchases` },
    { label: 'Affiliate Revenue', value: `$${data?.totalAffiliateRevenueUsd ?? '0.00'}` },
    { label: 'Total Purchases', value: data?.totalPurchases ?? 0 },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub }) => (
          <div key={label} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-xl font-bold text-white mt-1">{value}</p>
            {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
          </div>
        ))}
      </div>
    </Layout>
  );
}
