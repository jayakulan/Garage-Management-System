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
  const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    // Phone must be exactly 10 digits and start with 0
    return /^0[0-9]{9}$/.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    if (!password) return true;
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    validateFieldInRealTime(name, value);
  };

  const validateFieldInRealTime = (name, value) => {
    const errors = { ...fieldErrors };

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          errors.email = 'Invalid email format';
        } else if (value) {
          errors.email = '✓ Valid email';
        } else {
          errors.email = 'Email is required';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          errors.phone = 'Phone must be 10 digits starting with 0';
        } else if (value) {
          errors.phone = '✓ Valid phone number';
        } else {
          errors.phone = 'Phone is required';
        }
        break;
      case 'password':
        if (value && !validatePassword(value)) {
          errors.password =
            'Min 8 chars: uppercase, lowercase, number & special char';
        } else if (value) {
          errors.password = '✓ Strong password';
        } else {
          delete errors.password;
        }
        // Check confirm password match
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword && value === formData.confirmPassword) {
          errors.confirmPassword = '✓ Passwords match';
        }
        break;
      case 'confirmPassword':
        if (value && formData.password !== value) {
          errors.confirmPassword = 'Passwords do not match';
        } else if (value && formData.password === value) {
          errors.confirmPassword = '✓ Passwords match';
        } else {
          delete errors.confirmPassword;
        }
        break;
      case 'currentPassword':
        if (value) {
          errors.currentPassword = '';
        } else if (formData.password) {
          errors.currentPassword = 'Current password required to change password';
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
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

    // Validate email
    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Valid email is required';
    }

    // Validate phone
    if (!formData.phone || !validatePhone(formData.phone)) {
      errors.phone = 'Phone must be 10 digits starting with 0';
    }

    // Validate password if user is trying to change it
    if (formData.password) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      }
      if (!validatePassword(formData.password)) {
        errors.password =
          'Password must have min 8 chars with uppercase, lowercase, number & special character';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix all errors below');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const payload = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      if (formData.password) {
        payload.current_password = formData.currentPassword;
        payload.password = formData.password;
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Update failed');
      }

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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-900/30 border border-green-700 rounded text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm"
              placeholder="Username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 bg-slate-900 border rounded text-white text-sm ${
                fieldErrors.email?.includes('✓') ? 'border-green-500' : 'border-slate-700'
              } ${fieldErrors.email?.includes('❌') ? 'border-red-500' : ''}`}
              placeholder="Email"
              required
            />
            {fieldErrors.email && (
              <p
                className={`text-xs mt-1 ${
                  fieldErrors.email.includes('✓')
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              className={`w-full p-2 bg-slate-900 border rounded text-white text-sm ${
                fieldErrors.phone?.includes('✓') ? 'border-green-500' : 'border-slate-700'
              } ${fieldErrors.phone?.includes('❌') ? 'border-red-500' : ''}`}
              placeholder="10-digit phone (e.g., 0123456789)"
              required
            />
            {fieldErrors.phone && (
              <p
                className={`text-xs mt-1 ${
                  fieldErrors.phone.includes('✓')
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm"
              placeholder="Address"
            />
          </div>

          {/* Password Section */}
          <div className="border-t border-slate-600 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Change Password (Optional)
            </h3>

            {/* Current Password */}
            <div className="mb-3">
              <label className="block text-sm text-gray-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`w-full p-2 bg-slate-900 border rounded text-white text-sm pr-10 ${
                    fieldErrors.currentPassword?.includes('❌')
                      ? 'border-red-500'
                      : 'border-slate-700'
                  }`}
                  placeholder="Enter current password"
                />
                {formData.currentPassword && (
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-2 text-gray-400"
                  >
                    {/* {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )} */}
                  </button>
                )}
              </div>
              {fieldErrors.currentPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {fieldErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="block text-sm text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 bg-slate-900 border rounded text-white text-sm pr-10 ${
                    fieldErrors.password?.includes('✓')
                      ? 'border-green-500'
                      : 'border-slate-700'
                  } ${
                    fieldErrors.password?.includes('❌')
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Enter new password"
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-400"
                  >
                    {/* {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )} */}
                  </button>
                )}
              </div>
              {fieldErrors.password && (
                <p
                  className={`text-xs mt-1 ${
                    fieldErrors.password.includes('✓')
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {formData.password && (
              <div className="mb-3">
                <label className="block text-sm text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-2 bg-slate-900 border rounded text-white text-sm pr-10 ${
                      fieldErrors.confirmPassword?.includes('✓')
                        ? 'border-green-500'
                        : 'border-slate-700'
                    } ${
                      fieldErrors.confirmPassword?.includes('❌')
                        ? 'border-red-500'
                        : ''
                    }`}
                    placeholder="Confirm password"
                  />
                  {formData.confirmPassword && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-2 text-gray-400"
                    >
                      {/* {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )} */}
                    </button>
                  )}
                </div>
                {fieldErrors.confirmPassword && (
                  <p
                    className={`text-xs mt-1 ${
                      fieldErrors.confirmPassword.includes('✓')
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white p-2 rounded text-sm flex justify-center items-center gap-2 mt-4"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
