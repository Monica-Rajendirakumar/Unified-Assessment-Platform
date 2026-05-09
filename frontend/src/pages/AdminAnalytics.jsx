import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    users: [],
    assessments: 0,
    submissions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const totalUsers = stats.users.reduce((sum, u) => sum + u.count, 0);
  const evaluatedSubmissions = stats.submissions.find(s => s._id === 'Evaluated');
  const globalAvg = evaluatedSubmissions ? Math.round(evaluatedSubmissions.avgScore * 100) : 0;

  const StatCard = ({ title, val, icon, color, description }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className={`p-3 rounded-2xl ${color}`}>{icon}</span>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</span>
        </div>
        <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">{loading ? '—' : val}</p>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );

  return (
    <div className="w-full pb-12 animate-in slide-in-from-bottom duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Platform Command Center</h1>
          <p className="text-gray-500 dark:text-gray-400">Holistic overview of the Unified Assessment Platform ecosystem</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20">Generate PDF Report</button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm">Download Logs</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Citizens" val={totalUsers} description="Active Students, Instructors, & Admins" color="bg-blue-50 text-blue-600 dark:bg-blue-900/30"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
        
        <StatCard title="Live Assessments" val={stats.assessments} description="Challenges currently available" color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />

        <StatCard title="Global Success" val={`${globalAvg}%`} description="Platform-wide performance average" color="bg-amber-50 text-amber-600 dark:bg-amber-900/30"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />

        <StatCard title="Total Submissions" val={stats.submissions.reduce((sum, s) => sum + s.count, 0)} description="Evaluated & Pending responses" color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Role Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700">
           <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">User Demographics</h2>
           <p className="text-sm text-gray-500 mb-8">Distribution of roles across the platform</p>
           
           <div className="space-y-8">
             {stats.users.map((role, idx) => (
                <div key={idx} className="group cursor-default">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter block mb-0.5">Role Type</span>
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{role._id}</span>
                    </div>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{role.count}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${role._id === 'Student' ? 'bg-blue-600' : role._id === 'Instructor' ? 'bg-emerald-500' : 'bg-red-500'}`} 
                      style={{ width: `${(role.count / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
             ))}
           </div>
        </div>

        {/* System Activity & Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700">
           <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Submission Maturity</h2>
           <p className="text-sm text-gray-500 mb-8">Status of grading workflows across all departments</p>
           
           <div className="relative h-64 flex items-end justify-between px-4 pb-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl pt-8 border border-gray-100 dark:border-transparent">
             {stats.submissions.map((group, idx) => (
               <div key={idx} className="flex flex-col items-center w-full max-w-[120px] group">
                 <div className="mb-4 relative w-full flex justify-center">
                   <span className="absolute -top-8 text-xs font-black text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     {group.count}
                   </span>
                   <div 
                     className={`w-12 sm:w-16 rounded-t-2xl transition-all duration-1000 shadow-lg ${group._id === 'Evaluated' ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-gradient-to-t from-blue-600 to-blue-400'}`}
                     style={{ height: `${Math.max((group.count / stats.submissions.reduce((s, g) => s + g.count, 0)) * 180, 20)}px` }}
                   ></div>
                 </div>
                 <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter text-center">{group._id}</span>
               </div>
             ))}
             {!loading && stats.submissions.length === 0 && <p className="absolute inset-x-0 bottom-1/2 text-center text-gray-400 italic">No activity yet</p>}
           </div>

           <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-2xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Platform Insight</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Evaluating pending submissions could improve platform-wide success visibility by 12%.</p>
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
