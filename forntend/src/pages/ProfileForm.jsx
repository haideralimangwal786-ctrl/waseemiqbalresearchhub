import React, { useState, useEffect, useRef } from 'react';
import { getSectionData, updateSectionData, uploadImage, uploadFile } from '../services/api';
import toast from 'react-hot-toast';
import { Image, User, BarChart3, Link2, Plus, Trash2, Tag, FileText, Upload, ExternalLink, Loader2 } from 'lucide-react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as MdIcons from 'react-icons/md';

// Predefined Icon lists
const predefinedStatIcons = ["BookOpen", "TrendingUp", "Globe", "Award", "Briefcase", "GraduationCap", "Users", "Heart"];
const predefinedSocialIcons = ["SiResearchgate", "SiGooglescholar", "FaOrcid", "FaLinkedin", "MdEmail", "FaWhatsapp", "FaTwitter", "FaGithub", "FaLink"];

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

// Dynamic Icon Preview
const IconPreview = ({ name, className }) => {
  const IconComp = resolveIconComponent(name);
  if (!IconComp) return <span className="text-[10px] text-gray-400 dark:text-gray-500 font-sans shrink-0">Invalid</span>;
  return <IconComp className={className} />;
};

const ProfileForm = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, onConfirm: null, itemName: '' });

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const cvInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getSectionData('profile');
        if (data && data.length > 0) {
          const loadedProfile = data[0];
          // Ensure stats, socialLinks, and researchAreas default to arrays and assign unique IDs
          if (loadedProfile.stats) {
            loadedProfile.stats = loadedProfile.stats.map(s => ({
              ...s,
              id: s.id || s._id || Math.random().toString(36).substr(2, 9)
            }));
          } else {
            loadedProfile.stats = [];
          }
          if (loadedProfile.socialLinks) {
            loadedProfile.socialLinks = loadedProfile.socialLinks.map(l => ({
              ...l,
              id: l.id || l._id || Math.random().toString(36).substr(2, 9)
            }));
          } else {
            loadedProfile.socialLinks = [];
          }
          if (!loadedProfile.researchAreas) {
            loadedProfile.researchAreas = [];
          }
          if (!loadedProfile.cvUrl) {
            loadedProfile.cvUrl = '';
          }
          setProfile(loadedProfile);
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileUpload = async (e, imageField) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading('Uploading image...');
    
    try {
      const response = await uploadImage(file);
      setProfile(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [imageField]: response.url
        }
      }));
      toast.success('Image uploaded successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId });
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Dynamic Stats Handlers using unique 'id'
  const handleAddStat = () => {
    setProfile(prev => ({
      ...prev,
      stats: [
        ...prev.stats,
        { id: Math.random().toString(36).substr(2, 9), label: '', value: '', icon: 'BookOpen' }
      ]
    }));
  };

  const handleRemoveStat = (id) => {
    setProfile(prev => ({
      ...prev,
      stats: prev.stats.filter(stat => stat.id !== id)
    }));
  };

  const handleStatFieldChange = (id, field, value) => {
    setProfile(prev => {
      const newStats = prev.stats.map(stat => {
        if (stat.id === id) {
          return { ...stat, [field]: value };
        }
        return stat;
      });
      return { ...prev, stats: newStats };
    });
  };

  // Dynamic Social Links Handlers using unique 'id'
  const handleAddSocialLink = () => {
    setProfile(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: Math.random().toString(36).substr(2, 9), platform: '', url: '', icon: 'FaLink' }
      ]
    }));
  };

  const handleRemoveSocialLink = (id) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const handleSocialLinkFieldChange = (id, field, value) => {
    setProfile(prev => {
      const newLinks = prev.socialLinks.map(link => {
        if (link.id === id) {
          return { ...link, [field]: value };
        }
        return link;
      });
      return { ...prev, socialLinks: newLinks };
    });
  };

  const handleStatIconSelectChange = (id, selectedValue, currentIconValue) => {
    if (selectedValue === 'custom') {
      const nextVal = predefinedStatIcons.includes(currentIconValue) ? 'Activity' : currentIconValue;
      handleStatFieldChange(id, 'icon', nextVal);
    } else {
      handleStatFieldChange(id, 'icon', selectedValue);
    }
  };

  const handleSocialIconSelectChange = (id, selectedValue, currentIconValue) => {
    if (selectedValue === 'custom') {
      const nextVal = predefinedSocialIcons.includes(currentIconValue) ? 'FaLink' : currentIconValue;
      handleSocialLinkFieldChange(id, 'icon', nextVal);
    } else {
      handleSocialLinkFieldChange(id, 'icon', selectedValue);
    }
  };

  // Dynamic Research Areas handlers
  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed === '') return;
    if (profile.researchAreas.includes(trimmed)) {
      toast.error('Research area tag already exists.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      researchAreas: [...prev.researchAreas, trimmed]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setProfile(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCv(true);
    const toastId = toast.loading('Uploading CV document...');
    
    try {
      const response = await uploadFile(file);
      setProfile(prev => ({
        ...prev,
        cvUrl: response.url
      }));
      toast.success('CV uploaded successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to upload CV', { id: toastId });
      console.error(error);
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Strip client-side temp 'id' fields from the payload before sending
      const cleanStats = profile.stats.map(({ id, _id, ...rest }) => rest);
      const cleanLinks = profile.socialLinks.map(({ id, _id, ...rest }) => rest);

      const payload = {
        ...profile,
        stats: cleanStats,
        socialLinks: cleanLinks
      };

      await updateSectionData('profile', profile._id, payload);
      toast.success('Profile updated successfully!');
      
      // Re-initialize state with clean IDs from DB after save
      const data = await getSectionData('profile');
      if (data && data.length > 0) {
        const loadedProfile = data[0];
        if (loadedProfile.stats) {
          loadedProfile.stats = loadedProfile.stats.map(s => ({
            ...s,
            id: s.id || s._id || Math.random().toString(36).substr(2, 9)
          }));
        } else {
          loadedProfile.stats = [];
        }
        if (loadedProfile.socialLinks) {
          loadedProfile.socialLinks = loadedProfile.socialLinks.map(l => ({
            ...l,
            id: l.id || l._id || Math.random().toString(36).substr(2, 9)
          }));
        } else {
          loadedProfile.socialLinks = [];
        }
        if (!loadedProfile.researchAreas) loadedProfile.researchAreas = [];
        if (!loadedProfile.cvUrl) loadedProfile.cvUrl = '';
        setProfile(loadedProfile);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-20"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  if (!profile) return <div className="text-center p-10 dark:text-white">No profile found. Please seed the database.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Profile Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your public portfolio information</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
        >
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* Images & CV Card */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8 transition-all hover:shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Image className="w-5 h-5" />
            </span>
            Profile Assets & Imagery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Picture</label>
              <div className="flex items-center gap-5 p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                {profile.images?.profilePicture ? (
                  <img src={profile.images.profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover shadow-sm ring-4 ring-white dark:ring-gray-800" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">No Img</div>
                )}
                <div className="flex-1 space-y-2">
                  <input 
                    type="file" accept="image/*" ref={fileInputRef1} onChange={(e) => handleFileUpload(e, 'profilePicture')} disabled={uploadingImage} className="hidden" 
                  />
                  <button type="button" onClick={() => fileInputRef1.current.click()} disabled={uploadingImage} className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer">
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input type="text" name="profilePicture" value={profile.images?.profilePicture || ''} onChange={(e) => handleChange(e, 'images')} placeholder="Or paste URL..." className="w-full px-3 py-1.5 text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none dark:text-gray-400 transition-colors" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Banner</label>
              <div className="flex items-center gap-5 p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                {profile.images?.coverBanner ? (
                  <img src={profile.images.coverBanner} alt="Banner" className="w-24 h-16 rounded-xl object-cover shadow-sm ring-4 ring-white dark:ring-gray-800" />
                ) : (
                  <div className="w-24 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">No Img</div>
                )}
                <div className="flex-1 space-y-2">
                  <input 
                    type="file" accept="image/*" ref={fileInputRef2} onChange={(e) => handleFileUpload(e, 'coverBanner')} disabled={uploadingImage} className="hidden" 
                  />
                  <button type="button" onClick={() => fileInputRef2.current.click()} disabled={uploadingImage} className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer">
                    {uploadingImage ? 'Uploading...' : 'Upload Banner'}
                  </button>
                  <input type="text" name="coverBanner" value={profile.images?.coverBanner || ''} onChange={(e) => handleChange(e, 'images')} placeholder="Or paste URL..." className="w-full px-3 py-1.5 text-xs bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none dark:text-gray-400 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Vitae (CV) Section */}
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Curriculum Vitae (CV) Document</label>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5 p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-w-0 flex-1 md:max-w-md">
                <FileText className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {profile.cvUrl ? profile.cvUrl.split('/').pop() : 'No CV document uploaded yet'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  ref={cvInputRef} 
                  onChange={handleCvUpload} 
                  disabled={uploadingCv} 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => cvInputRef.current.click()} 
                  disabled={uploadingCv} 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer animate__animated animate__fadeIn animate__faster"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingCv ? 'Uploading...' : 'Upload CV'}
                </button>
                {profile.cvUrl && (
                  <a 
                    href={profile.cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-all text-sm font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer animate__animated animate__fadeIn animate__faster"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View CV
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <input 
                type="text" 
                name="cvUrl" 
                value={profile.cvUrl || ''} 
                onChange={(e) => setProfile(prev => ({ ...prev, cvUrl: e.target.value }))} 
                placeholder="Or paste direct CV URL here..." 
                className="w-full px-4 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-all" 
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Supports PDF, DOC, DOCX files up to 10MB.</p>
            </div>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8 transition-all hover:shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <User className="w-5 h-5" />
            </span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
              <input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:text-white transition-all" placeholder="e.g. Dr. Waseem Iqbal" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Job Title</label>
              <input type="text" name="title" value={profile.title || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:text-white transition-all" placeholder="e.g. Professor of Chemistry" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Biography</label>
              <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:text-white transition-all resize-y" placeholder="e.g. I am a passionate researcher focusing on..." required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Institution</label>
              <input type="text" name="institution" value={profile.institution || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:text-white transition-all" placeholder="e.g. Harvard University" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
              <input type="text" name="location" value={profile.location || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:text-white transition-all" placeholder="e.g. Cambridge, MA" required />
            </div>
          </div>
        </div>

        {/* Dynamic Research Areas Card */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8 transition-all hover:shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="p-2.5 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-2xl">
              <Tag className="w-5 h-5" />
            </span>
            Research Areas
          </h3>
          
          <div className="space-y-6">
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter research area (e.g. MOF Research)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className="flex-1 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:text-white transition-all text-sm font-medium"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>

            {profile.researchAreas.length === 0 ? (
              <div className="text-center py-6 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/80">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No research areas added yet. Type an area above and click "Add Tag".</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {profile.researchAreas.map((area, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-sky-500 dark:hover:border-sky-500 transition-colors animate__animated animate__fadeIn animate__faster"
                  >
                    {area}
                    <button
                      type="button"
                      onClick={() => setDeleteConfig({
                        isOpen: true,
                        itemName: 'Research Area',
                        onConfirm: () => handleRemoveTag(area)
                      })}
                      className="w-4.5 h-4.5 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-gray-700 dark:hover:bg-red-600 transition-all flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 cursor-pointer"
                      title={`Remove ${area}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Key Statistics Card */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8 transition-all hover:shadow-md">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl">
                <BarChart3 className="w-5 h-5" />
              </span>
              Key Statistics
            </h3>
            <button
              type="button"
              onClick={handleAddStat}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm font-semibold border border-green-200/50 dark:border-green-800/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Statistic
            </button>
          </div>

          {profile.stats.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/80">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No statistics added yet. Click "Add Statistic" above to insert one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.stats.map((stat) => (
                <div key={stat.id} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full pb-4 border-b border-gray-100 dark:border-gray-700/40 last:border-0 last:pb-0 animate__animated animate__fadeIn animate__faster">
                  <input 
                    type="text" 
                    placeholder="Stat Name (e.g. Publications)"
                    value={stat.label}
                    onChange={(e) => handleStatFieldChange(stat.id, 'label', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all text-sm font-medium"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Value (e.g. 25+)"
                    value={stat.value}
                    onChange={(e) => handleStatFieldChange(stat.id, 'value', e.target.value)}
                    className="w-full md:w-48 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all text-center font-bold text-sm"
                    required
                  />
                  <div className="flex flex-col gap-1 w-full md:w-56">
                    <select
                      value={predefinedStatIcons.includes(stat.icon) ? stat.icon : 'custom'}
                      onChange={(e) => handleStatIconSelectChange(stat.id, e.target.value, stat.icon)}
                      className="w-full appearance-none px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all text-sm cursor-pointer hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow hover:border-gray-300 dark:hover:border-gray-600 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                    >
                      <option value="BookOpen">📖 Publications (BookOpen)</option>
                      <option value="TrendingUp">📈 Citations (TrendingUp)</option>
                      <option value="Globe">🌐 Countries Visited (Globe)</option>
                      <option value="Award">🏆 Awards Recieved (Award)</option>
                      <option value="Briefcase">💼 Work Experience (Briefcase)</option>
                      <option value="GraduationCap">🎓 Education Stats (GraduationCap)</option>
                      <option value="Users">👥 Students Coached (Users)</option>
                      <option value="Heart">❤️ Interests/Hobbies (Heart)</option>
                      <option value="custom">✍️ Custom Icon...</option>
                    </select>

                    {!predefinedStatIcons.includes(stat.icon) && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50/80 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-700/60 animate__animated animate__fadeIn animate__faster">
                        <input
                          type="text"
                          value={stat.icon}
                          onChange={(e) => handleStatFieldChange(stat.id, 'icon', e.target.value)}
                          placeholder="Icon name (e.g. Cpu)"
                          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all shadow-sm"
                        />
                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                          <IconPreview name={stat.icon} className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteConfig({
                      isOpen: true,
                      itemName: 'Statistic',
                      onConfirm: () => handleRemoveStat(stat.id)
                    })}
                    className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-gray-200/50 dark:border-gray-700/80 hover:border-red-200 dark:hover:border-red-800/50 flex items-center justify-center cursor-pointer"
                    title="Delete statistic"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Social Links Card */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-sm rounded-3xl p-8 transition-all hover:shadow-md">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl">
                <Link2 className="w-5 h-5" />
              </span>
              Social Profiles & Links
            </h3>
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors text-sm font-semibold border border-purple-200/50 dark:border-purple-800/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Social Link
            </button>
          </div>

          {profile.socialLinks.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/80">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No social profiles added yet. Click "Add Social Link" above to insert one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.socialLinks.map((link) => (
                <div key={link.id} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center w-full pb-4 border-b border-gray-100 dark:border-gray-700/40 last:border-0 last:pb-0 animate__animated animate__fadeIn animate__faster">
                  <input 
                    type="text" 
                    placeholder="Platform Name (e.g. LinkedIn)"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkFieldChange(link.id, 'platform', e.target.value)}
                    className="w-full md:w-60 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all text-sm font-medium"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Link URL (e.g. https://linkedin.com/in/...)"
                    value={link.url}
                    onChange={(e) => handleSocialLinkFieldChange(link.id, 'url', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all text-sm"
                    required
                  />
                  <div className="flex flex-col gap-1 w-full md:w-56">
                    <select
                      value={predefinedSocialIcons.includes(link.icon) ? link.icon : 'custom'}
                      onChange={(e) => handleSocialIconSelectChange(link.id, e.target.value, link.icon)}
                      className="w-full appearance-none px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all text-sm cursor-pointer hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow hover:border-gray-300 dark:hover:border-gray-600 bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                    >
                      <option value="SiResearchgate">ResearchGate Icon</option>
                      <option value="SiGooglescholar">Google Scholar Icon</option>
                      <option value="FaOrcid">ORCID ID Icon</option>
                      <option value="FaLinkedin">LinkedIn Icon</option>
                      <option value="MdEmail">Email Envelope Icon</option>
                      <option value="FaWhatsapp">WhatsApp Icon</option>
                      <option value="FaTwitter">Twitter / X Icon</option>
                      <option value="FaGithub">GitHub Icon</option>
                      <option value="FaLink">Generic Link Icon</option>
                      <option value="custom">✍️ Custom Icon...</option>
                    </select>

                    {!predefinedSocialIcons.includes(link.icon) && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50/80 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-700/60 animate__animated animate__fadeIn animate__faster">
                        <input
                          type="text"
                          value={link.icon}
                          onChange={(e) => handleSocialLinkFieldChange(link.id, 'icon', e.target.value)}
                          placeholder="Icon name (e.g. FaFacebook)"
                          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all shadow-sm"
                        />
                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                          <IconPreview name={link.icon} className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteConfig({
                      isOpen: true,
                      itemName: 'Social Link',
                      onConfirm: () => handleRemoveSocialLink(link.id)
                    })}
                    className="p-3 text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-gray-200/50 dark:border-gray-700/80 hover:border-red-200 dark:hover:border-red-800/50 flex items-center justify-center cursor-pointer"
                    title="Delete link"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

export default ProfileForm;
