import React, { useState } from 'react';
import { updateCredentials, logoutAdmin } from '../services/api';
import toast from 'react-hot-toast';
import { Settings, Lock, User, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    if (errors.general) {
      setErrors({ ...errors, general: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'New passwords do not match';
    }
    if (!formData.newUsername && !formData.newPassword) {
      newErrors.general = 'Please provide a new username or password to update';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.general) toast.error(newErrors.general);
      return;
    }
    
    setErrors({});

    setSaving(true);
    const toastId = toast.loading('Updating credentials...');
    try {
      await updateCredentials({
        currentPassword: formData.currentPassword,
        newUsername: formData.newUsername,
        newPassword: formData.newPassword
      });
      toast.success('Credentials updated! Logging out...', { id: toastId });
      
      // Clear form
      setFormData({
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      // Log out and redirect
      setTimeout(() => {
        logoutAdmin();
        navigate('/admin/login');
      }, 1500);
      
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to update credentials';
      toast.error(message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate__animated animate__fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Account Settings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your admin username and password.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        
        {/* Warning Banner */}
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Security Notice</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              For security reasons, if you successfully change your username or password, you will be automatically logged out and required to log in again with your new credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          {/* Current Password - Required */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
              <Lock className="w-5 h-5 text-gray-500" /> Verify Identity
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${errors.currentPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.currentPassword}</p>}
            </div>
          </div>

          {/* New Credentials */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
              <User className="w-5 h-5 text-blue-500" /> New Credentials
            </h3>
            
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Username (Optional)</label>
              <input 
                type="text" 
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${errors.newUsername ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                placeholder="Leave blank to keep current username"
              />
              {errors.newUsername && <p className="text-red-500 text-xs mt-1 font-medium">{errors.newUsername}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password (Optional)</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${errors.newPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    placeholder="Leave blank to keep current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.newPassword}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmNewPassword}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Updating...' : 'Update Credentials'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SettingsForm;
