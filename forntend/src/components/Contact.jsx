import React, { useState } from 'react';
import { Mail, Phone, MapPin, Building2, Users, GraduationCap, Send, Download, Globe2 , Loader2} from 'lucide-react';
import 'animate.css';

import { getSectionData } from '../services/api';

const Contact = () => {
  const [loading, setLoading] = React.useState(true);
  const [contactInfo, setContactInfo] = useState({
    description1: 'I am always open to discussing research collaborations, postdoctoral opportunities, and scientific consulting.',
    description2: 'Please feel free to reach out using the form below or via my direct contact information.',
    email: 'waseem.iqbal@iit.it',
    phone: '+39 010 8172 254',
    address: 'Istituto Italiano di Tecnologia, Via Morego, 30, 16163 Genova, Italy',
    officeHours: 'Monday - Friday, 9:00 AM - 5:00 PM (CET)',
    locationLink: 'https://maps.app.goo.gl/r6H9PqWdJmBqTzT29'
  });
  const [referencesData, setReferencesData] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    subject: '',
    message: ''
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactData, refsData] = await Promise.all([
          getSectionData('contact_info'),
          getSectionData('references')
        ]);
        if (contactData && contactData.length > 0) {
          setContactInfo(contactData[0]);
        }
        setReferencesData(refsData.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Failed to load contact data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submit handler
    alert("Thank you for your message! Dr. Iqbal will get back to you soon.");
    setFormData({ name: '', email: '', institution: '', subject: '', message: '' });
  };


  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-gray-900 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>

      <div className="w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate__animated animate__fadeInUp">
          <p className="text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase mb-3 text-sm tracking-[0.2em]">Get in Touch</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            References & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Contact</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-6">
            {contactInfo.description1}
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {contactInfo.description2}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Contact Info & Form */}
          <div className="lg:col-span-7 space-y-12 animate__animated animate__fadeInUp">
            
            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Email</h4>
                <div className="space-y-2">
                  <a href={`mailto:${contactInfo.emailPrimary}`} className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {contactInfo.emailPrimary} <span className="text-xs text-gray-400 ml-1">({contactInfo.emailPrimaryLabel})</span>
                  </a>
                  {contactInfo.emailSecondary && (
                    <a href={`mailto:${contactInfo.emailSecondary}`} className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {contactInfo.emailSecondary} <span className="text-xs text-gray-400 ml-1">({contactInfo.emailSecondaryLabel})</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Phone</h4>
                <div className="space-y-2">
                  <a href={`tel:${contactInfo.phonePrimary}`} className="block text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {contactInfo.phonePrimary} <span className="text-xs text-gray-400 ml-1">({contactInfo.phonePrimaryLabel})</span>
                  </a>
                  {contactInfo.phoneSecondary && (
                    <a href={`tel:${contactInfo.phoneSecondary}`} className="block text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {contactInfo.phoneSecondary} <span className="text-xs text-gray-400 ml-1">({contactInfo.phoneSecondaryLabel})</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Affiliation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {contactInfo.affiliation}
                </p>
              </div>

            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-shadow" placeholder="Dr. John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-shadow" placeholder="john@university.edu" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Institution / Organization</label>
                    <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-shadow" placeholder="University Name" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-shadow" placeholder="Research Collaboration" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-shadow resize-none" placeholder="How can we collaborate..."></textarea>
                </div>

                <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-500/30">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Academic References */}
          <div className="lg:col-span-5 space-y-6 animate__animated animate__fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-8 pl-2">
              <Users className="w-6 h-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Academic References</h3>
            </div>

            {referencesData.map((ref, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:-translate-y-1 transition-transform group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ref.name}</h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">{ref.position}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {ref.role}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{ref.institution}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${ref.email}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {ref.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-center text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe2 className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Let's Collaborate</h3>
              <p className="text-blue-100 mb-8 relative z-10 text-sm leading-relaxed max-w-sm mx-auto">
                Advancing materials science, environmental sustainability, and clean energy technologies through global scientific partnerships and innovation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <a href="/DrWaseemIqbal_CV.pdf" download className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold transition-colors">
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
