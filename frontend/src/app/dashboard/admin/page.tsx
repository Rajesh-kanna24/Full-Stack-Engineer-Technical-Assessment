'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-32 rounded-3xl bg-white/10" /><div className="h-64 rounded-3xl bg-white/10" /></div>;
  }

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard title="Companies" value={stats?.totalCompanies ?? 0} />
        <StatCard title="Active Jobs" value={stats?.totalJobs ?? 0} />
        <StatCard title="Applications" value={stats?.applications ?? 0} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="mt-4 space-y-3">
          {(stats?.recentActivity || []).map((item: any) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
              <div>
                <p className="font-medium">{item.candidate?.name} applied to {item.job?.title}</p>
                <p className="text-sm text-slate-400">{item.job?.company?.name || 'Company'}</p>
              </div>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
      <h4 className="text-sm font-medium text-slate-400">{title}</h4>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
