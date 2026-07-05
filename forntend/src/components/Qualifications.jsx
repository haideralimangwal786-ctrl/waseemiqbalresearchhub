import React, { useState } from 'react';
import { GraduationCap, Globe, Cpu, Award } from 'lucide-react';
import Education from './Education';
import InternationalTraining from './InternationalTraining';
import Skills from './Skills';
import Awards from './Awards';
import 'animate.css';

const Qualifications = () => {
  const [activeTab, setActiveTab] = useState('education');

  const tabs = [
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'training', label: 'Global Training', icon: Globe },
    { id: 'skills', label: 'Technical Skills', icon: Cpu },
    { id: 'awards', label: 'Awards & Honors', icon: Award },
  ];

  return (
    <section id="qualifications" className="py-24 bg-slate-50/50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-500 min-h-screen flex flex-col">
      
      {/* Dynamic Background Blurs based on Active Tab */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000 ${
        activeTab === 'education' ? 'bg-blue-400' : 
        activeTab === 'training' ? 'bg-emerald-400' : 
        activeTab === 'skills' ? 'bg-indigo-400' : 'bg-amber-400'
      }`}></div>
      
      <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000 ${
        activeTab === 'education' ? 'bg-indigo-400' : 
        activeTab === 'training' ? 'bg-teal-400' : 
        activeTab === 'skills' ? 'bg-purple-400' : 'bg-orange-400'
      }`}></div>

      <div className="w-[90%] max-w-7xl mx-auto relative z-10 flex-grow flex flex-col">
        
        {/* Unified Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate__animated animate__fadeInDown">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
            Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Excellence</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            A comprehensive overview of my educational journey, international training, technical proficiencies, and recognitions.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-16 animate__animated animate__fadeInUp">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-500 overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-xl shadow-blue-900/20 scale-105' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500"></div>
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className="relative w-full flex-grow flex flex-col">
          {activeTab === 'education' && <Education />}
          {activeTab === 'training' && <InternationalTraining />}
          {activeTab === 'skills' && <Skills />}
          {activeTab === 'awards' && <Awards />}
        </div>

      </div>
    </section>
  );
};

export default Qualifications;
