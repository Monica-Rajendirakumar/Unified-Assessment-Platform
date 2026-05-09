import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../utils/api';

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Academic enthusiast and lifelong learner focused on mastering digital skills.',
    location: user?.location || 'New York, USA',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Synchronize form when user loads
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || prev.bio,
        location: user.location || prev.location,
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiClient.put('/auth/profile', {
        name: formData.name,
        bio: formData.bio,
        location: formData.location
      });
      
      // Update global context
      updateUser(res.data);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information and platform identity</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-2xl text-sm font-bold flex items-center shadow-sm animate-in slide-in-from-top duration-300">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center shadow-sm animate-in slide-in-from-top duration-300">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-blue-500/20">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-1 right-1 bg-white dark:bg-gray-700 p-2.5 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{formData.name}</h2>
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-6">{user?.role}</p>
            
            <div className="pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-center space-x-8">
               <div>
                 <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Assessments</p>
               </div>
               <div className="border-l border-gray-100 dark:border-gray-700 h-10"></div>
               <div>
                 <p className="text-xl font-bold text-gray-900 dark:text-white">88%</p>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Avg Score</p>
               </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20">
             <h3 className="text-lg font-bold mb-4">Membership</h3>
             <p className="text-indigo-100 text-sm mb-6 font-medium">Pro Institutional Account • Renewing May 2026</p>
             <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold text-sm">View Billing History</button>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                       type="text" 
                       className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input 
                       type="email" 
                       disabled
                       className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                       value={formData.email}
                    />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Bio / Introduction</label>
                    <textarea 
                       className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                       rows="4"
                       value={formData.bio}
                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    ></textarea>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Location</label>
                    <input 
                       type="text" 
                       className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                       value={formData.location}
                       onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                 </div>
              </div>
              
              <div className="flex justify-end pt-8 border-t border-gray-50 dark:border-gray-700 gap-4">
                 <button className="px-8 py-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm tracking-wide hover:bg-gray-100 transition-colors">Discard</button>
                 <button 
                   onClick={handleSave}
                   disabled={saving}
                   className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center"
                 >
                   {saving ? 'Saving...' : 'Save Changes'}
                   {!saving && <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
