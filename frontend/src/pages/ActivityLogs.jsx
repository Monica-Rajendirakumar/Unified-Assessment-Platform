import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  // Since we don't have a real logs endpoint yet, show demo data
  const demoLogs = [
    { ts: 'Mar 30, 09:15:23 AM', user: 'Monica R', role: 'Student', action: 'Login', desc: 'User logged in successfully', ip: '192.168.1.100', status: 'Success' },
    { ts: 'Mar 30, 09:18:45 AM', user: 'Monica R', role: 'Student', action: 'Submitted Assessment', desc: 'Submitted assessment: Introduction to React Fundamentals', ip: '192.168.1.100', status: 'Success' },
    { ts: 'Mar 30, 08:45:12 AM', user: 'Dr. Sarah Johnson', role: 'Instructor', action: 'Created Assessment', desc: 'Created new assessment: UI/UX Design Principles', ip: '192.168.1.105', status: 'Success' },
    { ts: 'Mar 30, 08:30:00 AM', user: 'Admin User', role: 'Admin', action: 'Login', desc: 'Admin logged in successfully', ip: '192.168.1.1', status: 'Success' },
    { ts: 'Mar 29, 07:22:33 AM', user: 'Jane Smith', role: 'Student', action: 'Login', desc: 'User logged in successfully', ip: '192.168.1.102', status: 'Success' },
    { ts: 'Mar 29, 04:45:00 PM', user: 'Dr. Sarah Johnson', role: 'Instructor', action: 'Evaluated Assessment', desc: 'Evaluated submission for: Introduction to React Fundamentals', ip: '192.168.1.105', status: 'Success' },
    { ts: 'Mar 29, 03:30:22 PM', user: 'Admin User', role: 'Admin', action: 'User Created', desc: 'Created new user account: Alex Wilson', ip: '192.168.1.1', status: 'Success' },
    { ts: 'Mar 28, 02:15:00 PM', user: 'Prof. Michael Chen', role: 'Instructor', action: 'Login', desc: 'User logged in successfully', ip: '192.168.1.106', status: 'Success' },
    { ts: 'Mar 28, 12:00:00 PM', user: 'Admin User', role: 'Admin', action: 'Settings Changed', desc: 'Updated platform settings: Assessment time limits', ip: '192.168.1.1', status: 'Success' },
    { ts: 'Mar 27, 06:30:15 PM', user: 'Jane Smith', role: 'Student', action: 'Logout', desc: 'User logged out', ip: '192.168.1.102', status: 'Success' },
    { ts: 'Mar 27, 03:12:00 PM', user: 'Unknown', role: 'Student', action: 'Login', desc: 'Failed login attempt', ip: '192.168.1.200', status: 'Failed' },
  ];

  const actionColor = (action) => {
    if (action === 'Login' || action === 'Logout') return 'bg-gray-900 dark:bg-gray-700 text-white';
    if (action.includes('Submitted') || action.includes('Assessment')) return 'bg-blue-600 text-white';
    if (action.includes('Created') || action.includes('Evaluated')) return 'bg-purple-600 text-white';
    if (action.includes('Settings')) return 'bg-orange-500 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  const roleColor = (role) => {
    if (role === 'Student') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    if (role === 'Instructor') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  const filtered = demoLogs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.desc.toLowerCase().includes(search.toLowerCase())
  );

  const total = demoLogs.length;
  const successful = demoLogs.filter(l => l.status === 'Success').length;
  const failed = demoLogs.filter(l => l.status === 'Failed').length;
  const activeUsers = [...new Set(demoLogs.map(l => l.user))].length;

  return (
    <div className="w-full pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Activity Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">System activity and user action logs</p>
        </div>
        <button className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Events', val: total, icon: <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
          { label: 'Successful', val: successful, icon: <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-green-600' },
          { label: 'Failed', val: failed, icon: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-red-600' },
          { label: 'Active Users', val: activeUsers, icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color || 'text-gray-900 dark:text-white'}`}>{c.val}</p>
            </div>
            {c.icon}
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Filter Logs</h2>
          <p className="text-sm text-gray-500 mb-4">Search and filter activity logs</p>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users or actions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
            </div>
            {['All Roles', 'All Actions', 'All Status'].map(f => (
              <select key={f} className="pl-4 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none text-gray-900 dark:text-white flex-shrink-0">
                <option>{f}</option>
              </select>
            ))}
          </div>
        </div>

        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <p className="text-xs text-gray-500">Showing {filtered.length} of {total} log entries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/70">
              <tr>
                {['Timestamp', 'User', 'Role', 'Action', 'Description', 'IP Address', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{log.ts}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.user}</p>
                  </td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${roleColor(log.role)}`}>{log.role}</span></td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 max-w-[250px]">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{log.desc}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 font-mono">{log.ip}</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center text-xs font-semibold ${log.status === 'Success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {log.status === 'Success'
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        }
                      </svg>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
