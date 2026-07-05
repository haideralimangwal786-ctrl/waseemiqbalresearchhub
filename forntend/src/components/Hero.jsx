import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, ArrowRight, Download } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as MdIcons from 'react-icons/md';
import { getSectionData } from '../services/api';
import 'animate.css';

// Dynamic Icon resolver for statistics
const getIconByName = (name) => {
  if (!name) return LucideIcons.BookOpen;
  
  // 1. Exact case-sensitive match
  if (LucideIcons[name]) return LucideIcons[name];
  if (FaIcons[name]) return FaIcons[name];
  if (SiIcons[name]) return SiIcons[name];
  if (MdIcons[name]) return MdIcons[name];

  // 2. Normalized/Case-insensitive lookup
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const lucideKey = Object.keys(LucideIcons).find(k => k.toLowerCase() === normalized);
  if (lucideKey) return LucideIcons[lucideKey];

  const faKey = Object.keys(FaIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'fa' + normalized);
  if (faKey) return FaIcons[faKey];

  const siKey = Object.keys(SiIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'si' + normalized);
  if (siKey) return SiIcons[siKey];

  const mdKey = Object.keys(MdIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'md' + normalized);
  if (mdKey) return MdIcons[mdKey];

  return LucideIcons.BookOpen;
};

// Dynamic Icon resolver for social links
const getSocialIconByName = (name) => {
  if (!name) return FaIcons.FaLink;

  // 1. Exact case-sensitive match
  if (FaIcons[name]) return FaIcons[name];
  if (SiIcons[name]) return SiIcons[name];
  if (MdIcons[name]) return MdIcons[name];
  if (LucideIcons[name]) return LucideIcons[name];

  // 2. Normalized/Case-insensitive lookup
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const faKey = Object.keys(FaIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'fa' + normalized);
  if (faKey) return FaIcons[faKey];

  const siKey = Object.keys(SiIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'si' + normalized);
  if (siKey) return SiIcons[siKey];

  const mdKey = Object.keys(MdIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'md' + normalized);
  if (mdKey) return MdIcons[mdKey];

  const lucideKey = Object.keys(LucideIcons).find(k => k.toLowerCase() === normalized);
  if (lucideKey) return LucideIcons[lucideKey];

  return FaIcons.FaLink;
};

