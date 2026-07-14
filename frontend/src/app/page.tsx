import Link from 'next/link';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '10k+', label: 'Live opportunities' },
  { value: '95%', label: 'Resume readiness' },
  { value: '5k+', label: 'Validated employers' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_40%),linear-gradient(135deg,_#020617,_#111827)] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">AI JobPortal</Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/jobs">Jobs</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10"><Link href="/login">Sign in</Link></Button>
            <Button asChild className="rounded-full bg-blue-500 hover:bg-blue-400"><Link href="/register">Get started</Link></Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:py-32">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-300">AI-ready talent platform</p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight sm:text-6xl">Hire smarter with automated job discovery and streamlined applications.</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">Bring employers, candidates, and analytics together in one secure SaaS experience with modern dashboards, role-based access, and real-time job aggregation.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-blue-500 px-6 hover:bg-blue-400"><Link href="/jobs">Explore jobs</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 px-6 text-white hover:bg-white/10"><Link href="/register">Post a job</Link></Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="text-3xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} AI JobPortal. Built for modern hiring teams.
      </footer>
    </div>
  );
}
