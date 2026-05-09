import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  useEffect(() => {
    apiClient.get('/admin/users').then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const students = users.filter(u => u.role === 'Student').length;
  const instructors = users.filter(u => u.role === 'Instructor').length;
  const admins = users.filter(u => u.role === 'Admin').length;

  const roleColor = (role) => {
    if (role === 'Student') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    if (role === 'Instructor') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };

  return (
    <div className="w-full pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage platform users and permissions</p>
        </div>
        <button className="flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', val: users.length, icon: '👥', color: 'text-gray-900 dark:text-white' },
          { label: 'Students', val: students, initial: 'S', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-700 dark:text-blue-400' },
          { label: 'Instructors', val: instructors, initial: 'I', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-700 dark:text-purple-400' },
          { label: 'Admins', val: admins, initial: 'A', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-700 dark:text-red-400' },
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '—' : c.val}</p>
            </div>
            {c.initial ? (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${c.bg} ${c.color}`}>{c.initial}</div>
            ) : (
              <span className="text-2xl">{c.icon}</span>
            )}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">All Users</h2>
          <p className="text-sm text-gray-500 mb-4">Search and filter users</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
              {['All Roles', 'Student', 'Instructor', 'Admin'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((u, i) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold mr-3">{u.name?.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-400">ID: usr-{i + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400">{u.email}</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${roleColor(u.role)}`}>{u.role}</span></td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">active</span></td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
