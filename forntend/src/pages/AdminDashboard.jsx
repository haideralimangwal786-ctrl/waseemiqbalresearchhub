import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../services/api';
import { LogOut, LayoutDashboard, Briefcase, BookOpen, Award, CheckCircle, GraduationCap, User, Info, Mail, Settings, Calendar, ShieldCheck, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileForm from './ProfileForm';
import AboutForm from './AboutForm';
import ResearchForm from './ResearchForm';
import ExperienceForm from './ExperienceForm';
import QualificationForm from './QualificationForm';
import ContactForm from './ContactForm';
import SettingsForm from './SettingsForm';
import EventForm from './EventForm';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'home';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update localStorage whenever tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('adminActiveTab', tabId);
    setIsMobileMenuOpen(false);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    toast.success('Securely logged out');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'home', label: 'Home Profile', icon: User },
    { id: 'about', label: 'About Me', icon: Info },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'research', label: 'Research Hub', icon: BookOpen },
    { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
    { id: 'events', label: 'Events Hub', icon: Calendar },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <ProfileForm />;
      case 'about': return <AboutForm />;
      case 'research': return <ResearchForm />;
      case 'experience': return <ExperienceForm />;
      case 'qualifications': return <QualificationForm />;
      case 'events': return <EventForm />;
      case 'contact': return <ContactForm />;
      case 'settings': return <SettingsForm />;
      default:
        return (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 min-h-[500px] flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Select a section from the sidebar.</p>
          </div>
        );
    }
  };

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Glassmorphic Sidebar */}
      <div className={`fixed inset-y-0 right-0 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:left-auto md:right-auto md:relative md:translate-x-0 w-72 bg-white/95 dark:bg-gray-900/95 md:bg-white/70 md:dark:bg-gray-900/60 backdrop-blur-2xl border-l md:border-l-0 md:border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.05)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300 ease-in-out`}>
        
        {/* Mobile Close Button */}
        <div className="md:hidden absolute top-4 left-4">
           <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
             <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
           </button>
        </div>

        {/* Brand Area */}
        <div className="p-8 flex items-center gap-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform transition-transform hover:scale-105">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
              Control Panel
            </h1>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Admin Access</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'text-white shadow-md shadow-indigo-500/25 border border-indigo-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {/* Active Gradient Background */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-100 transition-opacity"></div>
                  )}
                  
                  {/* Icon & Label (relative to stay above absolute bg) */}
                  <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`} />
                  <span className="relative z-10 tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Area */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-2xl transition-all duration-300 font-bold border border-red-100 dark:border-red-900/30 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto relative z-10 scroll-smooth flex flex-col w-full md:w-auto">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Form Content */}
        <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto w-full animate__animated animate__fadeIn">
          {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
