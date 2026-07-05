import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Home, User, Microscope, BookOpen, Users, MailIcon, Globe, Award, Download, Calendar } from 'lucide-react';
import Logo from './Logo';
import { getSectionData } from '../services/api';
import 'animate.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const location = useLocation();

  // Handle scroll effect and fetch CV
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchProfile = async () => {
      try {
        const data = await getSectionData('profile');
        if (data && data.length > 0 && data[0].cvUrl) {
          setCvUrl(data[0].cvUrl);
        }
      } catch (err) {
        console.error("Failed to fetch CV link for Navbar", err);
      }
    };
    fetchProfile();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: User },
    { name: 'Research', href: '/research', icon: Microscope },
    { name: 'Experience', href: '/experience', icon: BookOpen },
    { name: 'Qualifications', href: '/qualifications', icon: Award },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Contact', href: '/contact', icon: MailIcon },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-gray-200/50 dark:border-gray-800/50 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="w-[98%] max-w-none mx-auto">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 z-50">
            <Link to="/">
              <Logo className={`transition-transform duration-500 origin-left ${isScrolled ? 'scale-85' : 'scale-100'}`} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-2">
            <div className="flex items-center gap-6 2xl:gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative py-2 flex items-center gap-2 text-sm xl:text-base font-bold transition-colors duration-300 group ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 xl:w-5 xl:h-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className="tracking-wide">{link.name}</span>
                    {/* Animated Underline */}
                    <span 
                      className={`absolute bottom-0 left-0 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center z-50">
            <a 
              href={cvUrl || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-2 px-6 py-2.5 overflow-hidden font-bold tracking-wide text-white bg-blue-600 rounded-full group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-indigo-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="relative flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CV
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-900 dark:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8 transition-transform rotate-90" />
              ) : (
                <Menu className="w-8 h-8 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="xl:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={`xl:hidden fixed top-0 right-0 z-50 h-screen w-[280px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl transition-transform duration-500 ease-out border-l border-gray-200/50 dark:border-gray-800/50 flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col px-6 py-4 space-y-4 overflow-y-auto flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-semibold text-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <a 
            href={cvUrl || "#"} 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download CV
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
