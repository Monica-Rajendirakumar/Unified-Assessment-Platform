import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Assessment Graded', message: 'Your "Advanced Python" test has been evaluated.', time: '2 mins ago', unread: true, type: 'success' },
    { id: 2, title: 'New Assessment', message: 'A new quiz has been posted for Data Structures.', time: '1 hour ago', unread: true, type: 'info' },
    { id: 3, title: 'System Maintenance', message: 'Platform will be offline for 10 mins at midnight.', time: '5 hours ago', unread: false, type: 'warning' },
  ]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-[360px] bg-white dark:bg-gray-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-700 overflow-hidden z-[100] animate-in zoom-in-95 fade-in duration-200 origin-top-right"
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
        <button onClick={markAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-500">Mark all read</button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-400 italic">No new messages</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors relative group transition-all ${n.unread ? 'bg-blue-50/10' : ''}`}
              >
                {n.unread && <span className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full"></span>}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'success' ? 'bg-green-100 text-green-600' : 
                    n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold text-gray-900 dark:text-white mb-0.5 ${n.unread ? 'pr-4' : ''}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2">{n.message}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 text-center">
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All Archive</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
