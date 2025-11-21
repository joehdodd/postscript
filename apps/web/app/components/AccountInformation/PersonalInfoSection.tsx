'use client';

import FormField from './FormField';

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type FormErrors = {
  [key: string]: string;
};

type PersonalInfoSectionProps = {
  formData: PersonalInfo;
  errors: FormErrors;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
};

export default function PersonalInfoSection({
  formData,
  errors,
  isEditing,
  onInputChange,
}: PersonalInfoSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-ps-text-primary mb-4">
        Personal Information
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          value={formData.firstName}
          error={errors.firstName}
          isEditing={isEditing}
          isRequired
          placeholder="Enter your first name"
          onChange={(value) => onInputChange('firstName', value)}
        />

        <FormField
          label="Last Name"
          value={formData.lastName}
          error={errors.lastName}
          isEditing={isEditing}
          isRequired
          placeholder="Enter your last name"
          onChange={(value) => onInputChange('lastName', value)}
        />

        <FormField
          label="Email Address"
          value={formData.email}
          error={errors.email}
          isEditing={isEditing}
          type="email"
          onChange={(value) => onInputChange('email', value)}
          readOnlyNote="Email changes require verification"
        />

        <FormField
          label="Phone Number"
          value={formData.phone}
          error={errors.phone}
          isEditing={isEditing}
          type="tel"
          placeholder="Enter your phone number"
          onChange={(value) => onInputChange('phone', value)}
        />
      </div>
    </div>
  );
}