type PromptHeaderProps = {
  prompt: {
    createdAt: Date;
    sentAt?: Date | null;
    isOpen: boolean;
  };
};

export default function PromptHeader({ prompt }: PromptHeaderProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="py-2 mb-4 md:mb-8 pb-4 md:pb-6 border-ps border-b">
      <h1 className="md:text-3xl font-bold text-ps-primary mb-3">
        Prompt Details
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-ps-secondary">
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          Created: {formatDate(prompt.createdAt)}
        </span>
        {prompt.sentAt && (
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Sent: {formatDate(prompt.sentAt)}
          </span>
        )}
        <span
          className={`px-3 py-1 rounded-full text-xs ${prompt.isOpen ? 'text-white' : 'text-ps-secondary'
            }`}
          style={{
            backgroundColor: prompt.isOpen
              ? 'var(--ps-secondary-500)'
              : 'var(--ps-neutral-300)',
          }}
        >
          {prompt.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
    </div>
  );
}
