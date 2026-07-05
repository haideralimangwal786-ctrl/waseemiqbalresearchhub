import React, { useState, useEffect, useRef } from 'react';
import { getSectionData, updateSectionData, uploadImage } from '../services/api';
import toast from 'react-hot-toast';
import { Image, User, CheckCircle2, MapPin, Quote, Plus, Trash2, Milestone, BookOpen, Info, Loader2 } from 'lucide-react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as MdIcons from 'react-icons/md';

// Predefined Icon list for Journey
const predefinedJourneyIcons = ["Globe", "GraduationCap", "Award", "Briefcase", "BookOpen", "Microscope", "Beaker", "Users"];

// Dynamic Icon resolver
const resolveIconComponent = (name) => {
  if (!name) return null;
  if (LucideIcons[name]) return LucideIcons[name];
  if (FaIcons[name]) return FaIcons[name];
  if (SiIcons[name]) return SiIcons[name];
  if (MdIcons[name]) return MdIcons[name];

  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const lucideKey = Object.keys(LucideIcons).find(k => k.toLowerCase() === normalized);
  if (lucideKey) return LucideIcons[lucideKey];

  const faKey = Object.keys(FaIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'fa' + normalized);
  if (faKey) return FaIcons[faKey];

  const siKey = Object.keys(SiIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'si' + normalized);
  if (siKey) return SiIcons[siKey];

  const mdKey = Object.keys(MdIcons).find(k => k.toLowerCase() === normalized || k.toLowerCase() === 'md' + normalized);
  if (mdKey) return MdIcons[mdKey];

  return null;
};

const IconPreview = ({ name, className }) => {
  const IconComp = resolveIconComponent(name);
  if (!IconComp) return <span className="text-[10px] text-gray-400 dark:text-gray-500 font-sans shrink-0">Invalid</span>;
  return <IconComp className={className} />;
};

