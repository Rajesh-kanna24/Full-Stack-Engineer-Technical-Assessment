'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/profile', label: 'Profile' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-900/80 p-6 md:flex">
        <Link href="/" className="text-xl font-semibold">AI JobPortal</Link>
        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-6 py-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <Link href="/" className="text-sm text-slate-400">Back to home</Link>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
