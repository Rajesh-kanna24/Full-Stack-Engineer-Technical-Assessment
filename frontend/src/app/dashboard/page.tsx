'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

const emptyForm = {
  title: '',
  companyName: '',
  location: '',
  employmentType: 'FULL_TIME',
  workMode: 'REMOTE',
  salary: '',
  experience: '',
  skills: '',
  benefits: '',
  description: '',
  deadline: '',
};

export default function DashboardPage() {
  const [role, setRole] = useState<string>('CANDIDATE');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentRole = localStorage.getItem('role') || 'CANDIDATE';
        setRole(currentRole);
        setName(localStorage.getItem('userName') || 'there');

        if (!token) {
          window.location.href = '/login';
          return;
        }

        const [profileRes, jobsRes, applicationsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/jobs?limit=50'),
          api.get('/applications'),
        ]);

        setName(profileRes.data.data.name || localStorage.getItem('userName') || 'there');
        const allJobs = jobsRes.data.data.jobs || [];
        const filteredJobs = currentRole === 'EMPLOYER'
          ? allJobs.filter((job: any) => job.employerId === profileRes.data.data.id)
          : allJobs;
        setJobs(filteredJobs);
        setApplications(applicationsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const payload = {
        ...form,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        benefits: form.benefits.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.post('/jobs', payload);
      setJobs((current) => [res.data.data, ...current]);
      setForm(emptyForm);
      setMessage('Job posted successfully');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Unable to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      await api.post(`/jobs/${jobId}/apply`, { coverLetter: 'Interested in this opportunity.' });
      setMessage('Application submitted');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Unable to apply right now');
    }
  };

  const handleReview = async (applicationId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await api.patch(`/applications/${applicationId}/status`, { status });
      setApplications((current) => current.map((application) => application.id === applicationId ? res.data.data : application));
      setMessage('Application status updated');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Unable to review application');
    }
  };

  const summary = useMemo(() => ({
    postedJobs: jobs.length,
    applicationsReceived: applications.length,
    openJobs: jobs.filter((job) => job.status === 'OPEN').length,
  }), [jobs, applications]);

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-white">Loading your dashboard…</div>;
  }

  if (role === 'EMPLOYER') {
    return (
      <div className="space-y-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Employer workspace</p>
              <h2 className="text-2xl font-semibold">Welcome back, {name}</h2>
            </div>
            <Button className="rounded-full bg-emerald-500 px-5 hover:bg-emerald-400">Post a job</Button>
          </div>
          {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold">Post a new job</h3>
            <form onSubmit={handlePostJob} className="mt-4 grid gap-3 md:grid-cols-2">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Job title" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" required />
              <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Company name" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" required />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" required />
              <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
              <select value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
              <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Salary" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
              <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Experience" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Skills (comma separated)" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
              <input value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Benefits (comma separated)" className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 min-h-24 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" required />
              <div className="md:col-span-2">
                <Button type="submit" disabled={submitting} className="rounded-full bg-emerald-500 px-5 hover:bg-emerald-400">{submitting ? 'Posting…' : 'Publish job'}</Button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold">Overview</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-slate-900/60 p-4"><p className="text-sm text-slate-400">Jobs posted</p><p className="text-2xl font-semibold">{summary.postedJobs}</p></div>
              <div className="rounded-2xl bg-slate-900/60 p-4"><p className="text-sm text-slate-400">Applications</p><p className="text-2xl font-semibold">{summary.applicationsReceived}</p></div>
              <div className="rounded-2xl bg-slate-900/60 p-4"><p className="text-sm text-slate-400">Open jobs</p><p className="text-2xl font-semibold">{summary.openJobs}</p></div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold">Your posted jobs</h3>
          <div className="mt-4 space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-2xl bg-slate-900/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-slate-400">{job.company?.name || 'Company'}</p>
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold">Review applications</h3>
          <div className="mt-4 space-y-3">
            {applications.map((application) => (
              <div key={application.id} className="rounded-2xl bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{application.candidate?.name || 'Candidate'}</p>
                    <p className="text-sm text-slate-400">{application.job?.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['PENDING', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED'].map((state) => (
                      <button key={state} onClick={() => handleReview(application.id, state)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">{state}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
        <p className="text-sm text-slate-400">Candidate workspace</p>
        <h2 className="text-2xl font-semibold">Hi {name}, discover jobs from trusted employers</h2>
        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-blue-300">{job.company?.name || 'Company'}</p>
                <h3 className="mt-1 text-xl font-semibold">{job.title}</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">{job.workMode}</span>
            </div>
            <p className="mt-4 text-sm text-slate-300">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills?.slice(0, 4).map((skill: string) => <span key={skill} className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-200">{skill}</span>)}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-400">{job.location}</div>
              <Button onClick={() => handleApply(job.id)} className="rounded-full bg-blue-500 px-4 hover:bg-blue-400">Apply</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Link href="/jobs" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">Browse all jobs</Link>
        <Link href="/profile" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white">Edit profile</Link>
      </div>
    </div>
  );
}
