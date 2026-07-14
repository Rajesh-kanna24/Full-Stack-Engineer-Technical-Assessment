'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to view your profile');
          setLoading(false);
          return;
        }

        const res = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.data);
        setForm({ name: res.data.data.name || '', bio: res.data.data.bio || '' });
      } catch (err: any) {
        console.error(err);
        setMessage(err.response?.data?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to update your profile');
        return;
      }

      const res = await api.put('/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
      setMessage('Profile updated successfully');
      localStorage.setItem('userName', form.name);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Unable to update profile');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading profile…</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="mt-2 text-slate-400">Keep your professional profile up to date.</p>
        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3" />
          </div>
          <Button onClick={saveProfile} className="rounded-full bg-emerald-500 px-5 hover:bg-emerald-400">Save profile</Button>
        </div>
      </div>
    </div>
  );
}
