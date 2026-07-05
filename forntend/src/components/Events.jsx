import React, { useState, useEffect } from 'react';
import { getSectionData } from '../services/api';
import { Calendar, Link as LinkIcon, PlayCircle, Loader2 } from 'lucide-react';
import 'animate.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getSectionData('events');
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-20">
      <div className="w-[90%] max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate__animated animate__fadeInDown">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Upcoming & Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">Events</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest conferences, seminars, workshops, and speaking engagements featuring Dr. Waseem Iqbal.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div 
              key={event._id} 
              className={`group relative bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 animate__animated animate__fadeInUp flex flex-col`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Inner glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem] ring-1 ring-inset ring-indigo-500/20"></div>

              {/* Media Section */}
              {event.mediaUrl && (
                <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {/* Gradient Overlay for a seamless blend */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                  
                  {event.mediaType === 'image' ? (
                    <img 
                      src={event.mediaUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : event.mediaType === 'video' ? (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <video 
                        src={event.mediaUrl} 
                        controls 
                        className="w-full h-full object-cover"
                        poster={event.mediaUrl.replace('.mp4', '.jpg')} 
                      />
                    </div>
                  ) : null}
                  
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 transform transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-indigo-500/20">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-bold text-gray-900 dark:text-white tracking-wide">
                      {event.date}
                    </p>
                  </div>
                  
                  {/* Title overlay on image */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight drop-shadow-md">
                      {event.title}
                    </h3>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow relative z-10">
                {!event.mediaUrl && (
                  <div className="mb-4 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-800/50 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">
                      {event.date}
                    </p>
                  </div>
                )}
                
                {/* Regular Title */}
                <h3 className={`text-xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight transition-all duration-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2`}>
                  {event.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow text-sm line-clamp-3">
                  {event.description}
                </p>
                
                {/* Footer Action */}
                {event.link && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto flex items-center justify-between">
                    <a 
                      href={event.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    >
                      <span className="relative">
                        Explore Event
                      </span>
                      <LinkIcon className="w-4 h-4 transition-transform group-hover:-rotate-12" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-200 border-dashed dark:border-gray-700">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Events Found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Check back soon for updates on upcoming conferences, speaking engagements, and events.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Events;
