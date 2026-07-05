import React from 'react';
import { BookOpen, Globe2, Presentation, Lightbulb } from 'lucide-react';
import 'animate.css';

const ResearchImpact = () => {
  const stats = [
    { label: 'Publications', value: '25+', icon: BookOpen, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20', delay: '' },
    { label: 'Countries', value: '4', icon: Globe2, color: 'from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-500/20', delay: 'animate__delay-1s' },
    { label: 'Conferences', value: '10+', icon: Presentation, color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20', delay: 'animate__delay-2s' },
    { label: 'Research Areas', value: '5+', icon: Lightbulb, color: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-500/20', delay: 'animate__delay-3s' },
  ];

  return (
    <section id="impact" className="relative z-30 -mt-12 mb-20 px-4">
      <div className="w-[85%] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative bg-white dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-2 transition-all duration-500 animate__animated animate__fadeInUp overflow-hidden`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Background Glow on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative flex flex-col items-center text-center z-10">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-6 shadow-lg ${stat.shadow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <stat.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                
                {/* Number */}
                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight group-hover:scale-105 transition-transform duration-500">
                  {stat.value}
                </h3>
                
                {/* Label */}
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>

              {/* Decorative subtle border line that lights up on hover */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ResearchImpact;
