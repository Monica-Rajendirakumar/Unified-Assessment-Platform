import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';

const AssessmentCatalog = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  // Confirmation Modal State
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data } = await apiClient.get('/assessments');
        setAssessments(data);
      } catch (err) {
        setError('Failed to load assessments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const handleStartClick = (assessment) => {
    setSelectedAssessment(assessment);
    setShowConfirm(true);
  };

  const confirmStart = () => {
    if (selectedAssessment) {
      navigate(`/assessment/${selectedAssessment._id}`);
    }
  };

  const filtered = assessments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Available Assessments</h1>
        <p className="text-gray-500 dark:text-gray-400">Browse and start your assessments</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            placeholder="Search assessments by title or subject..."
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 sm:ml-4">
          {loading ? 'Loading...' : `${filtered.length} assessments found`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((assessment) => (
            <div key={assessment._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {assessment.subject}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{assessment.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{assessment.description}</p>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {assessment.instructor?.name || 'Instructor'}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 font-medium mb-8">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {assessment.duration} min
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {assessment.questions?.length || 0} questions
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartClick(assessment)}
                className="w-full bg-[#0a0a0f] hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
              >
                Start Assessment →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedAssessment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
              📝
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Ready to Start?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Are you ready to start this assessment? Please review the details below.</p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8 space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Title</span>
                  <span className="text-gray-900 dark:text-white font-bold">{selectedAssessment.title}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Duration</span>
                  <span className="text-gray-900 dark:text-white font-bold">{selectedAssessment.duration} minutes</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Questions</span>
                  <span className="text-gray-900 dark:text-white font-bold">{selectedAssessment.questions?.length || 0} items</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button 
                  onClick={() => setShowConfirm(false)}
                  className="py-3.5 px-4 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               >
                  Go Back
               </button>
               <button 
                  onClick={confirmStart}
                  className="bg-[#0a0a0f] dark:bg-white text-white dark:text-gray-900 py-3.5 px-4 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg"
               >
                  Start Now
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentCatalog;
