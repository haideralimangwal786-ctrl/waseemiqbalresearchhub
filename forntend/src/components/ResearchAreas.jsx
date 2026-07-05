import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { getSectionData } from '../services/api';
import 'animate.css';

const colorMap = {
  blue: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)]", borderGlow: "group-hover:border-blue-500/50" },
  amber: { color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(245,158,11,0.2)]", borderGlow: "group-hover:border-amber-500/50" },
  indigo: { color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(99,102,241,0.2)]", borderGlow: "group-hover:border-indigo-500/50" },
  orange: { color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(249,115,22,0.2)]", borderGlow: "group-hover:border-orange-500/50" },
  teal: { color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(20,184,166,0.2)]", borderGlow: "group-hover:border-teal-500/50" },
  purple: { color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(168,85,247,0.2)]", borderGlow: "group-hover:border-purple-500/50" },
  emerald: { color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(16,185,129,0.2)]", borderGlow: "group-hover:border-emerald-500/50" },
  rose: { color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/30", glow: "group-hover:shadow-[0_8px_30px_rgb(244,63,94,0.2)]", borderGlow: "group-hover:border-rose-500/50" }
};

const ResearchAreas = () => {
  const [researchAreas, setResearchAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('research_areas');
        // Sort by order
        data.sort((a, b) => a.order - b.order);
        setResearchAreas(data);
      } catch (error) {
        console.error("Failed to load research areas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">
      {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchAreas.map((area, index) => {
            const Icon = LucideIcons[area.icon] || LucideIcons.Atom;
            const theme = colorMap[area.colorTheme] || colorMap.blue;
            
            return (
              <div 
                key={area._id || index}
                className={`group flex flex-col bg-white dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative ${theme.glow} ${theme.borderGlow} animate__animated animate__fadeInUp`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Dynamic Subtle Hover Overlay tinted by Area Color */}
                <div className={`absolute inset-0 ${theme.bg} opacity-0 group-hover:opacity-40 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-3xl`}></div>

                {/* Icon Wrapper */}
                <div className="relative mb-6 z-10">
                  <div className={`absolute inset-0 ${theme.bg} rounded-2xl blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100`}></div>
                  <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme.bg} ${theme.color} shadow-inner`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors z-10 relative group-hover:${theme.color.replace('text-', 'text-')}`}>
                  {area.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow z-10 relative">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default ResearchAreas;
