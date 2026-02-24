'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (pathname === '/login') return;
    if (!getToken()) {
      router.replace('/login');
    }
  }, [mounted, pathname, router]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  return <>{children}</>;
}
