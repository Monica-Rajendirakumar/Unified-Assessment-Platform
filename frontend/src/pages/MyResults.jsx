import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const MyResults = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await apiClient.get('/submissions/my');
        setSubmissions(data);
      } catch (err) {
        setError('Failed to load your results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // Calculate stats from real data
  const evaluated = submissions.filter(s => s.status === 'Evaluated');
  const avgScore = evaluated.length > 0
    ? Math.round(evaluated.reduce((sum, s) => sum + (s.score / s.totalMarks) * 100, 0) / evaluated.length)
    : 0;
  const best = evaluated.length > 0
    ? evaluated.reduce((best, s) => (s.score / s.totalMarks) > (best.score / best.totalMarks) ? s : best, evaluated[0])
    : null;

  const gradeLabel = (score, total) => {
    if (!score || !total) return '-';
    const pct = (score / total) * 100;
    if (pct >= 90) return { label: 'A', color: 'text-green-600' };
    if (pct >= 80) return { label: 'B', color: 'text-blue-600' };
    if (pct >= 70) return { label: 'C', color: 'text-yellow-600' };
    if (pct >= 60) return { label: 'D', color: 'text-orange-500' };
    return { label: 'F', color: 'text-red-600' };
  };

  return (
    <div className="w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Results</h1>
        <p className="text-gray-500 dark:text-gray-400">View your assessment scores and performance</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</h3>
            <span className="text-yellow-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{evaluated.length > 0 ? `${avgScore}%` : '—'}</p>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gray-900 dark:bg-gray-100 h-2 rounded-full transition-all" style={{ width: `${avgScore}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Performance</h3>
            <span className="text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {best ? `${Math.round((best.score / best.totalMarks) * 100)}%` : '—'}
          </p>
          <p className="text-xs font-semibold text-gray-500 truncate">{best ? best.assessment?.title : 'No evaluated results yet'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Submissions</h3>
            <span className="text-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{submissions.length}</p>
          <p className="text-xs font-semibold text-gray-500">{submissions.filter(s => s.status === 'Pending').length} pending evaluation</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 mb-6 text-sm font-medium">{error}</div>
      )}

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assessment History</h2>
            <p className="text-sm text-gray-500">Your completed and pending assessments</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No submissions yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Complete an assessment to see your results here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">Assessment</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">Subject</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">Submitted</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">Score</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {submissions.map((submission) => {
                  const grade = submission.status === 'Evaluated' ? gradeLabel(submission.score, submission.totalMarks) : null;
                  return (
                    <tr key={submission._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{submission.assessment?.title || 'Unknown'}</span>
                        {submission.feedback && (
                          <p className="text-xs text-gray-400 mt-0.5 italic">"{submission.feedback}"</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{submission.assessment?.subject || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(submission.submittedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {submission.status === 'Evaluated' ? `${submission.score}/${submission.totalMarks}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'Evaluated'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${grade ? grade.color : 'text-gray-400'}`}>
                        {grade ? grade.label : '—'}
                      </td>
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

export default MyResults;
