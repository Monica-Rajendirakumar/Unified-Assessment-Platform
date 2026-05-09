import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const StudentAnalytics = () => {
  const [stats, setStats] = useState({
    totalTaken: 0,
    avgScore: 0,
    pending: 0,
    subjectStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/submissions/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch student stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Logical helper to identify weaknesses
  const weaknesses = stats.subjectStats
    .filter(s => s.avgScore < 70)
    .sort((a, b) => a.avgScore - b.avgScore);

  const improvements = weaknesses.map(w => {
    if (w.avgScore < 40) return { subject: w.subject, tip: 'Immediate review required. Focus on fundamentals.', priority: 'High' };
    if (w.avgScore < 60) return { subject: w.subject, tip: 'Consistent practice needed. Re-take similar mock tests.', priority: 'Medium' };
    return { subject: w.subject, tip: 'Minor refinements needed in specific sub-topics.', priority: 'Low' };
  });

  const StatCard = ({ title, val, icon, color, subtitle }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <span className={`p-2.5 rounded-xl ${color} shadow-sm`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : val}</p>
    </div>
  );

  return (
    <div className="w-full pb-12 animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Performance Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Personalized insights to help you excel in your studies</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Overall Average" val={`${stats.avgScore}%`} subtitle="Vs 65% Class Avg" color="bg-blue-50 text-blue-600 dark:bg-blue-900/30"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
        
        <StatCard title="Tests Completed" val={stats.totalTaken} subtitle={`${stats.pending} Pending Evaluation`} color="bg-teal-50 text-teal-600 dark:bg-teal-900/30"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
        
        <StatCard title="Learning Consistency" val="High" subtitle="8 Assessments this month" color="bg-purple-50 text-purple-600 dark:bg-purple-900/30"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Subject Breakdown Charts */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subject Proficiency</h2>
           <div className="space-y-6">
             {loading ? (
               [1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 dark:bg-gray-700 animate-pulse rounded-xl"></div>)
             ) : stats.subjectStats.length === 0 ? (
               <p className="text-gray-500 italic py-8">Complete more assessments to view breakdown</p>
             ) : stats.subjectStats.map((s, idx) => (
               <div key={idx} className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                   <span>{s.subject}</span>
                   <span className={s.avgScore >= 75 ? 'text-green-600' : s.avgScore >= 50 ? 'text-blue-600' : 'text-red-500'}>
                     {s.avgScore}%
                   </span>
                 </div>
                 <div className="w-full h-2.5 bg-gray-50 dark:bg-gray-700 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${s.avgScore >= 75 ? 'bg-green-500' : s.avgScore >= 50 ? 'bg-blue-500' : 'bg-red-500'}`} 
                     style={{ width: `${Math.max(s.avgScore, 5)}%` }}
                   ></div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Improvement & Weakness Analysis */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Weakness Analysis
            </h2>
            {improvements.length === 0 ? (
              <div className="py-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-2xl inline-block">
                  <p className="font-bold">No significant weaknesses detected!</p>
                  <p className="text-sm">You are performing consistently above 70% in all subjects.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {improvements.map((item, id) => (
                  <div key={id} className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{item.subject}</span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${item.priority === 'High' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'}`}>
                        {item.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 shadow-xl text-white">
            <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
            <p className="text-indigo-100 mb-6 text-sm">Based on your current trajectory, we recommend these personalized study paths.</p>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-left px-4 flex items-center justify-between group">
                <span className="font-semibold text-sm">Logic & Algorithms Bootcamp</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-left px-4 flex items-center justify-between group">
                <span className="font-semibold text-sm">Subject: {weaknesses[0]?.subject || 'Modern Stack'} Concepts</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAnalytics;
