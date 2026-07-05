import React, { useState, useEffect } from 'react';
import { getSectionData, createSectionData, updateSectionData, deleteSectionData } from '../services/api';
import toast from 'react-hot-toast';
import { 
  GraduationCap, Globe, Cpu, Award, 
  Plus, Trash2, Edit2, X, AlertTriangle, 
  MapPin, Calendar, Building2, CheckCircle2 
, Loader2} from 'lucide-react';

const QualificationForm = () => {
  const [activeSubTab, setActiveSubTab] = useState('education');
  
  // Data States
  const [educationData, setEducationData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [awardsData, setAwardsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const subTabs = [
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'training', label: 'Global Training', icon: Globe },
    { id: 'skills', label: 'Technical Skills', icon: Cpu },
    { id: 'awards', label: 'Awards & Honors', icon: Award },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [edu, trn, skl, awd] = await Promise.all([
        getSectionData('education'),
        getSectionData('training'),
        getSectionData('skills'),
        getSectionData('awards')
      ]);
      setEducationData(edu);
      setTrainingData(trn);
      setSkillsData(skl);
      setAwardsData(awd);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load Qualifications data');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Helpers ---
  const openAddModal = () => {
    let emptyItem = {};
    if (activeSubTab === 'education') {
      emptyItem = { degree: '', institution: '', link: '', duration: '', description: '', order: 0 };
    } else if (activeSubTab === 'training') {
      emptyItem = { title: '', institution: '', location: '', flag: '', duration: '', description: '', highlights: [], highlightsString: '', color: 'text-amber-500' };
    } else if (activeSubTab === 'skills') {
      emptyItem = { category: '', icon: 'CheckCircle', color: 'text-blue-500', skills: [], skillsString: '' };
    } else if (activeSubTab === 'awards') {
      emptyItem = { title: '', organization: '', year: '', type: 'Award', description: '', color: 'blue', isFeatured: false };
    }
    setEditingItem(emptyItem);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item, highlightsString: item.highlights ? item.highlights.join(', ') : '', skillsString: item.skills ? item.skills.join(', ') : '' });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // --- Handlers ---
  const handleInputChange = (field, value) => {
    setEditingItem({ ...editingItem, [field]: value });
  };



  const handleSaveModal = async () => {
    if (!editingItem) return;
    setSaving(true);
    const toastId = toast.loading('Saving...');
    try {
      const payload = { ...editingItem };
      if (activeSubTab === 'training') {
        payload.highlights = (payload.highlightsString || '').split(',').map(s => s.trim()).filter(s => s !== '');
        delete payload.highlightsString;
        delete payload.skillsString;
      }
      if (activeSubTab === 'skills') {
        payload.skills = (payload.skillsString || '').split(',').map(s => s.trim()).filter(s => s !== '');
        delete payload.skillsString;
        delete payload.highlightsString;
      }

      if (editingItem._id) {
        await updateSectionData(activeSubTab, editingItem._id, payload);
        toast.success('Updated successfully!', { id: toastId });
      } else {
        await createSectionData(activeSubTab, payload);
        toast.success('Created successfully!', { id: toastId });
      }
      await fetchAllData();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save data', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading('Deleting...');
    try {
      await deleteSectionData(activeSubTab, deleteTarget);
      toast.success('Deleted successfully!', { id: toastId });
      await fetchAllData();
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete data', { id: toastId });
    }
  };

  // --- Render Lists ---
  const renderEducationList = () => (
    <div className="space-y-3">
      {educationData.map((item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 transition-colors">
          <div className="flex-1">
            <h4 className="text-md font-bold text-gray-900 dark:text-white">{item.degree}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{item.institution} • {item.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => openDeleteModal(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      {educationData.length === 0 && <div className="text-center py-8 text-gray-500">No Education records found.</div>}
    </div>
  );

  const renderTrainingList = () => (
    <div className="space-y-3">
      {trainingData.map((item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 transition-colors">
          <div className="flex-1">
            <h4 className="text-md font-bold text-gray-900 dark:text-white">{item.title} {item.flag}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{item.institution} • {item.location} • {item.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => openDeleteModal(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      {trainingData.length === 0 && <div className="text-center py-8 text-gray-500">No Training records found.</div>}
    </div>
  );

  const renderSkillsList = () => (
    <div className="space-y-3">
      {skillsData.map((item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 transition-colors">
          <div className="flex-1">
            <h4 className="text-md font-bold text-gray-900 dark:text-white">{item.category}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-xl">{item.skills?.join(', ')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => openDeleteModal(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      {skillsData.length === 0 && <div className="text-center py-8 text-gray-500">No Skills found.</div>}
    </div>
  );

  const renderAwardsList = () => (
    <div className="space-y-3">
      {awardsData.map((item) => (
        <div key={item._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-md font-bold text-gray-900 dark:text-white">{item.title}</h4>
              {item.isFeatured && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">Featured</span>}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{item.organization} • {item.year} • {item.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => openDeleteModal(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
      {awardsData.length === 0 && <div className="text-center py-8 text-gray-500">No Awards found.</div>}
    </div>
  );

  // --- Render Modals based on activeSubTab ---
  const renderModalBody = () => {
    if (activeSubTab === 'education') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Degree</label>
            <input type="text" value={editingItem.degree} onChange={(e) => handleInputChange('degree', e.target.value)} placeholder="e.g. Ph.D. in Chemistry" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Institution</label>
            <input type="text" value={editingItem.institution} onChange={(e) => handleInputChange('institution', e.target.value)} placeholder="e.g. Harvard University" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Link (Optional)</label>
            <input type="text" value={editingItem.link || ''} onChange={(e) => handleInputChange('link', e.target.value)} placeholder="https://..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Duration</label>
            <input type="text" value={editingItem.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="e.g. 2020 - 2024" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Order (Optional)</label>
            <input type="number" value={editingItem.order} onChange={(e) => handleInputChange('order', e.target.value)} placeholder="e.g. 1" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Description</label>
            <textarea rows="3" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. Graduated with Honors..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
          </div>
        </div>
      );
    } else if (activeSubTab === 'training') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Title</label>
            <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Postdoctoral Fellow" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Institution</label>
            <input type="text" value={editingItem.institution} onChange={(e) => handleInputChange('institution', e.target.value)} placeholder="e.g. MIT" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Location</label>
            <input type="text" value={editingItem.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g. USA" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Duration</label>
            <input type="text" value={editingItem.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="e.g. 2024 - Present" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Flag Emoji</label>
            <input type="text" value={editingItem.flag} onChange={(e) => handleInputChange('flag', e.target.value)} placeholder="e.g. 🇺🇸" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Highlights (Comma separated)</label>
            <input type="text" value={editingItem.highlightsString !== undefined ? editingItem.highlightsString : ''} onChange={(e) => handleInputChange('highlightsString', e.target.value)} placeholder="e.g. MOFs, Photocatalysis" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Description</label>
            <textarea rows="3" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. Focused on..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
          </div>
        </div>
      );
    } else if (activeSubTab === 'skills') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Category Name</label>
            <input type="text" value={editingItem.category} onChange={(e) => handleInputChange('category', e.target.value)} placeholder="e.g. Programming" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Lucide Icon Name</label>
            <input type="text" value={editingItem.icon} onChange={(e) => handleInputChange('icon', e.target.value)} placeholder="e.g. Cpu" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Color Tailwind Class</label>
            <input type="text" value={editingItem.color} onChange={(e) => handleInputChange('color', e.target.value)} placeholder="e.g. text-blue-500" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Skills (Comma separated)</label>
            <textarea rows="3" value={editingItem.skillsString !== undefined ? editingItem.skillsString : ''} onChange={(e) => handleInputChange('skillsString', e.target.value)} placeholder="e.g. React, Node.js" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
          </div>
        </div>
      );
    } else if (activeSubTab === 'awards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Award Title</label>
            <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Best Paper Award" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Organization</label>
            <input type="text" value={editingItem.organization} onChange={(e) => handleInputChange('organization', e.target.value)} placeholder="e.g. IEEE" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Year</label>
            <input type="text" value={editingItem.year} onChange={(e) => handleInputChange('year', e.target.value)} placeholder="e.g. 2023" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Type (e.g., Scholarship, Achievement)</label>
            <input type="text" value={editingItem.type} onChange={(e) => handleInputChange('type', e.target.value)} placeholder="e.g. Award" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Color Code (e.g., amber, blue, emerald)</label>
            <input type="text" value={editingItem.color} onChange={(e) => handleInputChange('color', e.target.value)} placeholder="e.g. amber" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input type="checkbox" id="isFeatured" checked={editingItem.isFeatured || false} onChange={(e) => handleInputChange('isFeatured', e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mark as Featured Award</label>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500">Description</label>
            <textarea rows="3" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. Awarded for..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
          </div>
        </div>
      );
    }
  };


  return (
    <div className="max-w-6xl mx-auto animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Qualifications Hub
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your Education, Global Training, Skills, and Awards.</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-fit">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List Container */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 capitalize">{activeSubTab.replace('_', ' ')}</h3>
          <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md cursor-pointer">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {activeSubTab === 'education' && renderEducationList()}
        {activeSubTab === 'training' && renderTrainingList()}
        {activeSubTab === 'skills' && renderSkillsList()}
        {activeSubTab === 'awards' && renderAwardsList()}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {editingItem._id ? 'Edit' : 'Add'} {activeSubTab.replace('_', ' ')}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {renderModalBody()}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/80">
              <button onClick={closeModal} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSaveModal} disabled={saving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Item?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={closeDeleteModal} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-semibold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificationForm;
