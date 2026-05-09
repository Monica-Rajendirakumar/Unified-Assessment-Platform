import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import { useAuth } from '../context/AuthContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessRes, subRes] = await Promise.all([
          apiClient.get('/assessments'),
          apiClient.get('/submissions/all'),
        ]);
        setAssessments(assessRes.data);
        setSubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const evaluatedCount = submissions.filter(s => s.status === 'Evaluated').length;

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Instructor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your assessments and track student progress</p>
        </div>
        <Link
          to="/instructor/create"
          className="flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Assessment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <Link to="/instructor/assessments" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assessments</h3>
            <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : assessments.length}</p>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            Created by you <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </p>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Submissions</h3>
            <span className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : submissions.length}</p>
          <p className="text-xs text-gray-500 mt-2">Across all assessments</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Submissions</h3>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : pendingCount}</p>
          <p className="text-xs text-orange-500 mt-2 font-medium">Need evaluation</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Evaluated</h3>
            <span className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : evaluatedCount}</p>
          <p className="text-xs text-green-500 mt-2 font-medium">Graded & returned</p>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* My Assessments List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Assessments</h2>
              <p className="text-sm text-gray-500">Recently created assessments</p>
            </div>
            <Link to="/instructor/assessments" className="text-sm font-semibold text-blue-600 hover:text-blue-700 group">
              View All <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))
            ) : assessments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                <p className="text-gray-500 font-medium mb-2">No assessments yet</p>
                <Link to="/instructor/create" className="text-sm font-semibold text-blue-600 hover:underline">Create your first assessment →</Link>
              </div>
            ) : assessments.slice(0, 3).map((a) => (
              <div key={a._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center mb-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mr-3">{a.title}</h3>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">Published</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{a.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{a.questions?.length || 0} questions</span>
                      <span>•</span>
                      <span>{a.duration} minutes</span>
                      <span>•</span>
                      <span className="capitalize">{a.type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 shrink-0">
                    <Link
                      to={`/instructor/edit/${a._id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 dark:border-blue-800 px-4 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <Link
                      to="/instructor/assessments"
                      className="text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions Sidebar */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
                <p className="text-xs text-gray-500">Latest student submissions</p>
              </div>
              <Link to="/instructor/submissions" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="p-5 space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>)}
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No submissions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{sub.student?.name || 'Student'}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        sub.status === 'Evaluated'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 truncate">{sub.assessment?.title}</p>
                    {sub.status === 'Evaluated' ? (
                      <p className="text-xs text-green-600 font-semibold">Score: {sub.score}/{sub.totalMarks}</p>
                    ) : (
                      <button onClick={() => navigate('/instructor/submissions')} className="text-xs font-semibold text-blue-600 hover:underline">
                        Evaluate Now →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;
