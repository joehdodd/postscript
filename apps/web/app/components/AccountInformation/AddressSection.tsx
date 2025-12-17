'use client';

import FormField from './FormField';

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type FormErrors = {
  [key: string]: string;
};

type AddressSectionProps = {
  address: Address;
  errors: FormErrors;
  isEditing: boolean;
  onAddressChange: (field: string, value: string) => void;
};

export default function AddressSection({
  address,
  errors,
  isEditing,
  onAddressChange,
}: AddressSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-ps-text-primary mb-4">
        Billing Address
      </h3>
      <div className="space-y-4">
        <FormField
          label="Address Line 1"
          value={address.line1}
          error={errors['address.line1']}
          isEditing={isEditing}
          placeholder="Enter your street address"
          onChange={(value) => onAddressChange('line1', value)}
        />

        <FormField
          label="Address Line 2 (Optional)"
          value={address.line2 || ''}
          error={errors['address.line2']}
          isEditing={isEditing}
          placeholder="Apartment, suite, etc."
          onChange={(value) => onAddressChange('line2', value)}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            label="City"
            value={address.city}
            error={errors['address.city']}
            isEditing={isEditing}
            placeholder="Enter your city"
            onChange={(value) => onAddressChange('city', value)}
          />

          <FormField
            label="State"
            value={address.state}
            error={errors['address.state']}
            isEditing={isEditing}
            placeholder="Enter your state"
            onChange={(value) => onAddressChange('state', value)}
          />

          <FormField
            label="ZIP Code"
            value={address.postal_code}
            error={errors['address.postal_code']}
            isEditing={isEditing}
            placeholder="Enter your ZIP code"
            onChange={(value) => onAddressChange('postal_code', value)}
          />
        </div>
      </div>
    </div>
  );
}