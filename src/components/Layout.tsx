'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearToken } from '@/lib/api';

const nav = [
  { href: '/', label: 'Dashboard' },
  { href: '/influencers', label: 'Influencers' },
  { href: '/promo-codes', label: 'Promo Codes' },
  { href: '/revenue', label: 'Revenue' },
  { href: '/assignments', label: 'Promo Assignments' },
  { href: '/change-password', label: 'Change Password' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <aside className="w-56 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
        <h1 className="text-lg font-bold text-white mb-6 px-2">Admin Panel</h1>
        <nav className="flex-1 space-y-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === href ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            clearToken();
            window.location.href = '/login';
          }}
          className="mt-4 px-3 py-2 text-sm text-slate-400 hover:text-white"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
