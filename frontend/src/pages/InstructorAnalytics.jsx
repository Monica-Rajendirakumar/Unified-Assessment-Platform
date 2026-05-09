import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const InstructorAnalytics = () => {
  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalSubmissions: 0,
    avgScore: 0,
    submissionTrend: [12, 18, 25, 14, 22, 30, 20], // Mock for now
    performanceDistribution: [
      { range: '90-100%', count: 12 },
      { range: '80-89%', count: 28 },
      { range: '70-79%', count: 35 },
      { range: '60-69%', count: 15 },
      { range: '< 60%', count: 10 },
    ], // Mock for now
  });
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessRes, subRes] = await Promise.all([
          apiClient.get('/assessments'),
          apiClient.get('/submissions/all'),
        ]);

        const allAssessments = assessRes.data;
        const allSubmissions = subRes.data;
        
        const evaluatedSubmissions = allSubmissions.filter(s => s.status === 'Evaluated');
        
        const avg = evaluatedSubmissions.length > 0 
          ? Math.round(evaluatedSubmissions.reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / evaluatedSubmissions.length)
          : 0;

        // Process data for the table
        const assessData = allAssessments.map(a => {
          const subs = allSubmissions.filter(s => s.assessment._id === a._id);
          const evals = subs.filter(s => s.status === 'Evaluated');
          const aAvg = evals.length > 0 
            ? Math.round(evals.reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / evals.length)
            : 0;
          return { ...a, subCount: subs.length, avgScore: aAvg };
        });

        setStats(prev => ({
          ...prev,
          totalAssessments: allAssessments.length,
          totalSubmissions: allSubmissions.length,
          avgScore: avg
        }));
        setAssessments(assessData.sort((a, b) => b.subCount - a.subCount));

      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, val, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</h3>
        <span className={`p-2.5 rounded-xl ${color} shadow-sm`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : val}</p>
    </div>
  );

  return (
    <div className="w-full pb-12 animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Instructor Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive performance metrics across all your assessments</p>
      </div>

      {/* Grid for Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Assessments" val={stats.totalAssessments} color="bg-blue-50 text-blue-600 dark:bg-blue-900/30"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
        
        <StatCard title="Total Submissions" val={stats.totalSubmissions} color="bg-teal-50 text-teal-600 dark:bg-teal-900/30"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        
        <StatCard title="Average Success" val={`${stats.avgScore}%`} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Visual Charts: Performance Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h2 className="text-xl font-bold text-gray-900 dark:text-white">Score Distribution</h2>
               <p className="text-sm text-gray-500">Student performance across all tests</p>
             </div>
           </div>
           
           <div className="space-y-6">
             {stats.performanceDistribution.map((item, idx) => (
               <div key={idx} className="space-y-2">
                 <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-tight">
                   <span>{item.range}</span>
                   <span className="text-gray-900 dark:text-white">{item.count} students</span>
                 </div>
                 <div className="w-full h-3 bg-gray-50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${(item.count / 100) * 100}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Top Assessment Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Popular Assessments</h2>
            <p className="text-sm text-gray-500">Ranked by participation and success rates</p>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Assessment</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase text-center">Submissions</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase text-right">Avg Score</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {loading ? (
                    [1,2,3,4].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-5 h-16 bg-gray-50/30 dark:bg-gray-700/10"></td>
                        <td className="px-8 py-5 h-16 bg-gray-50/10 dark:bg-gray-700/5"></td>
                        <td className="px-8 py-5 h-16 bg-gray-50/30 dark:bg-gray-700/10"></td>
                      </tr>
                    ))
                  ) : assessments.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 italic">No data available for ranking</td>
                    </tr>
                  ) : assessments.slice(0, 5).map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{a.title}</p>
                        <p className="text-xs text-gray-500">{a.subject}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{a.subCount}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <span className={`text-sm font-bold ${a.avgScore >= 80 ? 'text-teal-600' : a.avgScore >= 50 ? 'text-blue-600' : 'text-orange-500'}`}>
                           {a.avgScore}%
                         </span>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 text-center">
             <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Download Detailed Report (.csv)</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorAnalytics;
