import React, { useState } from 'react';
import { Microscope, BookOpen, Clock } from 'lucide-react';
import ResearchAreas from './ResearchAreas';
import OngoingResearch from './OngoingResearch';
import Publications from './Publications';
import 'animate.css';

const Research = () => {
  const [activeTab, setActiveTab] = useState('areas');

  const tabs = [
    { id: 'areas', label: 'Focus Areas', icon: Microscope },
    { id: 'ongoing', label: 'Ongoing Projects', icon: Clock },
    { id: 'publications', label: 'Publications', icon: BookOpen },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-gray-900 min-h-screen relative overflow-hidden">
      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-blue-200/20 dark:from-blue-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-indigo-200/20 dark:from-indigo-900/10 to-transparent pointer-events-none"></div>

      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Global Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate__animated animate__fadeInUp">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Research & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Innovation</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            Advancing sustainable technologies through cutting-edge materials science, water remediation, and electrocatalysis.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-16 animate__animated animate__fadeInUp animate__delay-1s">
          <div className="inline-flex p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="animate__animated animate__fadeIn">
          {activeTab === 'areas' && <ResearchAreas />}
          {activeTab === 'ongoing' && <OngoingResearch />}
          {activeTab === 'publications' && <Publications />}
        </div>
        
      </div>
    </section>
  );
};

export default Research;
