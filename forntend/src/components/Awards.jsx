import React from 'react';
import { Award, Trophy, Medal, GraduationCap, Star, BadgeCheck, Crown, Calendar, Building2, Sparkles, Globe2 } from 'lucide-react';
import 'animate.css';

import { getSectionData } from '../services/api';

const awardStats = [
  { value: "4+", label: "Major Awards", icon: Trophy },
  { value: "EU", label: "Funded Scholarship", icon: Globe2 }, // Wait, Globe2 is not imported. I'll use Star
  { value: "15+", label: "Years of Academic Excellence", icon: GraduationCap },
  { value: "International", label: "Research Recognition", icon: BadgeCheck },
];

const Awards = () => {
  const [awardsData, setAwardsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('awards');
        setAwardsData(data);
      } catch (error) {
        console.error("Failed to load awards data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const featuredAward = awardsData.find(award => award.isFeatured);
  const otherAwards = awardsData.filter(award => !award.isFeatured);

  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">

      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {awardStats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform duration-300 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-2xl mb-1">{stat.value}</h4>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured Award */}
        {featuredAward && (
          <div className="mb-12 group/featured animate__animated animate__fadeInUp" style={{ animationDelay: '300ms' }}>
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/10 backdrop-blur-xl p-6 lg:p-10 rounded-3xl border border-amber-200/50 dark:border-amber-700/40 shadow-xl shadow-amber-500/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 pointer-events-none transition-transform duration-700 group-hover/featured:scale-110 group-hover/featured:rotate-12">
                <Trophy className="w-64 h-64 text-amber-600" />
              </div>

              {/* Icon Area */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-xl shadow-amber-500/20 border border-amber-100 dark:border-gray-700 relative overflow-hidden group-hover/featured:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/20 opacity-0 group-hover/featured:opacity-100 transition-opacity duration-500"></div>
                  <Crown className="w-12 h-12 sm:w-14 sm:h-14 text-amber-500 relative z-10" />
                </div>
              </div>

              {/* Content Area */}
              <div className="relative z-10 flex-1 w-full text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-orange-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Achievement
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight group-hover/featured:text-amber-600 dark:group-hover/featured:text-amber-400 transition-colors">
                  {featuredAward.title}
                </h3>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                    {featuredAward.organization}
                  </div>
                  <div className="hidden sm:block text-amber-300 dark:text-amber-700">•</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                    {featuredAward.year}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-3xl">
                  {featuredAward.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Other Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherAwards.map((award, index) => {
            const iconMap = {
              Trophy, Medal, Award, Crown, BadgeCheck, Star
            };
            const Icon = iconMap[award.icon] || Award;
            const colorClassMap = {
              blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 shadow-blue-500/5",
              emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 shadow-emerald-500/5",
              purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50 shadow-purple-500/5",
            };
            const colorStyle = colorClassMap[award.color] || colorClassMap.blue;

            return (
              <div 
                key={index} 
                className="group bg-white dark:bg-gray-800/90 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 animate__animated animate__fadeInUp flex flex-col relative overflow-hidden"
                style={{ animationDelay: `${(index + 3) * 150}ms` }}
              >
                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${colorStyle.split(' ')[1]}`}></div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ${colorStyle.split(' ').slice(0, 2).join(' ')}`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold border border-gray-100 dark:border-gray-700">
                    {award.type}
                  </span>
                </div>

                <h3 className={`text-xl font-bold text-gray-900 dark:text-white leading-tight mb-4 transition-colors duration-300 group-hover:${colorStyle.split(' ')[0]}`}>
                  {award.title}
                </h3>
                
                <div className="flex flex-col gap-2 mb-6 relative z-10">
                  <div className="flex items-start sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    <Building2 className={`w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0 ${colorStyle.split(' ')[0]}`} />
                    <span>{award.organization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 font-bold">
                    <Calendar className={`w-3.5 h-3.5 flex-shrink-0 ${colorStyle.split(' ')[0]}`} />
                    <span>{award.year}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mt-auto relative z-10">
                  {award.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Awards;
