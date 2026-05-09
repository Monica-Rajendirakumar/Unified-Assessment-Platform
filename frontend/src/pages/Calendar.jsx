import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const { data } = await apiClient.get('/assessments');
        setAssessments(data);
      } catch (err) {
        console.error('Error fetching assessments for calendar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  // Calendar Logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Get upcoming 3 assessments
  const upcomingDeadlines = assessments
    .filter(a => a.dueDate && new Date(a.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const getDaysRemaining = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Due today' : `Due in ${days} days`;
  };

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const days = [];
  // Prefill empty squares for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border-b border-r border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30"></div>);
  }

  // Fill actual days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayAssessments = assessments.filter(a => a.dueDate && a.dueDate.startsWith(dateStr));
    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

    days.push(
      <div key={d} className={`h-24 sm:h-32 border-b border-r border-gray-100 dark:border-gray-700/50 p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20 group relative ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
        <span className={`text-sm font-bold ${isToday ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-500 dark:text-gray-400'}`}>
          {d}
        </span>
        <div className="mt-1 space-y-1 overflow-hidden">
          {dayAssessments.map(a => (
            <div key={a._id} className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 truncate font-medium border border-blue-200 dark:border-blue-800" title={a.title}>
              {a.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-in fade-in duration-500">
      
      {/* Upcoming Deadlines (Match Screenshot) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-10 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
            <p className="text-gray-400 font-medium tracking-tight">Don't miss these important dates</p>
          </div>
          <button className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
             <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             View Calendar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-28 bg-gray-50 dark:bg-gray-700/30 rounded-3xl animate-pulse" />)
          ) : upcomingDeadlines.length === 0 ? (
             <div className="col-span-3 p-12 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
               <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-lg">All caught up!</p>
               <p className="text-gray-400 text-sm">No new assessments are currently scheduled.</p>
             </div>
          ) : upcomingDeadlines.map((deadline, idx) => {
            const themes = [
              { bg: 'bg-blue-50/60 dark:bg-blue-900/10', icon: 'bg-blue-600', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-100 dark:border-blue-900/30' },
              { bg: 'bg-green-50/60 dark:bg-green-900/10', icon: 'bg-green-600', text: 'text-green-700 dark:text-green-300', border: 'border-green-100 dark:border-green-900/30' },
              { bg: 'bg-purple-50/60 dark:bg-purple-900/10', icon: 'bg-purple-600', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-100 dark:border-purple-900/30' }
            ][idx % 3];
            const date = new Date(deadline.dueDate);
            return (
              <div key={deadline._id} className={`${themes.bg} border ${themes.border} rounded-3xl p-5 flex items-center space-x-5 transition-all hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-none hover:-translate-y-1 group`}>
                <div className={`${themes.icon} w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-gray-200 dark:shadow-none`}>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-2xl font-black leading-none">{date.getDate()}</span>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-gray-900 dark:text-white text-base truncate mb-0.5 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{deadline.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold tracking-wide">{getDaysRemaining(deadline.dueDate)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{monthName} {year}</h1>
          <p className="text-gray-500 dark:text-gray-400">View upcoming assessments and deadlines</p>
        </div>
        <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Today</button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {loading ? (
            <div className="col-span-7 h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : days}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center space-x-6">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2 shadow-sm shadow-blue-200 dark:shadow-none"></span>
          Scheduled Assessment
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span className="w-3 h-3 rounded-full bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500 mr-2"></span>
          Today
        </div>
      </div>
    </div>
  );
};

export default Calendar;
