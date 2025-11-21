'use client';

type FormFieldProps = {
  label: string;
  value: string;
  error?: string;
  isEditing: boolean;
  isRequired?: boolean;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  onChange: (value: string) => void;
  readOnlyNote?: string;
};

export default function FormField({
  label,
  value,
  error,
  isEditing,
  isRequired = false,
  type = 'text',
  placeholder,
  onChange,
  readOnlyNote,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-ps-text-primary mb-2">
        {label} {isRequired && '*'}
      </label>
      {isEditing ? (
        <div>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-ps-primary text-ps-text-primary ${
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-ps-neutral-300 focus:ring-ps-primary-500 focus:border-transparent'
            }`}
            placeholder={placeholder}
            disabled={type === 'email'}
          />
          {error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
          )}
          {readOnlyNote && (
            <p className="text-xs text-ps-text-secondary mt-1">{readOnlyNote}</p>
          )}
        </div>
      ) : (
        <p className="text-ps-text-primary">
          {value || 'Not provided'}
        </p>
      )}
    </div>
  );
}