'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function JobDetailsPage() {
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/jobs/${params.id}`);
        setJob(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading…</div>;
  }

  if (!job) {
    return <div className="min-h-screen bg-slate-950 p-8 text-white">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/70 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/jobs" className="text-lg font-semibold">← Back to jobs</Link>
          <Button asChild size="sm" className="rounded-full"><Link href="/login">Apply now</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300">{job.company?.name}</p>
          <h1 className="mt-2 text-4xl font-semibold">{job.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
            <span className="rounded-full bg-slate-800 px-3 py-1">{job.location}</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">{job.workMode}</span>
            <span className="rounded-full bg-slate-800 px-3 py-1">{job.employmentType}</span>
          </div>
          <p className="mt-8 text-lg leading-8 text-slate-200">{job.description}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Required skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">{job.skills?.map((skill: string) => <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-sm">{skill}</span>)}</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Job details</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li><strong>Salary:</strong> {job.salary || 'Negotiable'}</li>
                <li><strong>Experience:</strong> {job.experience || 'Flexible'}</li>
                <li><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open until filled'}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
