import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';

const InstructorAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) return;
    try {
      await apiClient.delete(`/assessments/${id}`);
      setAssessments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete assessment');
    }
  };

  useEffect(() => {
    apiClient.get('/assessments').then(r => setAssessments(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Assessments</h1>
          <p className="text-gray-500 dark:text-gray-400">{assessments.length} assessment{assessments.length !== 1 ? 's' : ''} published</p>
        </div>
        <Link to="/instructor/create"
          className="flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Assessment
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 animate-pulse" />)}
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 border border-dashed border-gray-300 dark:border-gray-600 text-center">
          <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
          <p className="text-gray-500 text-lg font-semibold mb-2">No assessments yet</p>
          <p className="text-gray-400 text-sm mb-6">Create your first assessment to get started</p>
          <Link to="/instructor/create" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
            Create Assessment
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {['Title', 'Subject', 'Type', 'Questions', 'Duration', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {assessments.map(a => (
                  <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{a.subject}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-lg">{a.type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{a.questions?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{a.duration} min</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">Published</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Link to={`/instructor/edit/${a._id}`} 
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(a._id)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-lg transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssessments;
