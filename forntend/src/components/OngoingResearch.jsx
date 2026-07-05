import React, { useState, useEffect } from 'react';
import { FileText, Users, Microscope, Leaf, Clock3, Users2, Beaker } from 'lucide-react';
import { getSectionData } from '../services/api';
import 'animate.css';

const statusColors = {
  "Manuscript in Preparation": "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
  "Under Review": "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
  "Data Collection": "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/50",
  "Experimental Phase": "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
};

const OngoingResearch = () => {
  const [ongoingResearchData, setOngoingResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('ongoing_projects');
        data.sort((a, b) => a.order - b.order);
        setOngoingResearchData(data);
      } catch (error) {
        console.error("Failed to load ongoing projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: FileText, label: `${ongoingResearchData.length}`, desc: "Active Manuscripts" },
    { icon: Users, label: "4+", desc: "Int. Collaborators" },
    { icon: Microscope, label: "2", desc: "Research Domains" },
    { icon: Leaf, label: "100%", desc: "Sustainability Focus" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform duration-300 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-xl">{stat.label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ongoingResearchData.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 animate__animated animate__fadeInUp relative flex flex-col"
              style={{ animationDelay: `${(index + 2) * 150}ms` }}
            >
              {/* Subtle Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>

              {/* Header area with badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] sm:text-xs font-bold shadow-sm w-fit">
                  <Beaker className="w-3 h-3" />
                  {item.category}
                </span>
                
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border shadow-sm w-fit ${statusColors[item.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  <Clock3 className="w-3 h-3" />
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300 relative z-10 line-clamp-2" title={item.title}>
                {item.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs mb-6 flex-grow relative z-10 line-clamp-3" title={item.description}>
                {item.description}
              </p>

              {/* Collaborators section */}
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <Users2 className="w-5 h-5 text-gray-400" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Collaborators</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.collaborators.map((collab, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-100 dark:border-gray-700">
                      {collab}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
    </div>
  );
};

export default OngoingResearch;
