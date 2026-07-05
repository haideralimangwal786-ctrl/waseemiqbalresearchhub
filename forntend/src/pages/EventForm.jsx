import React, { useState, useEffect, useRef } from 'react';
import { getSectionData, createSectionData, updateSectionData, deleteSectionData, uploadFile } from '../services/api';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, X, AlertTriangle, Image as ImageIcon, Link as LinkIcon, Upload, Loader2, PlayCircle , Loader2} from 'lucide-react';

const EventForm = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getSectionData('events');
      setEvents(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load events data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem({ title: '', date: '', description: '', mediaUrl: '', mediaType: 'none', link: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item });
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

  const handleInputChange = (field, value) => {
    setEditingItem({ ...editingItem, [field]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading('Uploading media...');

    try {
      const response = await uploadFile(file);
      
      let mediaType = 'none';
      if (file.type.startsWith('image/')) mediaType = 'image';
      else if (file.type.startsWith('video/')) mediaType = 'video';
      
      setEditingItem({ ...editingItem, mediaUrl: response.url, mediaType });
      toast.success('Media uploaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload media. Ensure size is under 50MB.', { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveMedia = () => {
    setEditingItem({ ...editingItem, mediaUrl: '', mediaType: 'none' });
  };

  const handleSaveModal = async () => {
    if (!editingItem || !editingItem.title || !editingItem.date || !editingItem.description) {
      toast.error("Please fill all required fields (Title, Date, Description)");
      return;
    }
    
    setSaving(true);
    const toastId = toast.loading('Saving event...');
    try {
      if (editingItem._id) {
        await updateSectionData('events', editingItem._id, editingItem);
        toast.success('Updated successfully!', { id: toastId });
      } else {
        await createSectionData('events', editingItem);
        toast.success('Created successfully!', { id: toastId });
      }
      closeModal();
      await fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save event', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading('Deleting event...');
    try {
      await deleteSectionData('events', deleteTarget);
      toast.success('Deleted successfully!', { id: toastId });
      closeDeleteModal();
      await fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete event', { id: toastId });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto animate__animated animate__fadeIn space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Events Hub
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your conferences, seminars, and other events.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Events</h3>
          <button onClick={openAddModal} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-2 text-sm shadow-sm transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {events.map((item) => (
            <div key={item._id} className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row gap-6 items-center shadow-sm group hover:border-indigo-200 transition-colors">
              
              {/* Media Thumbnail */}
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative flex-shrink-0">
                {item.mediaUrl ? (
                  item.mediaType === 'image' ? (
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.mediaType === 'video' ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <video src={item.mediaUrl} className="w-full h-full object-cover opacity-60" />
                      <PlayCircle className="w-8 h-8 text-white absolute" />
                    </div>
                  ) : null
                ) : (
                  <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                    {item.date}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 w-fit">
                    <LinkIcon className="w-4 h-4" /> View Link
                  </a>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button onClick={() => openEditModal(item)} className="flex-1 p-3 flex justify-center items-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:bg-indigo-900/30 rounded-xl transition-colors cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => openDeleteModal(item._id)} className="flex-1 p-3 flex justify-center items-center text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/30 rounded-xl transition-colors cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-red-200 dark:hover:border-red-800">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
            </div>
          ))}
          {events.length === 0 && <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">No events found.</div>}
        </div>
      </div>


      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {editingItem._id ? 'Edit Event' : 'Add Event'}
              </h3>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-500">Event Title <span className="text-red-500">*</span></label>
                <input type="text" value={editingItem.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Annual Chemistry Conference 2024" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Event Date <span className="text-red-500">*</span></label>
                <input type="text" value={editingItem.date} onChange={(e) => handleInputChange('date', e.target.value)} placeholder="e.g. October 2023 or 12 Oct 2023" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">External Link (Optional)</label>
                <input type="text" value={editingItem.link} onChange={(e) => handleInputChange('link', e.target.value)} placeholder="https://..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-500">Description <span className="text-red-500">*</span></label>
                <textarea rows="4" value={editingItem.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g. Keynote speaker on the topic of MOFs..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/80 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-y" />
              </div>

              {/* Media Upload Section */}
              <div className="md:col-span-2 mt-2">
                <label className="text-xs font-semibold text-gray-500 block mb-2">Event Media (Image or Video)</label>
                
                {editingItem.mediaUrl ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <button 
                      onClick={handleRemoveMedia}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 z-10 shadow-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {editingItem.mediaType === 'image' ? (
                      <img src={editingItem.mediaUrl} alt="Event Media" className="w-full h-auto max-h-64 object-contain" />
                    ) : (
                      <video src={editingItem.mediaUrl} controls className="w-full h-auto max-h-64 bg-black" />
                    )}
                  </div>
                ) : (
                  <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*,video/mp4,video/webm,video/quicktime" 
                      onChange={handleFileUpload}
                      className="hidden"
                      ref={fileInputRef}
                      id="event-media-upload"
                    />
                    <label htmlFor="event-media-upload" className="cursor-pointer flex flex-col items-center">
                      {uploading ? (
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                      ) : (
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      )}
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {uploading ? 'Uploading...' : 'Click to upload image or video'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">Max 50MB (JPG, PNG, MP4, WebM)</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/80">
              <button onClick={closeModal} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-semibold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSaveModal} disabled={saving || uploading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                {saving ? 'Saving...' : 'Save Event'}
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Event?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
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

export default EventForm;
