import React from 'react';
import { FlaskConical, Microscope, Atom, Laptop, BarChart3, Languages, CheckCircle2, Award, Zap, BookOpen, Globe2 , Loader2} from 'lucide-react';
import 'animate.css';

import { getSectionData } from '../services/api';

const expertiseStats = [
  { value: "20+", label: "Advanced Techniques", icon: Zap },
  { value: "10+", label: "Scientific Software Tools", icon: Laptop },
  { value: "6", label: "Research Domains", icon: BookOpen },
  { value: "4", label: "Countries of Research", icon: Globe2 },
];

const Skills = () => {
  const [skillsData, setSkillsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('skills');
        setSkillsData(data);
      } catch (error) {
        console.error("Failed to load skills data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">

      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {expertiseStats.map((stat, i) => (
            <div key={i} className="bg-slate-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform duration-300 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-3xl mb-1">{stat.value}</h4>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skills Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((category, index) => {
            const iconMap = {
              FlaskConical, Microscope, Atom, Laptop, BarChart3, Languages, CheckCircle2, Award, Zap, BookOpen, Globe2
            };
            const Icon = iconMap[category.icon] || CheckCircle2;
            
            const colorClassMap = {
              "text-blue-500": { bg: "bg-blue-50 dark:bg-blue-900/30", hoverColor: "group-hover:text-blue-500", gradient: "from-blue-500 to-cyan-500" },
              "text-emerald-500": { bg: "bg-emerald-50 dark:bg-emerald-900/30", hoverColor: "group-hover:text-emerald-500", gradient: "from-emerald-500 to-teal-500" },
              "text-amber-500": { bg: "bg-amber-50 dark:bg-amber-900/30", hoverColor: "group-hover:text-amber-500", gradient: "from-amber-500 to-orange-500" },
              "text-purple-500": { bg: "bg-purple-50 dark:bg-purple-900/30", hoverColor: "group-hover:text-purple-500", gradient: "from-purple-500 to-pink-500" },
              "text-pink-500": { bg: "bg-pink-50 dark:bg-pink-900/30", hoverColor: "group-hover:text-pink-500", gradient: "from-pink-500 to-rose-500" },
              "text-indigo-500": { bg: "bg-indigo-50 dark:bg-indigo-900/30", hoverColor: "group-hover:text-indigo-500", gradient: "from-indigo-500 to-blue-500" },
            };
            
            const style = colorClassMap[category.color] || colorClassMap["text-blue-500"];
            
            return (
              <div 
                key={index}
                className={`group bg-white dark:bg-gray-800/90 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative flex flex-col animate__animated animate__fadeInUp hover:border-${category.color.split('-')[1]}-200 dark:hover:border-${category.color.split('-')[1]}-800/50`}
                style={{ animationDelay: `${(index + 2) * 150}ms` }}
              >
                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${category.color.split('-')[1]}-500/0 to-${category.color.split('-')[1]}-500/5 dark:to-${category.color.split('-')[1]}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`}></div>

                {/* Decorative Top Line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${style.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl`}></div>

                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${style.bg} ${category.color} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300 ${style.hoverColor}`}>
                    {category.category}
                  </h3>
                </div>

                {/* Skills List */}
                <ul className="space-y-2.5 relative z-10">
                  {category.skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2.5 group/item">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${category.color} opacity-70 group-hover/item:opacity-100 transition-opacity`} />
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{skill}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative background for the card */}
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 ${style.bg} pointer-events-none`}></div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Skills;
