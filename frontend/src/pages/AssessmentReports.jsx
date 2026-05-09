import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const AssessmentReports = () => {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/assessments'),
      apiClient.get('/admin/submissions'),
    ]).then(([a, s]) => {
      setAssessments(a.data);
      setSubmissions(s.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = assessments.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.subject?.toLowerCase().includes(search.toLowerCase()) ||
    a.instructor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getSubStats = (assessmentId) => {
    const subs = submissions.filter(s => s.assessment?._id === assessmentId || s.assessment === assessmentId);
    const evaluated = subs.filter(s => s.status === 'Evaluated');
    const avg = evaluated.length > 0
      ? Math.round(evaluated.reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / evaluated.length)
      : null;
    return { total: subs.length, pending: subs.filter(s => s.status === 'Pending').length, avg };
  };

  const totalSubs = submissions.length;
  const evaluated = submissions.filter(s => s.status === 'Evaluated');
  const platformAvg = evaluated.length > 0
    ? Math.round(evaluated.reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / evaluated.length)
    : 0;
  const completionRate = totalSubs > 0
    ? Math.round((evaluated.length / totalSubs) * 100)
    : 0;

  return (
    <div className="w-full pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Assessment Reports</h1>
          <p className="text-gray-500 dark:text-gray-400">Comprehensive reports for all assessments</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Assessments', val: loading ? '—' : assessments.length },
          { label: 'Total Submissions', val: loading ? '—' : totalSubs },
          { label: 'Average Score', val: loading ? '—' : platformAvg > 0 ? `${platformAvg}%` : '—', color: 'text-green-600' },
          { label: 'Completion Rate', val: loading ? '—' : `${completionRate}%` },
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{c.label}</p>
            <p className={`text-3xl font-bold ${c.color || 'text-gray-900 dark:text-white'}`}>{c.val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Assessment Reports</h2>
          <p className="text-sm text-gray-500 mb-4">Search and filter assessment reports</p>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search assessments or instructors..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
            </div>
            <select className="pl-4 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none text-gray-900 dark:text-white">
              <option>All Subjects</option>
            </select>
            <select className="pl-4 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none text-gray-900 dark:text-white">
              <option>Date Created</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> of {assessments.length} reports</p>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {['Assessment', 'Subject', 'Instructor', 'Submissions', 'Pending', 'Avg Score', 'Completion', 'Created', 'Last Activity'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">No assessments found</td></tr>
                ) : filtered.map(a => {
                  const stats = getSubStats(a._id);
                  const completion = stats.total > 0 ? Math.round(((stats.total - stats.pending) / stats.total) * 100) : 0;
                  return (
                    <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white max-w-[180px] truncate">{a.title}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{a.subject}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{a.instructor?.name || '—'}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{stats.total}</td>
                      <td className="px-5 py-4">
                        {stats.pending > 0
                          ? <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">{stats.pending}</span>
                          : <span className="text-xs text-gray-400">0</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        {stats.avg !== null
                          ? <span className="text-sm font-bold text-green-600">{stats.avg}%</span>
                          : <span className="text-sm text-gray-400">—</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 min-w-[60px]">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${completion}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{completion}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(a.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentReports;
