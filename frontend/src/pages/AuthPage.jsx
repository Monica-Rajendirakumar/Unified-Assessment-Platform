import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const MailIcon = ({ size = 24, strokeWidth = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const LockIcon = ({ size = 24, strokeWidth = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Check if we should start in Signup mode
  const queryParams = new URLSearchParams(location.search);
  const initialIsLogin = queryParams.get('signup') !== 'true';
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    ...(!isLogin && {
      name: Yup.string().required('Name is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    role: Yup.string().oneOf(['Student', 'Instructor', 'Admin']).required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Student',
    },
    validationSchema,
    onSubmit: async (values) => {
      setErrorMsg('');
      try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const res = await axios.post(`http://localhost:5000${endpoint}`, values);
        
        // Save token using Context
        login(res.data.token);

        // Routing logic
        if (res.data.role === 'Student') navigate('/dashboard');
        else if (res.data.role === 'Instructor') navigate('/instructor-dashboard');
        else if (res.data.role === 'Admin') navigate('/admin-dashboard');

      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Authentication failed');
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 py-12">
      {/* Logo Container */}
      <div className="mb-6">
        <Logo className="h-10 w-10" showText={false} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unified Assessment Platform</h1>
      <p className="text-gray-500 mb-8 text-sm sm:text-base">Manage and participate in online assessments</p>

      {/* Main Card */}
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Welcome</h2>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account or create a new one</p>

        {/* Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${isLogin ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setIsLogin(true); formik.resetForm(); setErrorMsg(''); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${!isLogin ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setIsLogin(false); formik.resetForm(); setErrorMsg(''); }}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className={`w-full bg-slate-50 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-slate-200'} rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
              </div>
              {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <MailIcon size={18} strokeWidth={2} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                className={`w-full bg-slate-50 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <LockIcon size={18} strokeWidth={2} />
              </span>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className={`w-full bg-slate-50 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-200'} rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.password}</p>}
            {isLogin && (
              <div className="flex justify-end mt-1.5">
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">Forgot Password?</button>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Confirm Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <LockIcon size={18} strokeWidth={2} />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.confirmPassword}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Role</label>
            <div className="relative">
              <select
                name="role"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-700"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            {formik.touched.role && formik.errors.role && <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.role}</p>}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#0a0a0f] hover:bg-gray-800 text-white font-semibold flex justify-center py-2.5 rounded-lg text-sm mt-8 transition-colors shadow-sm disabled:opacity-70"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
