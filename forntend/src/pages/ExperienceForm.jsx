import React, { useState, useEffect } from 'react';
import { getSectionData, createSectionData, updateSectionData, deleteSectionData } from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, Plus, Trash2, Edit2, X, AlertTriangle, Calendar, Building, MapPin } from 'lucide-react';

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSectionData('experience');
      setExperiences(data); // Display as received, typically order matters or date sorting
    } catch (error) {
      console.error(error);
      toast.error('Failed to load Experience data');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Helpers ---
  const openAddModal = () => {
    setEditingItem({ title: '', organization: '', location: '', date: '', type: 'Full-Time', description: '', highlights: [], highlightsString: '', link: '', color: 'text-blue-500' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item, highlightsString: item.highlights ? item.highlights.join(', ') : '' });
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

  // --- Save / Delete Actions ---
  const handleSaveModal = async () => {
    if (!editingItem) return;
    setSaving(true);
    const toastId = toast.loading('Saving...');
    try {
      const payload = { ...editingItem };
      payload.highlights = (payload.highlightsString || '').split(',').map(s => s.trim()).filter(s => s !== '');
      delete payload.highlightsString;

      if (editingItem._id) {
        await updateSectionData('experience', editingItem._id, payload);
        toast.success('Updated successfully!', { id: toastId });
      } else {
        await createSectionData('experience', payload);
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
      await deleteSectionData('experience', deleteTarget);
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
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Experience
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your professional journey and timeline.</p>
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Experience List</h3>
          <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 text-sm shadow-sm hover:shadow-md cursor-pointer">
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>

        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                    {exp.date}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {exp.organization} • <MapPin className="w-3 h-3 ml-1" /> {exp.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(exp)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => openDeleteModal(exp._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No experience records found. Add one to get started!
            </div>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {editingItem._id ? 'Edit' : 'Add'} Experience
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Role / Title</label>
                  <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Senior Researcher" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Organization</label>
                  <input type="text" value={editingItem.organization} onChange={(e) => handleInputChange('organization', e.target.value)} placeholder="e.g. Harvard University" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Organization Link (Optional)</label>
                  <input type="text" value={editingItem.link} onChange={(e) => handleInputChange('link', e.target.value)} placeholder="https://..." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Duration / Date</label>
                  <input type="text" value={editingItem.date} onChange={(e) => handleInputChange('date', e.target.value)} placeholder="e.g. Sep 2020 – Jan 2022" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Location</label>
                  <input type="text" value={editingItem.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g. Italy" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Highlights / Skills (Comma separated)</label>
                  <input type="text" value={editingItem.highlightsString !== undefined ? editingItem.highlightsString : ''} onChange={(e) => handleInputChange('highlightsString', e.target.value)} placeholder="e.g. Project Management, Data Analysis" className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Description</label>
                  <textarea rows="4" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. Led a team of researchers..." className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y" />
                </div>
              </div>

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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Experience?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this experience record? This action cannot be undone.
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

export default ExperienceForm;
