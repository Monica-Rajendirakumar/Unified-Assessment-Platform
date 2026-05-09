import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';

const SubmissionsInbox = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [grading, setGrading] = useState(null); // the submission being graded
  const [scoreInput, setScoreInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const fetchSubmissions = async () => {
    try {
      const { data } = await apiClient.get('/submissions/all');
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const filtered = filter === 'All' ? submissions : submissions.filter(s => s.status === filter);

  const openGrading = (sub) => {
    setGrading(sub);
    setScoreInput(sub.score ?? '');
    setFeedbackInput(sub.feedback ?? '');
  };

  const submitGrade = async () => {
    if (scoreInput === '' || isNaN(Number(scoreInput))) return;
    setSaving(true);
    try {
      await apiClient.patch(`/submissions/${grading._id}/grade`, {
        score: Number(scoreInput),
        feedback: feedbackInput,
      });
      setToast('Grade submitted successfully!');
      setGrading(null);
      fetchSubmissions();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-pulse">
          ✓ {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Submissions Inbox</h1>
        <p className="text-gray-500 dark:text-gray-400">Evaluate student submissions and assign scores</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['All', 'Pending', 'Evaluated'].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              filter === tab
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}>
            {tab}
            {tab !== 'All' && (
              <span className="ml-2 text-xs bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full">
                {submissions.filter(s => s.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
            <p className="text-gray-500 font-medium">No {filter !== 'All' ? filter.toLowerCase() : ''} submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {['Student', 'Assessment', 'Submitted', 'Score', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(sub => (
                  <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                          {sub.student?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{sub.student?.name || 'Student'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[180px] truncate">{sub.assessment?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {sub.status === 'Evaluated' ? `${sub.score}/${sub.totalMarks}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'Evaluated'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => openGrading(sub)}
                        className={`text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors ${
                          sub.status === 'Pending'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}>
                        {sub.status === 'Pending' ? 'Grade Now' : 'Re-grade'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grading Side Modal */}
      {grading && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Grade Submission</h2>
              <button onClick={() => setGrading(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 flex-1">
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{grading.student?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{grading.assessment?.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">Submitted: {new Date(grading.submittedAt).toLocaleDateString()}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Student's Answers</h3>
                {grading.answers?.length > 0 ? grading.answers.map((ans, i) => (
                  <div key={i} className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Question {i + 1}</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{ans.answer || <em className="text-gray-400">No answer provided</em>}</p>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400">No answers recorded.</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Score <span className="text-gray-400 font-normal">/ {grading.totalMarks}</span>
                  </label>
                  <input type="number" min={0} max={grading.totalMarks} value={scoreInput}
                    onChange={e => setScoreInput(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Feedback (optional)</label>
                  <textarea rows={4} value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)}
                    placeholder="Write feedback for the student..."
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button onClick={submitGrade} disabled={saving || scoreInput === ''}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center">
                {saving ? <><svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Saving...</> : '✓ Submit Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsInbox;
