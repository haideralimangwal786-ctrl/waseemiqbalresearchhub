import React from 'react';
import { Hexagon } from 'lucide-react';

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      {/* Icon Container - Clean, Geometric, Academic */}
      <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 group-hover:scale-105">
        <Hexagon 
          className="w-10 h-10 text-blue-600 dark:text-blue-500 absolute" 
          strokeWidth={1.5} 
          fill="currentColor" 
          fillOpacity={0.1}
        />
        <span className="text-blue-700 dark:text-blue-400 font-bold text-sm tracking-widest z-10 font-sans">
          W
        </span>
      </div>

      {/* Branding Text - Minimalist & Elegant */}
      <div className="flex flex-col justify-center border-l-2 border-gray-200 dark:border-gray-700 pl-3 py-0.5 transition-colors duration-300 group-hover:border-blue-500">
        <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none">
          Waseem Iqbal
        </h1>
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mt-1.5 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          Research Hub
        </span>
      </div>
    </div>
  );
};

export default Logo;
