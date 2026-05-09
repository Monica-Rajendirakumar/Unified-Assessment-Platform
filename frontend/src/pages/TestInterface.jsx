import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';

const TestInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const { data } = await apiClient.get(`/assessments/${id}`);
        setAssessment(data);
        setTimeLeft(data.duration * 60); // Convert minutes to seconds
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { setShowModal(true); return; }
    timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    clearTimeout(timerRef.current);
    try {
      const formattedAnswers = assessment.questions.map(q => ({
        questionId: q._id,
        answer: answers[q._id] || '',
      }));
      await apiClient.post('/submissions', {
        assessmentId: id,
        answers: formattedAnswers,
      });
      navigate('/results');
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Assessment not found</p>
          <button onClick={() => navigate('/assessments')} className="text-blue-600 hover:underline text-sm">Back to Catalog</button>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[activeQuestion];
  const answeredCount = Object.keys(answers).length;
  const isTimeLow = timeLeft !== null && timeLeft < 300;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-5 pb-4 px-8 shrink-0 shadow-sm">
        <div className="w-full flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {assessment.subject} <span className="mx-2">•</span> {assessment.instructor?.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-bold ${
              isTimeLow
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="tracking-wider">{timeLeft !== null ? formatTime(timeLeft) : '--:--:--'}</span>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm">
              Submit Assessment
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full mt-5">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gray-900 dark:bg-gray-100 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((activeQuestion + 1) / assessment.questions.length) * 100}%` }}></div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-auto p-8">
        <div className="w-full flex flex-col xl:flex-row gap-8">

          {/* Question Panel */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Question {activeQuestion + 1} <span className="text-gray-400 font-normal">of {assessment.questions.length}</span>
                </h2>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg font-semibold">{currentQ.marks} pts</span>
              </div>

              <p className="text-lg text-gray-800 dark:text-gray-200 font-medium mb-8 leading-relaxed">{currentQ.questionText}</p>

              {/* MCQ Options */}
              {currentQ.type === 'MCQ' && (
                <div className="space-y-3">
                  {currentQ.options.filter(o => o.trim()).map((opt, i) => (
                    <label key={i} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      answers[currentQ._id] === opt
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}>
                      <input type="radio" name={currentQ._id} className="sr-only"
                        checked={answers[currentQ._id] === opt}
                        onChange={() => handleAnswer(currentQ._id, opt)} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors shrink-0 ${
                        answers[currentQ._id] === opt
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {answers[currentQ._id] === opt && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Written / Coding Answer */}
              {(currentQ.type === 'Written' || currentQ.type === 'Coding') && (
                <textarea
                  rows={8}
                  value={answers[currentQ._id] || ''}
                  onChange={e => handleAnswer(currentQ._id, e.target.value)}
                  placeholder={currentQ.type === 'Coding' ? 'Write your code here...' : 'Write your answer here...'}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono transition-all"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mt-4 flex justify-between items-center">
              <button disabled={activeQuestion === 0}
                onClick={() => setActiveQuestion(p => p - 1)}
                className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-40 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Previous
              </button>
              <span className="text-sm text-gray-400">{answeredCount} / {assessment.questions.length} answered</span>
              <button disabled={activeQuestion === assessment.questions.length - 1}
                onClick={() => setActiveQuestion(p => p + 1)}
                className="flex items-center bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-bold py-2.5 px-6 rounded-xl transition-colors disabled:opacity-40">
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Navigator Panel */}
          <div className="w-full xl:w-72 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {assessment.questions.map((q, i) => (
                  <button key={i} onClick={() => setActiveQuestion(i)}
                    className={`h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all border ${
                      activeQuestion === i
                        ? 'bg-blue-600 text-white border-blue-600'
                        : answers[q._id]
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-400'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 rounded bg-blue-600 mr-3"></div> Current
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-200 mr-3"></div> Answered
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 mr-3"></div> Not Answered
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Submit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Submit Assessment?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">You have answered <strong>{answeredCount}</strong> out of <strong>{assessment.questions.length}</strong> questions.</p>
            {answeredCount < assessment.questions.length && (
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">⚠ {assessment.questions.length - answeredCount} question(s) still unanswered.</p>
            )}
            <p className="text-gray-500 text-sm mb-8">This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button onClick={() => setShowModal(false)} disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Review Answers
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 shadow-sm transition-colors disabled:opacity-70 flex items-center">
                {submitting ? <><svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Submitting...</> : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestInterface;
