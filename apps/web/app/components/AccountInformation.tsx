'use client';

import { useState } from 'react';

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
};

export default function AccountInformation({ userData }: AccountInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        // TODO: Show success message
      } else {
        // TODO: Show error message
        console.error('Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      // TODO: Show error message
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
  };

  return (
    <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-ps-primary">
          Account Information
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
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

      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-medium text-ps-text-primary mb-4">
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ps-text-primary mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                />
              ) : (
                <p className="text-ps-text-primary">
                  {formData.firstName || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ps-text-primary mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                />
              ) : (
                <p className="text-ps-text-primary">
                  {formData.lastName || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ps-text-primary mb-2">
                Email Address
              </label>
              <p className="text-ps-text-primary">{formData.email}</p>
              {isEditing && (
                <p className="text-xs text-ps-text-secondary mt-1">
                  Email changes require verification
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ps-text-primary mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                />
              ) : (
                <p className="text-ps-text-primary">
                  {formData.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <h3 className="text-sm font-medium text-ps-text-primary mb-4">
            Billing Address
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ps-text-primary mb-2">
                Address Line 1
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.line1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, line1: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                />
              ) : (
                <p className="text-ps-text-primary">
                  {formData.address.line1 || 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ps-text-primary mb-2">
                Address Line 2 (Optional)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.line2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, line2: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                />
              ) : (
                <p className="text-ps-text-primary">
                  {formData.address.line2 || 'Not provided'}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ps-text-primary mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                  />
                ) : (
                  <p className="text-ps-text-primary">
                    {formData.address.city || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ps-text-primary mb-2">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                  />
                ) : (
                  <p className="text-ps-text-primary">
                    {formData.address.state || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ps-text-primary mb-2">
                  ZIP Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address.postal_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, postal_code: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-ps-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-primary-500 focus:border-transparent bg-ps-primary text-ps-text-primary"
                  />
                ) : (
                  <p className="text-ps-text-primary">
                    {formData.address.postal_code || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}