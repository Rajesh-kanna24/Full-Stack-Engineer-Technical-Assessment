'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=12');
        setJobs(res.data.data.jobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const filtered = jobs.filter((job) => `${job.title} ${job.description}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">AI JobPortal</Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/jobs">Jobs</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Discover opportunities</p>
            <h1 className="text-3xl font-semibold">Find the right role for your next move</h1>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none md:w-80" />
        </div>
        {loading ? <div className="grid gap-6 md:grid-cols-2">{Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />)}</div> : null}
        {!loading && filtered.length === 0 ? <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center text-slate-300">No jobs match your search yet.</div> : null}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((job) => (
            <article key={job.id} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-300">{job.company?.name || 'Company'}</p>
                  <h2 className="mt-1 text-xl font-semibold">{job.title}</h2>
                </div>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{job.workMode}</span>
              </div>
              <p className="mt-4 text-sm text-slate-300">{job.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {job.skills?.slice(0, 3).map((skill: string) => <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">{skill}</span>)}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-400">{job.location}</div>
                <Button asChild size="sm" className="rounded-full">
                  <Link href={`/jobs/${job.id}`}>View details</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
