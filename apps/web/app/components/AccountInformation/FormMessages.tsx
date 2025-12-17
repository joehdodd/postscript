'use client';

type FormMessagesProps = {
  successMessage?: string;
  errorMessage?: string;
};

export default function FormMessages({ successMessage, errorMessage }: FormMessagesProps) {
  if (!successMessage && !errorMessage) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {/* Success Message */}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}