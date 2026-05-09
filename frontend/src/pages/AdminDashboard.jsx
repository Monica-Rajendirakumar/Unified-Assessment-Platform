import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/admin/users'),
      apiClient.get('/assessments'),
      apiClient.get('/admin/submissions'),
    ]).then(([u, a, s]) => {
      setUsers(u.data);
      setAssessments(a.data);
      setSubmissions(s.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const students = Array.isArray(users) ? users.filter(u => u.role === 'Student') : [];
  const instructors = Array.isArray(users) ? users.filter(u => u.role === 'Instructor') : [];
  const recentUsers = Array.isArray(users) 
    ? [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) 
    : [];

  const roleColor = (role) => {
    if (role === 'Student') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    if (role === 'Instructor') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-blue-500 font-medium">Platform overview and management</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Students', value: loading ? '—' : students.length, sub: `+${Math.max(0, students.length - 1)} this month`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
          { label: 'Total Instructors', value: loading ? '—' : instructors.length, sub: `+${Math.max(0, instructors.length)} this month`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/30',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
          { label: 'Total Assessments', value: loading ? '—' : assessments.length, sub: `${assessments.length} published this week`, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
          { label: 'Platform Activity', value: '98.5%', sub: 'System uptime', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</h3>
              <span className={`p-2 ${card.bg} ${card.color} rounded-lg`}>{card.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
            <p className={`text-xs font-medium ${card.color}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Registrations */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent User Registrations</h2>
                <p className="text-sm text-gray-500">Newly registered users on the platform</p>
              </div>
              <Link to="/admin/users" className="text-sm font-semibold text-blue-600 hover:underline">View All →</Link>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/70">
                    <tr>
                      {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentUsers.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold mr-3">{u.name?.charAt(0)}</div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-blue-600 dark:text-blue-400">{u.email}</td>
                        <td className="px-6 py-3"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${roleColor(u.role)}`}>{u.role}</span></td>
                        <td className="px-6 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">active</span></td>
                        <td className="px-6 py-3 text-sm font-semibold text-blue-600 hover:underline cursor-pointer">Edit</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Quick Statistics</h2>
            <p className="text-sm text-gray-500 mb-6">Platform metrics at a glance</p>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '—' : students.length + instructors.length}</p>
                </div>
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Completed Tests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '—' : submissions.length}</p>
                </div>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Array.isArray(submissions) && submissions.filter(s => s.status === 'Evaluated' && s.totalMarks > 0).length > 0
                      ? `${Math.round(
                          submissions
                            .filter(s => s.status === 'Evaluated' && s.totalMarks > 0)
                            .reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / 
                          submissions.filter(s => s.status === 'Evaluated' && s.totalMarks > 0).length
                        )}%`
                      : '—'}
                  </p>
                </div>
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
