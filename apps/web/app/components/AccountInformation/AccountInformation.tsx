'use client';

import { useState, useEffect } from 'react';
import FormMessages from './FormMessages';
import PersonalInfoSection from './PersonalInfoSection';
import AddressSection from './AddressSection';

type UserData = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

type AccountInformationProps = {
  userData?: UserData;
  onUpdate?: () => void;
};

type FormErrors = {
  [key: string]: string;
};

export default function AccountInformation({ userData, onUpdate }: AccountInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: {
      line1: userData?.address?.line1 || '',
      line2: userData?.address?.line2 || '',
      city: userData?.address?.city || '',
      state: userData?.address?.state || '',
      postal_code: userData?.address?.postal_code || '',
      country: userData?.address?.country || 'US',
    },
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: {
          line1: userData.address?.line1 || '',
          line2: userData.address?.line2 || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          postal_code: userData.address?.postal_code || '',
          country: userData.address?.country || 'US',
        },
      });
    }
  }, [userData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[1-9][\d\s\-()]{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Address validation (if any field is filled, require basic fields)
    const addressFilled = Object.values(formData.address).some(value => value.trim());
    if (addressFilled) {
      if (!formData.address.line1.trim()) {
        newErrors['address.line1'] = 'Street address is required';
      }
      if (!formData.address.city.trim()) {
        newErrors['address.city'] = 'City is required';
      }
      if (!formData.address.state.trim()) {
        newErrors['address.state'] = 'State is required';
      }
      if (!formData.address.postal_code.trim()) {
        newErrors['address.postal_code'] = 'Postal code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
    setErrors({});
  };

  const handleSave = async () => {
    clearMessages();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          address: {
            line1: formData.address.line1,
            line2: formData.address.line2 || undefined,
            city: formData.address.city,
            state: formData.address.state,
            postal_code: formData.address.postal_code,
            country: formData.address.country,
          },
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage('Account information updated successfully!');
        setIsEditing(false);
        onUpdate?.();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Failed to update account information');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: {
        line1: userData?.address?.line1 || '',
        line2: userData?.address?.line2 || '',
        city: userData?.address?.city || '',
        state: userData?.address?.state || '',
        postal_code: userData?.address?.postal_code || '',
        country: userData?.address?.country || 'US',
      },
    });
    setIsEditing(false);
    clearMessages();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
    // Clear field error when user starts typing
    const errorKey = `address.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-ps-primary">
          Account Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => {
              setIsEditing(true);
              clearMessages();
            }}
            className="px-4 py-2 text-sm font-medium text-ps-primary-600 hover:text-ps-primary-700 transition-colors duration-200"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-ps-text-secondary hover:text-ps-text-primary transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-ps-primary-600 text-white rounded-md hover:bg-ps-primary-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <FormMessages successMessage={successMessage} errorMessage={errorMessage} />

      <div className="space-y-6">
        <PersonalInfoSection
          formData={formData}
          errors={errors}
          isEditing={isEditing}
          onInputChange={handleInputChange}
        />

        <AddressSection
          address={formData.address}
          errors={errors}
          isEditing={isEditing}
          onAddressChange={handleAddressChange}
        />
      </div>
    </div>
  );
}