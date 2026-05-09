import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';

const emptyQuestion = () => ({
  questionText: '',
  type: 'MCQ',
  options: ['', '', '', ''],
  marks: 5,
});

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'MCQ',
    duration: 60,
    dueDate: '',
  });
  const [questions, setQuestions] = useState([emptyQuestion()]);

  const updateForm = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const updateQuestion = (idx, field, val) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: val } : q));
  };

  const updateOption = (qIdx, optIdx, val) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...q.options];
      opts[optIdx] = val;
      return { ...q, options: opts };
    }));
  };

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()]);
  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.subject) {
      setError('Title and Subject are required.');
      return;
    }
    if (questions.some(q => !q.questionText.trim())) {
      setError('All questions must have text.');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/assessments', { ...form, questions });
      navigate('/instructor/assessments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 font-medium transition-colors">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Create Assessment</h1>
        <p className="text-gray-500 dark:text-gray-400">Build a new test for your students</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
              <input type="text" required value={form.title} onChange={e => updateForm('title', e.target.value)}
                placeholder="e.g. Introduction to React Fundamentals"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={e => updateForm('description', e.target.value)}
                placeholder="Briefly describe what this assessment covers..."
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
              <input type="text" required value={form.subject} onChange={e => updateForm('subject', e.target.value)}
                placeholder="e.g. Web Development"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
              <select value={form.type} onChange={e => updateForm('type', e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="MCQ">MCQ</option>
                <option value="Written">Written</option>
                <option value="Coding">Coding</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Duration (minutes)</label>
              <input type="number" min={5} max={300} value={form.duration} onChange={e => updateForm('duration', Number(e.target.value))}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Due Date & Time</label>
              <input type="datetime-local" value={form.dueDate} onChange={e => updateForm('dueDate', e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

          </div>
        </div>

        {/* Questions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Questions</h2>
              <p className="text-sm text-gray-500">{questions.length} question{questions.length !== 1 ? 's' : ''} added</p>
            </div>
            <button type="button" onClick={addQuestion}
              className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    Q{qIdx + 1}
                  </span>
                  <div className="flex items-center space-x-3">
                    <select value={q.type} onChange={e => updateQuestion(qIdx, 'type', e.target.value)}
                      className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none">
                      <option value="MCQ">MCQ</option>
                      <option value="Written">Written</option>
                      <option value="Coding">Coding</option>
                    </select>
                    <input type="number" min={1} max={100} value={q.marks} onChange={e => updateQuestion(qIdx, 'marks', Number(e.target.value))}
                      className="text-xs w-16 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none"
                      title="Marks for this question" />
                    <span className="text-xs text-gray-400">pts</span>
                    {questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qIdx)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>

                <textarea rows={2} required value={q.questionText} onChange={e => updateQuestion(qIdx, 'questionText', e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none transition-all" />

                {q.type === 'MCQ' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-400 w-5 shrink-0">
                          {['A', 'B', 'C', 'D'][optIdx]}
                        </span>
                        <input type="text" value={opt} onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Option ${['A', 'B', 'C', 'D'][optIdx]}`}
                          className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                      </div>
                    ))}
                  </div>
                )}

                {(q.type === 'Written' || q.type === 'Coding') && (
                  <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3">
                    Students will see a text area to write their {q.type === 'Coding' ? 'code' : 'written'} answer.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-70 flex items-center">
            {submitting ? (
              <><svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Creating...</>
            ) : (
              <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Publish Assessment</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssessment;
