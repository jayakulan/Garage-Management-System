import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Save, Eye, EyeOff, Check } from 'lucide-react';

const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  showFields = {
    username: true,
    email: true,
    phone: true,
    address: true,
    password: false,
  },
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  /* 🔹 FIX #1: Sync form when user changes */
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  /* ---------- Validation ---------- */
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => {
    if (!phone) return true;
    return /^[0-9+\-\s()]{7,15}$/.test(phone);
  };

  const validatePassword = (password) => {
    if (!password) return true;
    return (
      password.length >= 4 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const errors = {};

    if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (formData.password) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password required';
      }
      if (!validatePassword(formData.password)) {
        errors.password =
          'Password must contain uppercase, lowercase, number & special character';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
        delete payload.currentPassword;
        delete payload.confirmPassword;
      } else {
        delete payload.confirmPassword;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/api/users/${user.user_id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Update failed');

      const updatedUser = await res.json();
      setSuccess('Profile updated successfully');
      showToast('Profile updated successfully!', 'success');

      onSave?.(updatedUser);

      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`p-4 rounded-lg flex items-center gap-3 shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? (
              <Check size={20} />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            )}
            {toast.message}
          </div>
        </div>
      )}

      <div className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* Username */}
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
            placeholder="Username"
            required
          />

          {/* Email */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
            placeholder="Email"
            required
          />

          {/* Phone */}
          {showFields.phone && (
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
              placeholder="Phone"
            />
          )}

          {/* Address */}
          {showFields.address && (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
              placeholder="Address"
            />
          )}

          {/* 🔹 FIX #2: Correct password JSX */}
          {showFields.password && (
            <>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                placeholder="Current Password"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                placeholder="New Password"
              />

              {formData.password && (
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  placeholder="Confirm Password"
                />
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex justify-center items-center gap-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;


