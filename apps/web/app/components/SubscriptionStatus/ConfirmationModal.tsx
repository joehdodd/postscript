'use client';

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'primary';
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  type = 'danger',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const confirmButtonStyle = type === 'danger' 
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-ps-primary-600 text-white hover:bg-ps-primary-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-ps-primary rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-ps-text-primary mb-4">
          {title}
        </h3>
        <p className="text-ps-text-secondary mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-ps-text-secondary hover:text-ps-text-primary transition-colors duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 ${confirmButtonStyle}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}