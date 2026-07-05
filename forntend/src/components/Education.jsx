import React from 'react';
import { Calendar, MapPin, Globe, Microscope, Plane , Loader2} from 'lucide-react';
import 'animate.css';

import { getSectionData } from '../services/api';

const stats = [
  { icon: Globe, label: "4 Countries Experience", desc: "Pakistan, China, Spain, Italy" },
  { icon: Calendar, label: "10+ Years", desc: "Academic Journey" },
  { icon: Microscope, label: "Materials Science", desc: "Specialist & Researcher" },
  { icon: Plane, label: "International", desc: "Research Exposure" },
];

const Education = () => {
  const [educationData, setEducationData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSectionData('education');
        const sortedData = data.sort((a, b) => a.order - b.order);
        setEducationData(sortedData);
      } catch (error) {
        console.error("Failed to load education data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="w-full relative z-10 animate__animated animate__fadeIn">
      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Stats Grid */}
          <div className="lg:w-1/3 flex flex-col justify-start">
            <div className="sticky top-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 animate__animated animate__fadeInLeft" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{stat.label}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Vertical Timeline */}
          <div className="lg:w-2/3">
            <div className="relative border-l-2 border-blue-100 dark:border-gray-700 ml-4 md:ml-6">
              
              {educationData.map((item, index) => (
                <div key={index} className="mb-12 relative pl-8 md:pl-12 group animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-500 shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                  
                  {/* Content Card */}
                  <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:shadow-gray-200/40 dark:hover:shadow-none transition-all duration-300 group-hover:-translate-y-1 relative">
                    
                    {/* Duration Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.duration}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.degree}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium mb-4">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.institution}
                      </a>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[1.05rem]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Education;
