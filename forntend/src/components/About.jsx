import React, { useState, useEffect } from 'react';
import { Quote, CheckCircle2, MapPin, Beaker , Loader2} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as MdIcons from 'react-icons/md';
import { getSectionData } from '../services/api';
import 'animate.css';

// Dynamic Icon resolver for Journey
const getJourneyIconByName = (name) => {
  if (!name) return LucideIcons.Globe;
  
  if (LucideIcons[name]) return LucideIcons[name];
  if (FaIcons[name]) return FaIcons[name];
  if (SiIcons[name]) return SiIcons[name];
  if (MdIcons[name]) return MdIcons[name];

  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const lucideKey = Object.keys(LucideIcons).find(k => k.toLowerCase() === normalized);
  if (lucideKey) return LucideIcons[lucideKey];
  const faKey = Object.keys(FaIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'fa' + normalized);
  if (faKey) return FaIcons[faKey];

  return LucideIcons.Globe;
};

// Premium alternating colors for journey items
const journeyColors = [
  { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-white dark:bg-gray-800', hoverBg: 'group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white' },
  { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-white dark:bg-gray-800', hoverBg: 'group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white' },
  { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-white dark:bg-gray-800', hoverBg: 'group-hover:bg-purple-600 dark:group-hover:bg-purple-500 group-hover:text-white' },
];

const getJourneyColor = (index) => journeyColors[index % journeyColors.length];

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getSectionData('about');
        if (data && data.length > 0) {
          setAbout(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch about data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);


  // Fallback data if none exists
  const a = about || {
    visionStatement: "",
    aboutName: "Dr. Waseem Iqbal",
    aboutLocation: "",
    aboutImage: "/about-profile.jpeg",
    researchFocus: [],
    coreCompetencies: [],
    academicJourney: []
  };

  return (
    <section id="about" className="pt-32 pb-24 bg-slate-50 dark:bg-gray-900 min-h-screen relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-bl from-blue-100/50 dark:from-blue-900/20 to-transparent pointer-events-none"></div>
      
      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 text-center animate__animated animate__fadeInUp">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Me</span>
          </h2>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
          
          {/* 1. VISION CARD (Col Span 2) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-blue-900 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-10 shadow-xl shadow-blue-900/10 flex flex-col justify-center relative overflow-hidden group animate__animated animate__fadeInUp">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
               <Quote className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4">The Vision</h3>
            <p className="text-2xl md:text-3xl font-medium text-white leading-snug relative z-10 max-w-2xl">
              "{a.visionStatement}"
            </p>
          </div>

          {/* 2. PHOTO CARD (Col Span 1, Row Span 2 on Desktop) */}
          <div className="lg:col-span-1 lg:row-span-2 rounded-3xl overflow-hidden relative shadow-xl shadow-gray-200/50 dark:shadow-none animate__animated animate__fadeInUp animate__delay-1s group min-h-[350px]">
            <img src={a.aboutImage || "/about-profile.jpeg"} alt={a.aboutName} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=1000&q=80" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
               <h3 className="text-2xl font-bold text-white mb-1">{a.aboutName}</h3>
               <p className="text-blue-300 flex items-center gap-2 text-sm font-medium"><MapPin className="w-4 h-4"/> {a.aboutLocation}</p>
            </div>
          </div>

          {/* 3. BIO CARD (Col Span 2) */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none animate__animated animate__fadeInUp animate__delay-1s">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Beaker className="w-6 h-6 text-blue-500" /> Research Focus
            </h3>
            <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {a.researchFocus && a.researchFocus.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* 4. SKILLS BENTO (Col Span 1) */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none animate__animated animate__fadeInUp animate__delay-2s">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Core Competencies</h3>
            <div className="flex flex-col gap-4">
              {a.coreCompetencies && a.coreCompetencies.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700/30 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-gray-600/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. TIMELINE BENTO (Col Span 2) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-gray-800 rounded-3xl p-8 md:p-10 border border-blue-100/50 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none animate__animated animate__fadeInUp animate__delay-2s">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Academic Journey</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {a.academicJourney && a.academicJourney.map((journey, index) => {
                 const JourneyIcon = getJourneyIconByName(journey.icon);
                 const colorTheme = getJourneyColor(index);
                 return (
                   <div key={index} className="relative group">
                      <div className={`w-12 h-12 rounded-2xl shadow-md flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${colorTheme.bg} ${colorTheme.text} ${colorTheme.hoverBg}`}>
                        <JourneyIcon className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{journey.title}</h4>
                      <p className={`text-xs font-bold uppercase tracking-wider mt-1 mb-2 ${colorTheme.text}`}>{journey.subtitle}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{journey.description}</p>
                   </div>
                 );
               })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
