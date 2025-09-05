import React, { useState, useEffect } from 'react';
import './userForm.css';

const UserForm = ({ user, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    companyName: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        name: user.name || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
        companyName: user.companyName || ''
      });
    }
  }, [isEdit, user]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 200) {
      newErrors.address = 'Address must be less than 200 characters';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.length > 100) {
      newErrors.companyName = 'Company name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form if creating new user
      if (!isEdit) {
        setFormData({
          name: '',
          address: '',
          phoneNumber: '',
          companyName: ''
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      address: '',
      phoneNumber: '',
      companyName: ''
    });
    setErrors({});
  };

  return (
    <div className="user-form-container">
      <div className="user-form">
        <h2>{isEdit ? 'Update User' : 'Create New User'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              maxLength="50"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="Enter your complete address"
              rows="3"
              maxLength="200"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={errors.companyName ? 'error' : ''}
              placeholder="Enter your company name"
              maxLength="100"
            />
            {errors.companyName && <span className="error-message">{errors.companyName}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                (isEdit ? 'Updating...' : 'Creating...') : 
                (isEdit ? 'Update User' : 'Create User')
              }
            </button>
            
            {isEdit ? (
              <button 
                type="button" 
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;