const AboutForm = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [newCompetency, setNewCompetency] = useState('');
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, onConfirm: null, itemName: '' });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getSectionData('about');
        if (data && data.length > 0) {
          const loadedAbout = data[0];
          
          if (!loadedAbout.researchFocus) loadedAbout.researchFocus = [];
          if (!loadedAbout.coreCompetencies) loadedAbout.coreCompetencies = [];
          
          if (loadedAbout.academicJourney) {
            loadedAbout.academicJourney = loadedAbout.academicJourney.map(j => ({
              ...j,
              id: j.id || j._id || Math.random().toString(36).substr(2, 9)
            }));
          } else {
            loadedAbout.academicJourney = [];
          }
          
          setAbout(loadedAbout);
        }
      } catch (error) {
        toast.error('Failed to load about data');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading('Uploading image...');
    
    try {
      const response = await uploadImage(file);
      setAbout(prev => ({
        ...prev,
        aboutImage: response.url
      }));
      toast.success('Image uploaded successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId });
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAbout(prev => ({ ...prev, [name]: value }));
  };

  // Research Focus Handlers
  const handleResearchFocusChange = (index, value) => {
    setAbout(prev => {
      const newFocus = [...prev.researchFocus];
      newFocus[index] = value;
      return { ...prev, researchFocus: newFocus };
    });
  };

  const handleAddResearchFocus = () => {
    setAbout(prev => ({
      ...prev,
      researchFocus: [...prev.researchFocus, '']
    }));
  };

  const handleRemoveResearchFocus = (index) => {
    setAbout(prev => {
      const newFocus = prev.researchFocus.filter((_, i) => i !== index);
      return { ...prev, researchFocus: newFocus };
    });
  };

  // Core Competencies Handlers
  const handleAddCompetency = () => {
    const trimmed = newCompetency.trim();
    if (trimmed === '') return;
    if (about.coreCompetencies.includes(trimmed)) {
      toast.error('Competency already exists.');
      return;
    }
    setAbout(prev => ({
      ...prev,
      coreCompetencies: [...prev.coreCompetencies, trimmed]
    }));
    setNewCompetency('');
  };

  const handleRemoveCompetency = (compToRemove) => {
    setAbout(prev => ({
      ...prev,
      coreCompetencies: prev.coreCompetencies.filter(c => c !== compToRemove)
    }));
  };

  // Academic Journey Handlers
  const handleAddJourney = () => {
    setAbout(prev => ({
      ...prev,
      academicJourney: [
        ...prev.academicJourney,
        { id: Math.random().toString(36).substr(2, 9), icon: 'GraduationCap', title: '', subtitle: '', description: '' }
      ]
    }));
  };

  const handleRemoveJourney = (id) => {
    setAbout(prev => ({
      ...prev,
      academicJourney: prev.academicJourney.filter(j => j.id !== id)
    }));
  };

  const handleJourneyChange = (id, field, value) => {
    setAbout(prev => {
      const newJourney = prev.academicJourney.map(j => {
        if (j.id === id) return { ...j, [field]: value };
        return j;
      });
      return { ...prev, academicJourney: newJourney };
    });
  };

  const handleJourneyIconSelectChange = (id, selectedValue, currentIconValue) => {
    if (selectedValue === 'custom') {
      const nextVal = predefinedJourneyIcons.includes(currentIconValue) ? 'Activity' : currentIconValue;
      handleJourneyChange(id, 'icon', nextVal);
    } else {
      handleJourneyChange(id, 'icon', selectedValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanJourney = about.academicJourney.map(({ id, _id, ...rest }) => rest);
      const payload = { ...about, academicJourney: cleanJourney };

      await updateSectionData('about', about._id, payload);
      toast.success('About section updated successfully!');
      
      const data = await getSectionData('about');
      if (data && data.length > 0) {
        const loadedAbout = data[0];
        if (loadedAbout.academicJourney) {
          loadedAbout.academicJourney = loadedAbout.academicJourney.map(j => ({
            ...j,
            id: j.id || j._id || Math.random().toString(36).substr(2, 9)
          }));
        } else {
          loadedAbout.academicJourney = [];
        }
        setAbout(loadedAbout);
      }
    } catch (error) {
      console.error('About update failed:', error);
      toast.error(error.message || 'Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  if (!about) return <div className="text-center p-10 dark:text-white">No data found. Please seed the database.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Info className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            About Me Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your biographical information, vision, and timeline.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* Basic Information & Image */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <User className="w-5 h-5" />
            </span>
            Basic Details & Photo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">About Photo</label>
              <div className="flex items-center gap-5 p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                {about.aboutImage ? (
                  <img src={about.aboutImage} alt="About" className="w-24 h-24 rounded-xl object-cover shadow-sm ring-4 ring-white dark:ring-gray-800" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">No Img</div>
                )}
                <div className="flex-1 space-y-2">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} disabled={uploadingImage} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploadingImage} className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold shadow-sm border border-gray-200 dark:border-gray-600">
                    {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  <input type="text" name="aboutImage" value={about.aboutImage || ''} onChange={handleChange} placeholder="Or paste URL..." className="w-full px-3 py-1.5 text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none dark:text-gray-400 transition-colors" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <input type="text" name="aboutName" value={about.aboutName || ''} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white" placeholder="e.g. Dr. Waseem Iqbal" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Location</label>
                <input type="text" name="aboutLocation" value={about.aboutLocation || ''} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white" placeholder="e.g. Cambridge, MA" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Vision Statement</label>
            <textarea name="visionStatement" value={about.visionStatement || ''} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white resize-y" placeholder="e.g. I am driven by the pursuit of discovering..." required />
          </div>
        </div>

        {/* Research Focus */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <BookOpen className="w-5 h-5" />
              </span>
              Research Focus (Paragraphs)
            </h3>
            <button type="button" onClick={handleAddResearchFocus} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm font-semibold border border-indigo-200/50 dark:border-indigo-800/30">
              <Plus className="w-4 h-4" /> Add Paragraph
            </button>
          </div>
          
          <div className="space-y-4">
            {about.researchFocus.map((paragraph, index) => (
              <div key={index} className="flex gap-3">
                <textarea
                  value={paragraph}
                  onChange={(e) => handleResearchFocusChange(index, e.target.value)}
                  rows="3"
                  className="flex-1 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                  placeholder="Enter paragraph text..."
                />
                <button type="button" onClick={() => setDeleteConfig({ isOpen: true, itemName: 'Paragraph', onConfirm: () => handleRemoveResearchFocus(index) })} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-gray-200 dark:border-gray-700 self-start">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Competencies */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            Core Competencies
          </h3>
          
          <div className="space-y-6">
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter competency (e.g. Water Remediation)"
                value={newCompetency}
                onChange={(e) => setNewCompetency(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompetency(); } }}
                className="flex-1 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              />
              <button type="button" onClick={handleAddCompetency} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold">
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {about.coreCompetencies.map((comp, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm">
                  {comp}
                  <button type="button" onClick={() => setDeleteConfig({ isOpen: true, itemName: 'Competency', onConfirm: () => handleRemoveCompetency(comp) })} className="w-4.5 h-4.5 rounded-full hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Journey */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl">
                <Milestone className="w-5 h-5" />
              </span>
              Academic Journey
            </h3>
            <button type="button" onClick={handleAddJourney} className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm font-semibold border border-purple-200/50 dark:border-purple-800/30">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-6">
            {about.academicJourney.map(journey => (
              <div key={journey.id} className="p-5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-2xl relative">
                <button type="button" onClick={() => setDeleteConfig({ isOpen: true, itemName: 'Journey Item', onConfirm: () => handleRemoveJourney(journey.id) })} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-12">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input type="text" value={journey.title} onChange={(e) => handleJourneyChange(journey.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 dark:text-white" placeholder="e.g. Ph.D. in Chemistry" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (e.g. Places/Years)</label>
                    <input type="text" value={journey.subtitle} onChange={(e) => handleJourneyChange(journey.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 dark:text-white" placeholder="e.g. Harvard University (2020-2024)" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea value={journey.description} onChange={(e) => handleJourneyChange(journey.id, 'description', e.target.value)} rows="2" className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 dark:text-white resize-y" placeholder="e.g. Focused on synthesizing novel MOFs..." required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon Style</label>
                    <div className="flex flex-col gap-1 w-full">
                      <select
                        value={predefinedJourneyIcons.includes(journey.icon) ? journey.icon : 'custom'}
                        onChange={(e) => handleJourneyIconSelectChange(journey.id, e.target.value, journey.icon)}
                        className="w-full appearance-none px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all text-sm cursor-pointer hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow hover:border-gray-300 dark:hover:border-gray-600 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                      >
                        <option value="Globe">🌍 Global/Travel (Globe)</option>
                        <option value="GraduationCap">🎓 Education (GraduationCap)</option>
                        <option value="Award">🏆 Award/Achievement (Award)</option>
                        <option value="Briefcase">💼 Work/Position (Briefcase)</option>
                        <option value="BookOpen">📖 Publication (BookOpen)</option>
                        <option value="Microscope">🔬 Research (Microscope)</option>
                        <option value="Beaker">🧪 Lab Work (Beaker)</option>
                        <option value="Users">👥 Collaboration (Users)</option>
                        <option value="custom">✍️ Custom Icon...</option>
                      </select>

                      {!predefinedJourneyIcons.includes(journey.icon) && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50/80 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-700/60 animate__animated animate__fadeIn animate__faster">
                          <input
                            type="text"
                            value={journey.icon}
                            onChange={(e) => handleJourneyChange(journey.id, 'icon', e.target.value)}
                            placeholder="Icon name (e.g. Activity)"
                            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all shadow-sm"
                          />
                          <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                            <IconPreview name={journey.icon} className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>

      <DeleteConfirmModal 
        isOpen={deleteConfig.isOpen} 
        onClose={() => setDeleteConfig({ ...deleteConfig, isOpen: false })} 
        onConfirm={deleteConfig.onConfirm} 
        itemName={deleteConfig.itemName} 
      />
    </div>
  );
};

export default AboutForm;
