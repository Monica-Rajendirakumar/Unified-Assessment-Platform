import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const ForgotPassword = () => {
  const [phase, setPhase] = useState('email'); // 'email', 'otp', 'reset', 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setPhase('otp');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setPhase('reset');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, password });
      setPhase('success');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <Logo className="h-10 w-10 mx-auto" showText={false} />
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {phase === 'email' && (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h1>
            <p className="text-slate-500 text-sm mb-8">No worries! Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        {phase === 'otp' && (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Enter OTP</h1>
            <p className="text-slate-500 text-sm mb-8">We've sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span></p>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </>
        )}

        {phase === 'reset' && (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-500 text-sm mb-8">Enter your new password below.</p>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {phase === 'success' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm mb-8">Your password has been successfully updated.</p>
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-900/20"
            >
              Log In Now
            </button>
          </div>
        )}

        {phase !== 'success' && (
          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <Link to="/auth" className="text-slate-500 text-sm hover:text-slate-700 transition-colors">
              Remember your password? <span className="text-blue-600 font-bold ml-1">Log in</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
