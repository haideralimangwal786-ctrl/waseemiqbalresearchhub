import React from 'react';
import { Briefcase, Calendar, MapPin, Globe, Clock, Award, CheckCircle2 , Loader2} from 'lucide-react';
import 'animate.css';

import { getSectionData } from '../services/api';

const stats = [
  { icon: Briefcase, label: "5+ Roles", desc: "Professional Positions" },
  { icon: Globe, label: "4 Countries", desc: "Research Experience" },
  { icon: Clock, label: "10+ Years", desc: "Scientific Journey" },
  { icon: Award, label: "International", desc: "Collaborations" },
];

const Experience = () => {
  const [experienceData, setExperienceData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getSectionData('experience');
        setExperienceData(data);
      } catch (error) {
        console.error("Failed to load experience data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);


  return (
    <section id="experience" className="py-24 bg-white dark:bg-gray-900 min-h-screen relative overflow-hidden">
      
      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate__animated animate__fadeInUp">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Experience</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            A diverse professional journey spanning academic research, international collaborations, industrial training, and science education across Pakistan, China, Spain, and Italy.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">{stat.label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Alternating Timeline */}
        <div className="relative">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-100 dark:bg-gray-800 rounded-full"></div>
          
          <div className="space-y-12 md:space-y-0 relative">
            {experienceData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} group animate__animated animate__fadeInUp`} style={{ animationDelay: `${index * 150}ms` }}>
                  
                  {/* Timeline Dot (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-500 shadow-md items-center justify-center z-10 group-hover:scale-125 group-hover:border-indigo-500 transition-all duration-300"></div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="group bg-white dark:bg-gray-800/90 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative flex flex-col">
                      
                      {/* Subtle Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>

                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        {/* Duration Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 relative z-10">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-start sm:items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-5 relative z-10">
                        <Building className="w-4 h-4 opacity-80 flex-shrink-0 mt-0.5 sm:mt-0" />
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            {item.organization}
                          </a>
                        ) : (
                          <span>{item.organization}</span>
                        )}
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700/50 relative z-10">
                        {item.highlights?.map((skill, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800/30 shadow-sm transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

// Simple icon for building
const Building = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

export default Experience;
