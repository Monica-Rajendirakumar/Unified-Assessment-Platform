import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const AllAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data } = await apiClient.get('/assessments');
        setAssessments(data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(search.toLowerCase()) ||
    assessment.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">All Assessments</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage all assessments on the platform.</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or subject..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden text-sm sm:text-base">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-gray-500 font-medium">No assessments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {['Title', 'Subject', 'Type', 'Questions', 'Duration', 'Instructor', 'Action'].map(header => (
                    <th key={header} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredAssessments.map(assessment => (
                  <tr key={assessment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{assessment.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{assessment.subject}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg uppercase">{assessment.type}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{assessment.questions?.length || 0}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{assessment.duration} min</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{assessment.instructor?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">View</button>
                        <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors">Delete</button>
                      </div>
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

export default AllAssessments;
