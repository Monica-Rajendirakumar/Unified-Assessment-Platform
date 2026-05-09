import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({ totalTaken: 0, avgScore: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessRes, statsRes] = await Promise.all([
          apiClient.get('/assessments'),
          apiClient.get('/submissions/stats'),
        ]);
        setAssessments(assessRes.data.slice(0, 2)); // Show only 2 on dashboard
        setStats(statsRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Student'}</span>! Here's your learning progress.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assessments Taken</h3>
            <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : stats.totalTaken}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total submissions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</h3>
            <span className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : stats.avgScore > 0 ? `${stats.avgScore}%` : '—'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">From evaluated results</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Evaluations</h3>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : stats.pending}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Awaiting results</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Tests</h3>
            <span className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : assessments.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ready to attempt</p>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Available Assessments</h2>
              <p className="text-sm text-gray-500">Start a new assessment</p>
            </div>
            <Link to="/assessments" className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 group">
              View All <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))
            ) : assessments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-500">No assessments available yet.</p>
                <p className="text-xs text-gray-400 mt-1">Run the seed script to populate sample data.</p>
              </div>
            ) : assessments.map((assessment) => (
              <div key={assessment._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center transition-shadow hover:shadow-md">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{assessment.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 mt-1">{assessment.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {assessment.instructor?.name}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {assessment.duration} minutes
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-medium">{assessment.subject}</span>
                  </div>
                </div>
                <Link
                  to={`/assessment/${assessment._id}`}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shrink-0 ml-4"
                >
                  Start
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Stats</h2>
            <p className="text-sm text-gray-500 mb-6">Your progress at a glance</p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.totalTaken}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Evaluated</span>
                <span className="text-sm font-bold text-green-600">{stats.totalTaken - stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Results</span>
                <span className="text-sm font-bold text-orange-500">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</span>
                <span className="text-sm font-bold text-blue-600">{stats.avgScore > 0 ? `${stats.avgScore}%` : '—'}</span>
              </div>
            </div>

            <Link to="/results" className="block w-full py-2.5 mt-8 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View All Results →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
