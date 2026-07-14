'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Temporary mock data since we aren't hooking up the real auth token in this UI yet
      return {
        totalUsers: 1250,
        totalCompanies: 85,
        totalJobs: 340,
        applications: 4500,
        jobsScrapedToday: 120
      };
      // const res = await api.get('/dashboard');
      // return res.data.data;
    }
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <StatCard title="Total Users" value={data?.totalUsers ?? 0} />
       <StatCard title="Companies" value={data?.totalCompanies ?? 0} />
       <StatCard title="Active Jobs" value={data?.totalJobs ?? 0} />
       <StatCard title="Applications" value={data?.applications ?? 0} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <p className="text-gray-500 dark:text-gray-400">Activity charts and graphs will go here.</p>
        <div className="h-64 mt-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400">
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    </div>
  );
}
