'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', res.data.data.tokens.refreshToken);
      localStorage.setItem('role', res.data.data.user.role);
      localStorage.setItem('userName', res.data.data.user.name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Join the platform</p>
          <h1 className="mt-2 text-3xl font-semibold">Create your account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none">
              <option value="CANDIDATE">Candidate</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
        </form>
        <p className="mt-6 text-sm text-slate-400">Already have an account? <Link href="/login" className="text-blue-300">Sign in</Link></p>
      </div>
    </div>
  );
}
