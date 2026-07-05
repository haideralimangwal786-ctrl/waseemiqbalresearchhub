import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Globe, Briefcase, MessageCircle, Calendar } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as MdIcons from 'react-icons/md';
import { getSectionData } from '../services/api';
import Logo from './Logo';

// Dynamic Icon resolver for social links (Same as Hero)
const getSocialIconByName = (name) => {
  if (!name) return FaIcons.FaLink;

  if (FaIcons[name]) return FaIcons[name];
  if (SiIcons[name]) return SiIcons[name];
  if (MdIcons[name]) return MdIcons[name];
  if (LucideIcons[name]) return LucideIcons[name];

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

// Brand Color configurations for social link hover states (Same as Hero)
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
};

const defaultColorConfig = { textColor: 'text-purple-600 dark:text-purple-400', hoverBg: 'hover:bg-purple-600', hoverBorder: 'hover:border-purple-600', hoverShadow: 'hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]' };

const getSocialColorConfig = (name) => {
  if (!name) return defaultColorConfig;
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return socialColorConfigs[normalized] || defaultColorConfig;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getSectionData('profile');
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch profile for Footer", error);
      }
    };
    fetchProfile();
  }, []);

  // Fallback social links if DB is empty
  const socialLinks = profile?.socialLinks || [
    { platform: "ResearchGate", url: "https://www.researchgate.net/profile/Waseem-Iqbal-11", icon: "SiResearchgate" },
    { platform: "Google Scholar", url: "https://scholar.google.com/citations?user=T2KKbmAAAAAJ&hl=it", icon: "SiGooglescholar" },
    { platform: "ORCID", url: "https://orcid.org/0000-0003-3331-509X", icon: "FaOrcid" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/waseem-iqbal-949183195/", icon: "FaLinkedin" }
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden pt-16 pb-8 mt-8 border-t border-gray-800">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-[90%] max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="inline-block rounded-xl p-1 -ml-1">
              <Logo className="scale-90 origin-left brightness-0 invert opacity-90 transition-all duration-300" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Advancing the frontiers of materials science, environmental sustainability, and clean energy technologies through rigorous research and global scientific collaboration.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((link, index) => {
                const IconComponent = getSocialIconByName(link.icon || link.platform);
                const colorConfig = getSocialColorConfig(link.icon || link.platform);
                return (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={link.platform}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white ${colorConfig.hoverBg} ${colorConfig.hoverBorder} ${colorConfig.hoverShadow} ${colorConfig.textColor}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Research', 'Experience', 'Qualifications', 'Events'].map((item) => (
                <li key={item}>
                  <a href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-400 hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-3 group w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors group-hover:scale-150 duration-300"></span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Focus */}
          <div>
            <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-6 relative inline-block">
              Focus Areas
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-indigo-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {(profile?.researchAreas || ['MOF Technologies', 'Water Remediation', 'Electrocatalysis', 'Membrane Science']).slice(0, 5).map((item) => (
                <li key={item}>
                  <a href={`/research`} className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors flex items-center gap-3 group w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-indigo-400 transition-colors group-hover:scale-150 duration-300"></span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-emerald-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-900/30 transition-colors">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="leading-relaxed mt-1">{profile?.location || 'Center for Sustainable Future Technologies, Istituto Italiano di Tecnologia (IIT), Italy'}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-900/30 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <a href="mailto:waseem.iqbal@iit.it" className="hover:text-emerald-400 font-medium transition-colors">waseem.iqbal@iit.it</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium text-center md:text-left">
            &copy; {currentYear} {profile?.name || 'Dr. Waseem Iqbal'}. All rights reserved.
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-medium text-gray-500">
            <span>Designed & Developed by Haideweb.io</span>
            <a 
              href="https://haiderweb-alpha.vercel.app/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
