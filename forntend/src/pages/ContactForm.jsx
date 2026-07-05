import React, { useState, useEffect } from 'react';
import { getSectionData, createSectionData, updateSectionData, deleteSectionData } from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Phone, Users, Plus, Trash2, Edit2, X, AlertTriangle, Save, GraduationCap , Loader2} from 'lucide-react';

const ContactForm = () => {
  const [loading, setLoading] = useState(true);
  
  // Contact Info State
  const [contactInfo, setContactInfo] = useState(null);
  const [isSavingContact, setIsSavingContact] = useState(false);

  // References State
  const [references, setReferences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [savingRef, setSavingRef] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [contactData, refsData] = await Promise.all([
        getSectionData('contact_info'),
        getSectionData('references')
      ]);
      if (contactData && contactData.length > 0) {
        setContactInfo(contactData[0]);
      }
      setReferences(refsData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load Contact data');
    } finally {
      setLoading(false);
    }
  };

  // --- Contact Info Handlers ---
  const handleContactChange = (field, value) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  const handleSaveContact = async () => {
    if (!contactInfo) return;
    setIsSavingContact(true);
    const toastId = toast.loading('Saving Contact Info...');
    try {
      if (contactInfo._id) {
        await updateSectionData('contact_info', contactInfo._id, contactInfo);
      } else {
        await createSectionData('contact_info', contactInfo);
      }
      toast.success('Contact info saved successfully!', { id: toastId });
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save Contact Info', { id: toastId });
    } finally {
      setIsSavingContact(false);
    }
  };

  // --- References Modal Handlers ---
  const openAddModal = () => {
    setEditingRef({ name: '', position: '', institution: '', role: '', email: '', order: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingRef({ ...item });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteTarget(id);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRef(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleRefChange = (field, value) => {
    setEditingRef({ ...editingRef, [field]: value });
  };

  const handleSaveRefModal = async () => {
    if (!editingRef) return;
    setSavingRef(true);
    const toastId = toast.loading('Saving Reference...');
    try {
      if (editingRef._id) {
        await updateSectionData('references', editingRef._id, editingRef);
        toast.success('Updated successfully!', { id: toastId });
      } else {
        await createSectionData('references', editingRef);
        toast.success('Created successfully!', { id: toastId });
      }
      closeModal();
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save reference', { id: toastId });
    } finally {
      setSavingRef(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading('Deleting...');
    try {
      await deleteSectionData('references', deleteTarget);
      toast.success('Deleted successfully!', { id: toastId });
      closeDeleteModal();
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete reference', { id: toastId });
    }
  };


  return (
    <div className="max-w-6xl mx-auto animate__animated animate__fadeIn space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Contact & References
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your contact information and academic references.</p>
      </div>

      {/* --- Contact Info Section --- */}
      {contactInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-500" />
              General Contact Info
            </h3>
            <button 
              onClick={handleSaveContact} 
              disabled={isSavingContact}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSavingContact ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Saving...</> : 'Save Info'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500">Intro Description 1</label>
              <textarea rows="2" value={contactInfo.description1} onChange={(e) => handleContactChange('description1', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500">Intro Description 2</label>
              <textarea rows="2" value={contactInfo.description2} onChange={(e) => handleContactChange('description2', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Primary Email</label>
              <input type="text" value={contactInfo.emailPrimary} onChange={(e) => handleContactChange('emailPrimary', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Primary Email Label</label>
              <input type="text" value={contactInfo.emailPrimaryLabel} onChange={(e) => handleContactChange('emailPrimaryLabel', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Secondary Email</label>
              <input type="text" value={contactInfo.emailSecondary} onChange={(e) => handleContactChange('emailSecondary', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Secondary Email Label</label>
              <input type="text" value={contactInfo.emailSecondaryLabel} onChange={(e) => handleContactChange('emailSecondaryLabel', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Primary Phone</label>
              <input type="text" value={contactInfo.phonePrimary} onChange={(e) => handleContactChange('phonePrimary', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Primary Phone Label</label>
              <input type="text" value={contactInfo.phonePrimaryLabel} onChange={(e) => handleContactChange('phonePrimaryLabel', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Secondary Phone</label>
              <input type="text" value={contactInfo.phoneSecondary} onChange={(e) => handleContactChange('phoneSecondary', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Secondary Phone Label</label>
              <input type="text" value={contactInfo.phoneSecondaryLabel} onChange={(e) => handleContactChange('phoneSecondaryLabel', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-500">Affiliation / Address (Supports multiline)</label>
              <textarea rows="3" value={contactInfo.affiliation} onChange={(e) => handleContactChange('affiliation', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
          </div>
        </div>
      )}

      {/* --- References Section --- */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Academic References
          </h3>
          <button onClick={openAddModal} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 text-sm shadow-sm transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> Add Reference
          </button>
        </div>

        <div className="space-y-3">
          {references.map((item) => (
            <div key={item._id} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col sm:flex-row gap-4 justify-between group hover:border-indigo-200 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white">{item.name}</h4>
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-semibold">{item.role}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.position} • {item.institution}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => openDeleteModal(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {references.length === 0 && <div className="text-center py-8 text-gray-500">No References found.</div>}
        </div>
      </div>


      {/* --- ADD / EDIT REFERENCE MODAL --- */}
      {isModalOpen && editingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {editingRef._id ? 'Edit Reference' : 'Add Reference'}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Name</label>
                <input type="text" value={editingRef.name} onChange={(e) => handleRefChange('name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Position</label>
                <input type="text" value={editingRef.position} onChange={(e) => handleRefChange('position', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-500">Institution</label>
                <input type="text" value={editingRef.institution} onChange={(e) => handleRefChange('institution', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Role (e.g., Ph.D. Supervisor)</label>
                <input type="text" value={editingRef.role} onChange={(e) => handleRefChange('role', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Email Address</label>
                <input type="email" value={editingRef.email} onChange={(e) => handleRefChange('email', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Order (Optional)</label>
                <input type="number" value={editingRef.order || 0} onChange={(e) => handleRefChange('order', e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/80">
              <button onClick={closeModal} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSaveRefModal} disabled={savingRef} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                {savingRef ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Saving...</> : 'Save Reference'}
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Reference?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this reference? This action cannot be undone.
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

export default ContactForm;