// Brand Color configurations for social link hover states
const socialColorConfigs = {
  researchgate: { textColor: 'text-teal-600 dark:text-teal-400', hoverBg: 'hover:bg-teal-600', hoverBorder: 'hover:border-teal-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(13,148,136,0.5)]' },
  siresearchgate: { textColor: 'text-teal-600 dark:text-teal-400', hoverBg: 'hover:bg-teal-600', hoverBorder: 'hover:border-teal-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(13,148,136,0.5)]' },
  
  googlescholar: { textColor: 'text-blue-600 dark:text-blue-400', hoverBg: 'hover:bg-blue-600', hoverBorder: 'hover:border-blue-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]' },
  sigooglescholar: { textColor: 'text-blue-600 dark:text-blue-400', hoverBg: 'hover:bg-blue-600', hoverBorder: 'hover:border-blue-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]' },

  orcid: { textColor: 'text-green-600 dark:text-green-400', hoverBg: 'hover:bg-green-500', hoverBorder: 'hover:border-green-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
  faorcid: { textColor: 'text-green-600 dark:text-green-400', hoverBg: 'hover:bg-green-500', hoverBorder: 'hover:border-green-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]' },

  linkedin: { textColor: 'text-blue-700 dark:text-blue-500', hoverBg: 'hover:bg-blue-700', hoverBorder: 'hover:border-blue-700', hoverShadow: 'hover:shadow-[0_0_15px_rgba(29,78,216,0.5)]' },
  falinkedin: { textColor: 'text-blue-700 dark:text-blue-500', hoverBg: 'hover:bg-blue-700', hoverBorder: 'hover:border-blue-700', hoverShadow: 'hover:shadow-[0_0_15px_rgba(29,78,216,0.5)]' },

  email: { textColor: 'text-red-500 dark:text-red-400', hoverBg: 'hover:bg-red-500', hoverBorder: 'hover:border-red-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
  mdemail: { textColor: 'text-red-500 dark:text-red-400', hoverBg: 'hover:bg-red-500', hoverBorder: 'hover:border-red-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]' },

  whatsapp: { textColor: 'text-emerald-600 dark:text-emerald-400', hoverBg: 'hover:bg-emerald-500', hoverBorder: 'hover:border-emerald-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  fawhatsapp: { textColor: 'text-emerald-600 dark:text-emerald-400', hoverBg: 'hover:bg-emerald-500', hoverBorder: 'hover:border-emerald-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]' },

  twitter: { textColor: 'text-sky-500 dark:text-sky-400', hoverBg: 'hover:bg-sky-500', hoverBorder: 'hover:border-sky-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(14,165,233,0.5)]' },
  fatwitter: { textColor: 'text-sky-500 dark:text-sky-400', hoverBg: 'hover:bg-sky-500', hoverBorder: 'hover:border-sky-500', hoverShadow: 'hover:shadow-[0_0_15px_rgba(14,165,233,0.5)]' },

  github: { textColor: 'text-gray-800 dark:text-gray-200', hoverBg: 'hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900', hoverBorder: 'hover:border-gray-900 dark:hover:border-white', hoverShadow: 'hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]' },
  fagithub: { textColor: 'text-gray-800 dark:text-gray-200', hoverBg: 'hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900', hoverBorder: 'hover:border-gray-900 dark:hover:border-white', hoverShadow: 'hover:shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]' },

  facebook: { textColor: 'text-blue-600 dark:text-blue-400', hoverBg: 'hover:bg-blue-600', hoverBorder: 'hover:border-blue-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]' },
  fafacebook: { textColor: 'text-blue-600 dark:text-blue-400', hoverBg: 'hover:bg-blue-600', hoverBorder: 'hover:border-blue-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]' },

  youtube: { textColor: 'text-red-600 dark:text-red-500', hoverBg: 'hover:bg-red-600', hoverBorder: 'hover:border-red-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]' },
  fayoutube: { textColor: 'text-red-600 dark:text-red-500', hoverBg: 'hover:bg-red-600', hoverBorder: 'hover:border-red-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]' },

  instagram: { textColor: 'text-pink-600 dark:text-pink-400', hoverBg: 'hover:bg-pink-600', hoverBorder: 'hover:border-pink-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(219,39,119,0.5)]' },
  fainstagram: { textColor: 'text-pink-600 dark:text-pink-400', hoverBg: 'hover:bg-pink-600', hoverBorder: 'hover:border-pink-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(219,39,119,0.5)]' }
};

const defaultColorConfig = { textColor: 'text-purple-600 dark:text-purple-400', hoverBg: 'hover:bg-purple-600', hoverBorder: 'hover:border-purple-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]' };

const getSocialColorConfig = (name) => {
  if (!name) return defaultColorConfig;
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return socialColorConfigs[normalized] || defaultColorConfig;
};

// Premium alternating colors for stats bar
const statColors = [
  { text: 'from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400', bg: 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400', glow: 'shadow-blue-900/5 hover:shadow-blue-500/10 border-slate-100 dark:border-gray-700' },
  { text: 'from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400', bg: 'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400', glow: 'shadow-teal-900/5 hover:shadow-teal-500/10 border-slate-100 dark:border-gray-700' },
  { text: 'from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400', bg: 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400', glow: 'shadow-indigo-900/5 hover:shadow-indigo-500/10 border-slate-100 dark:border-gray-700' },
  { text: 'from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400', bg: 'bg-amber-50 dark:bg-amber-900/40 text-amber-500 dark:text-amber-400', glow: 'shadow-amber-900/5 hover:shadow-amber-500/10 border-slate-100 dark:border-gray-700' }
];

const getStatColor = (index) => statColors[index % statColors.length];

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getSectionData('profile');
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);


  // Fallback profile object in array structure
  const p = profile || {
    name: "",
    title: "",
    bio: "",
    institution: "",
    location: "",
    stats: [],
    socialLinks: [],
    researchAreas: [],
    images: {
      profilePicture: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
      coverBanner: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    }
  };

  return (
    <section id="home" className="relative bg-slate-50 dark:bg-gray-900 pt-20">
      
      {/* 1. Full-Width Cover Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-[400px] overflow-hidden">
        <img 
          src={p.images?.coverBanner || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=80"} 
          alt="Science Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-gray-900 via-transparent to-transparent opacity-90"></div>
      </div>

      {/* 2. Main Content Area */}
      <div className="relative z-10 w-[90%] mx-auto pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Profile Picture & Socials */}
          <div className="flex-shrink-0 -mt-24 md:-mt-32 relative z-20 flex flex-col items-center lg:items-start animate__animated animate__fadeInUp">
            <div className="p-2 bg-slate-50 dark:bg-gray-900 rounded-[2.5rem] shadow-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2.5rem] blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <img 
                src={p.images?.profilePicture || "/profile.jpeg"} 
                alt={p.name}
                className="relative z-10 w-48 h-60 md:w-64 md:h-[20rem] object-cover object-top rounded-3xl border-4 border-slate-50 dark:border-gray-900 shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=1000&q=80"; }}
              />
            </div>

            {/* Dynamic Social Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 max-w-[256px] w-full px-1">
              {p.socialLinks?.map((link, index) => {
                const IconComponent = getSocialIconByName(link.icon || link.platform);
                const colorConfig = getSocialColorConfig(link.icon || link.platform);
                return (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={link.platform}
                    className={`flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white ${colorConfig.hoverBg} ${colorConfig.hoverBorder} ${colorConfig.hoverShadow} ${colorConfig.textColor}`}
                  >
                    <IconComponent className="w-5.5 h-5.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="pt-2 lg:pt-8 flex-1 text-center lg:text-left animate__animated animate__fadeInRight">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-3">
              {p.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6">
              {p.title}
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 text-gray-600 dark:text-gray-300 font-medium">
              <span className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-500" />
                {p.institution}
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                {p.location}
              </span>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {p.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10">
              {(p.researchAreas || []).map((area, index) => (
                <span key={index} className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
                  {area}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link to="/research" className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Explore Research
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={p.cvUrl || "/Waseem CV-N.pdf"} target="_blank" rel="noopener noreferrer" download="Waseem_Iqbal_CV.pdf" className="px-6 py-3.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold text-base border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 shadow-sm flex items-center gap-2">
                <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Premium Summary Statistics Bar */}
      {p.stats && p.stats.length > 0 && (
        <div className="relative z-10 w-[95%] max-w-6xl mx-auto mt-4 pb-20">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(p.stats.length, 4)} gap-6 lg:gap-8 animate__animated animate__fadeInUp animate__delay-1s`}>
            {p.stats.map((stat, index) => {
              const IconComponent = getIconByName(stat.icon);
              const colorTheme = getStatColor(index);
              return (
                <div 
                  key={index} 
                  className={`relative group p-8 bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl ${colorTheme.glow} border transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl ${colorTheme.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${colorTheme.text} mb-2 drop-shadow-sm`}>
                      {stat.value}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
