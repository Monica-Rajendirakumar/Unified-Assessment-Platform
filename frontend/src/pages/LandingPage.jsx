import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const LandingPage = () => {
  const navigate = useNavigate();

  // Force Light mode for the Landing Page
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const features = [
    { title: 'Create Assessments', desc: 'Design comprehensive assessments with multiple question types and custom grading', icon: '📖', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Take Tests Online', desc: 'Students can take assessments anytime, anywhere with a seamless interface', icon: '📋', color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Advanced Analytics', desc: 'Track performance with detailed reports and insights for better learning outcomes', icon: '📊', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Multi-Role Support', desc: 'Separate portals for students, instructors, and administrators', icon: '👥', color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Secure & Reliable', desc: 'Enterprise-grade security ensuring data protection and privacy', icon: '🛡️', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Real-time Evaluation', desc: 'Instant grading for objective questions and streamlined manual grading', icon: '⚡', color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  const steps = [
    { num: 1, title: 'Create Account', desc: 'Sign up as a student, instructor, or admin in seconds', color: 'bg-blue-600' },
    { num: 2, title: 'Setup Assessments', desc: 'Create or take assessments with our intuitive interface', color: 'bg-purple-600' },
    { num: 3, title: 'Track Progress', desc: 'Monitor performance with detailed analytics and reports', color: 'bg-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo className="h-9 w-9" />
          <div className="flex items-center space-x-6">
            <Link to="/auth?signup=true" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign Up</Link>
            <button
               onClick={() => navigate('/auth')}
               className="bg-[#0a0a0f] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in slide-in-from-left duration-1000">
            <h1 className="text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              Modern <br />
              Assessment <br />
              <span className="text-blue-600">Made Simple</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-10">
              Empower your educational institution with our comprehensive online assessment platform. Create, manage, and evaluate assessments with ease.
            </p>
            <div className="flex items-center space-x-4">
               <button onClick={() => navigate('/auth')} className="bg-[#0a0a0f] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-black/20 flex items-center">
                 Get Started Free
                 <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
               </button>
            </div>
            <div className="mt-10 flex items-center space-x-8">
               <div className="flex items-center text-sm font-bold text-green-600">
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 No credit card required
               </div>
               <div className="flex items-center text-sm font-bold text-green-600">
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 14-day free trial
               </div>
            </div>
          </div>
          
          <div className="relative animate-in slide-in-from-right duration-1000">
             <div className="bg-white rounded-[2rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10 overflow-hidden">
                <div className="space-y-8">
                   {[
                     { title: 'Advanced Mathematics Quiz', sub: 'Calculus • Active Now', icon: '📖', color: 'bg-blue-100 text-blue-600', badge: 'Active', delay: 'delay-100' },
                     { title: 'Top Scorer: Sarah Jenkins', sub: '98.5% Score • Python Basics', icon: '✅', color: 'bg-green-100 text-green-600', badge: 'Evaluated', delay: 'delay-300' },
                     { title: 'Platform Avg. Score', sub: '↑ 12% increase this month', icon: '📊', color: 'bg-purple-100 text-purple-600', badge: 'Trending', delay: 'delay-500' }
                   ].map((item, i) => (
                     <div key={i} className={`flex items-center gap-6 animate-in fade-in slide-in-from-bottom duration-700 ${item.delay}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${item.color}`}>
                           {item.icon}
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                              <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 border border-slate-100">{item.badge}</span>
                           </div>
                           <p className="text-xs font-semibold text-slate-400">{item.sub}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 blur-[80px] -z-10 opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in zoom-in duration-700">
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 text-lg">Comprehensive features designed to streamline your assessment process from creation to evaluation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 rounded-[1.2rem] ${f.bg} flex items-center justify-center text-2xl mb-8`}>{f.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">How It Works</h2>
          <p className="text-slate-500 text-lg mb-20">Get started in three simple steps</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-12 inset-x-0 h-0.5 bg-slate-100 -z-10"></div>
             {steps.map((s, idx) => (
               <div key={idx} className="bg-white p-4">
                 <div className={`w-16 h-16 rounded-full ${s.color} text-white flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-xl shadow-black/10`}>{s.num}</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">{s.title}</h3>
                 <p className="text-slate-500 font-medium px-4">{s.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-[3rem] p-16 text-center text-white shadow-2xl shadow-blue-500/30 animate-in zoom-in duration-1000">
          <h2 className="text-5xl font-black mb-8 leading-tight">Ready to Transform Your Assessments?</h2>
          <p className="text-indigo-100 text-xl max-w-2xl mx-auto mb-12 font-medium">Join thousands of educators and students using our platform to achieve better learning outcomes</p>
          <button onClick={() => navigate('/auth')} className="bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-slate-100 transition-all shadow-xl flex items-center mx-auto">
            Start Your Free Trial
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a10] pt-32 pb-16 px-6 text-slate-400">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div>
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.89 9.5l8.11 4.42 8.11-4.42-8.11-4.42L3.89 9.5zM12 15.5l-8.11-4.42-1.89 1.03L12 18.5l10-5.45-1.89-1.03-8.11 4.48z" /></svg>
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight">UAP</span>
               </div>
               <p className="leading-relaxed font-medium">Modern assessment platform for educational excellence.</p>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8">Product</h4>
               <ul className="space-y-4 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Demo</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8">Company</h4>
               <ul className="space-y-4 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">About</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-8">Legal</h4>
               <ul className="space-y-4 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-10 border-t border-slate-800 text-sm font-medium flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Unified Assessment Platform. All rights reserved.</p>
            <div className="flex items-center space-x-6">
               <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
               <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
               <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
