import React from 'react';
import { GraduationCap, Building2, Globe, MapPin, Calendar, Clock, Award, CheckCircle2 , Loader2} from 'lucide-react';
import 'animate.css';

import { getSectionData } from '../services/api';

const stats = [
  { icon: Globe, label: "2 Programs", desc: "International Training" },
  { icon: Building2, label: "2 Institutions", desc: "European Centers" },
  { icon: Clock, label: "12+ Months", desc: "Global Training" },
  { icon: Award, label: "Exposure", desc: "Research & Industry" },
];

const InternationalTraining = () => {
  const [internationalTrainingData, setInternationalTrainingData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('training');
        setInternationalTrainingData(data);
      } catch (error) {
        console.error("Failed to load training data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">

      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform duration-300 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-inner">
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">{stat.label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {internationalTrainingData.map((item, index) => {
            // Reconstruct styling based on color mapping
            const colorMap = {
              "text-amber-500": {
                icon: GraduationCap,
                hoverColor: "group-hover:text-amber-500",
                bg: "bg-amber-50 dark:bg-amber-900/30",
                glow: "group-hover:shadow-[0_8px_30px_rgb(245,158,11,0.2)]",
                borderGlow: "group-hover:border-amber-500/50",
                gradient: "from-amber-500 to-orange-500"
              },
              "text-emerald-500": {
                icon: Building2,
                hoverColor: "group-hover:text-emerald-500",
                bg: "bg-emerald-50 dark:bg-emerald-900/30",
                glow: "group-hover:shadow-[0_8px_30px_rgb(16,185,129,0.2)]",
                borderGlow: "group-hover:border-emerald-500/50",
                gradient: "from-emerald-500 to-teal-500"
              }
            };
            const style = colorMap[item.color] || colorMap["text-amber-500"];
            const Icon = style.icon;
            
            return (
              <div 
                key={index} 
                className={`group flex flex-col bg-white dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate__animated animate__fadeInUp relative ${style.borderGlow}`}
                style={{ animationDelay: `${(index + 2) * 150}ms` }}
              >
                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-3xl`}></div>

                {/* Decorative Top Line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${style.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl`}></div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6 relative z-10">
                  {/* Icon Wrapper */}
                  <div className="relative">
                    <div className={`absolute inset-0 ${style.bg} rounded-2xl blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100`}></div>
                    <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${style.bg} ${item.color} shadow-inner`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700/50 text-sm transform transition-transform group-hover:scale-110">
                        {item.flag}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 mt-2 sm:mt-0">
                    <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 ${style.hoverColor}`}>{item.title}</h3>
                    <div className="flex flex-col gap-1.5">
                      <div className={`flex items-start sm:items-center gap-2 font-semibold text-sm ${item.color}`}>
                        <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span>{item.institution}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-8 flex-grow relative z-10">
                  {item.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 relative z-10">
                  {item.highlights.map((highlight, i) => (
                    <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-100 dark:border-gray-700 transition-colors duration-300 group-hover:border-${item.color.split('-')[1]}-200 dark:group-hover:border-${item.color.split('-')[1]}-800/50`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${item.color}`} />
                      {highlight}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default InternationalTraining;
