import React, { useState, useEffect } from 'react';
import { getSectionData, createSectionData, updateSectionData, deleteSectionData } from '../services/api';
import toast from 'react-hot-toast';
import { Microscope, BookOpen, Clock, Plus, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';

const predefinedAreaIcons = [
  "Droplets", "Zap", "Layers", "Sun", "Atom", "Beaker", "Leaf", "Microscope", "Globe"
];

const colorThemes = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "amber", label: "Amber", class: "bg-amber-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" }
];

const predefinedStatuses = [
  "Manuscript in Preparation",
  "Under Review",
  "Data Collection",
  "Experimental Phase"
];

const ResearchForm = () => {
  const [activeTab, setActiveTab] = useState('areas'); // 'areas', 'ongoing', 'publications'
  
  const [areas, setAreas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'area', 'project', 'publication'
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [areasRes, projectsRes, pubsRes] = await Promise.all([
        getSectionData('research_areas'),
        getSectionData('ongoing_projects'),
        getSectionData('publications')
      ]);
      // Sort by order or createdAt
      setAreas(areasRes.sort((a,b) => (a.order || 0) - (b.order || 0)));
      setProjects(projectsRes.sort((a,b) => (a.order || 0) - (b.order || 0)));
      setPublications(pubsRes.sort((a,b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load Research data');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Helpers ---
  const openAddModal = (type) => {
    setModalType(type);
    if (type === 'area') {
      setEditingItem({ title: '', icon: 'Atom', description: '', colorTheme: 'blue', order: areas.length });
    } else if (type === 'project') {
      setEditingItem({ title: '', status: 'Manuscript in Preparation', category: '', collaborators: [], collaboratorsString: '', description: '', order: projects.length });
    } else if (type === 'publication') {
      setEditingItem({ year: '', title: '', journal: '', authors: '', category: '', doi: '', paperUrl: '', featured: false, order: publications.length });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem({ ...item, collaboratorsString: item.collaborators ? item.collaborators.join(', ') : '' });
    setIsModalOpen(true);
  };

  const openDeleteModal = (type, id) => {
    setDeleteTarget({ type, id });
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

  // --- Save / Delete Actions ---
  const handleSaveModal = async () => {
    if (!editingItem) return;
    setSaving(true);
    const toastId = toast.loading('Saving...');
    try {
      const payload = { ...editingItem };
      if (modalType === 'project') {
        payload.collaborators = (payload.collaboratorsString || '').split(',').map(s => s.trim()).filter(s => s !== '');
        delete payload.collaboratorsString;
      }

      let endpoint = '';
      if (modalType === 'area') endpoint = 'research_areas';
      if (modalType === 'project') endpoint = 'ongoing_projects';
      if (modalType === 'publication') endpoint = 'publications';

      if (editingItem._id) {
        await updateSectionData(endpoint, editingItem._id, payload);
        toast.success('Updated successfully!', { id: toastId });
      } else {
        await createSectionData(endpoint, payload);
        toast.success('Created successfully!', { id: toastId });
      }
      
      closeModal();
      await fetchData();
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
      let endpoint = '';
      if (deleteTarget.type === 'area') endpoint = 'research_areas';
      if (deleteTarget.type === 'project') endpoint = 'ongoing_projects';
      if (deleteTarget.type === 'publication') endpoint = 'publications';

      await deleteSectionData(endpoint, deleteTarget.id);
      toast.success('Deleted successfully!', { id: toastId });
      closeDeleteModal();
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete data', { id: toastId });
    }
  };

  // --- Input Handlers ---
  const handleInputChange = (field, value) => {
    setEditingItem({ ...editingItem, [field]: value });
  };


  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto animate__animated animate__fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Microscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Research Hub
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage focus areas, ongoing projects, and publications.</p>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
        <button onClick={() => setActiveTab('areas')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'areas' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <Microscope className="w-4 h-4" /> Focus Areas
        </button>
        <button onClick={() => setActiveTab('ongoing')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'ongoing' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <Clock className="w-4 h-4" /> Ongoing Projects
        </button>
        <button onClick={() => setActiveTab('publications')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'publications' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <BookOpen className="w-4 h-4" /> Publications
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* FOCUS AREAS */}
        {activeTab === 'areas' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Focus Areas List</h3>
              <button onClick={() => openAddModal('area')} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md cursor-pointer">
                <Plus className="w-4 h-4" /> Add Area
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {areas.map((area) => (
                <div key={area._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colorThemes.find(c => c.value === area.colorTheme)?.class || 'bg-blue-500'}`}></span>
                      {area.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{area.description}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <button onClick={() => openEditModal('area', area)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteModal('area', area._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGOING PROJECTS */}
        {activeTab === 'ongoing' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Ongoing Projects List</h3>
              <button onClick={() => openAddModal('project')} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md cursor-pointer">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-md font-bold text-gray-900 dark:text-white">{proj.title}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{proj.category} • {proj.collaborators.length} Collaborator(s)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal('project', proj)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteModal('project', proj._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLICATIONS */}
        {activeTab === 'publications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Publications List</h3>
              <button onClick={() => openAddModal('publication')} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md cursor-pointer">
                <Plus className="w-4 h-4" /> Add Publication
              </button>
            </div>
            <div className="space-y-3">
              {publications.map((pub) => (
                <div key={pub._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-md font-bold text-gray-900 dark:text-white">{pub.title}</h4>
                      {pub.featured && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{pub.journal} ({pub.year}) • {pub.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal('publication', pub)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteModal('publication', pub._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {editingItem._id ? 'Edit' : 'Add'} {modalType}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              
              {/* AREA FORM */}
              {modalType === 'area' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Nanotechnology" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Icon</label>
                    <select value={editingItem.icon} onChange={(e) => handleInputChange('icon', e.target.value)} className="w-full appearance-none px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]">
                      {predefinedAreaIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Color Theme</label>
                    <select value={editingItem.colorTheme} onChange={(e) => handleInputChange('colorTheme', e.target.value)} className="w-full appearance-none px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]">
                      {colorThemes.map(color => <option key={color.value} value={color.value}>{color.label}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Description</label>
                    <textarea rows="3" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. Focused on designing..." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
                  </div>
                </div>
              )}

              {/* PROJECT FORM */}
              {modalType === 'project' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Project Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Synthesis of novel MOFs" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Status</label>
                    <select value={editingItem.status} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full appearance-none px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.25em_1.25em] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]">
                      {predefinedStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Category</label>
                    <input type="text" value={editingItem.category} onChange={(e) => handleInputChange('category', e.target.value)} placeholder="e.g. Materials Science" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Collaborators (Comma separated)</label>
                    <input type="text" value={editingItem.collaboratorsString !== undefined ? editingItem.collaboratorsString : ''} onChange={(e) => handleInputChange('collaboratorsString', e.target.value)} placeholder="e.g. John Doe, Jane Smith" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Description</label>
                    <textarea rows="3" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. A comprehensive study on..." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
                  </div>
                </div>
              )}

              {/* PUBLICATION FORM */}
              {modalType === 'publication' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Title</label>
                    <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. High-efficiency photocatalysis using..." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Year / Status</label>
                    <input type="text" placeholder="e.g. 2025 or In Prep" value={editingItem.year} onChange={(e) => handleInputChange('year', e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Journal / Conference</label>
                    <input type="text" value={editingItem.journal} onChange={(e) => handleInputChange('journal', e.target.value)} placeholder="e.g. Nature Materials" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Authors</label>
                    <input type="text" value={editingItem.authors} onChange={(e) => handleInputChange('authors', e.target.value)} placeholder="e.g. Iqbal, W., et al." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Category</label>
                    <input type="text" placeholder="e.g. Photocatalysis" value={editingItem.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">DOI (Optional)</label>
                    <input type="text" placeholder="e.g. 10.1016/..." value={editingItem.doi} onChange={(e) => handleInputChange('doi', e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Paper URL (Optional)</label>
                    <input type="text" placeholder="e.g. https://example.com/paper.pdf" value={editingItem.paperUrl || ''} onChange={(e) => handleInputChange('paperUrl', e.target.value)} className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-1 flex items-center pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg group-hover:border-blue-500 transition-colors">
                        <input type="checkbox" checked={editingItem.featured} onChange={(e) => handleInputChange('featured', e.target.checked)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                        {editingItem.featured && <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Featured Publication</span>
                    </label>
                  </div>
                </div>
              )}

            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/80">
              <button onClick={closeModal} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSaveModal} disabled={saving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                {saving ? 'Saving...' : 'Save Changes'}
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
              Are you sure you want to delete this {deleteTarget.type}? This action cannot be undone.
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

export default ResearchForm;
