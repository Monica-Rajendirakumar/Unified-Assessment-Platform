import React from 'react';

const Logo = ({ className = "h-8 w-8", showText = true }) => (
  <div className="flex items-center">
    <div className={`bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg flex items-center justify-center p-1.5 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    </div>
    {showText && <span className="ml-2.5 text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">UAP</span>}
  </div>
);

export default Logo;
