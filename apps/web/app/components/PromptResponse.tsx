import Link from 'next/link';

type Entry = {
  id: string;
  content: string;
  createdAt: Date;
};

type PromptResponseProps = {
  promptId: string;
  isOpen: boolean;
  existingEntry?: Entry | null;
};

export default function PromptResponse({ promptId, isOpen, existingEntry }: PromptResponseProps) {
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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-ps-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-ps-primary">
            Your Response
          </h2>
        </div>
        {isOpen && !existingEntry && (
          <Link
            href={`/entry/${promptId}`}
            className="px-5 py-3 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, var(--ps-primary-500) 0%, var(--ps-primary-600) 100%)',
            }}
          >
            Write Entry →
          </Link>
        )}
      </div>
      
      {existingEntry ? (
        <div
          className="bg-ps-primary p-6 rounded-lg border-ps"
          style={{
            borderWidth: '1px',
          }}
        >
          <div className="mb-4 text-sm text-ps-secondary flex items-center gap-2">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Written on {formatDate(existingEntry.createdAt)}
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-ps-primary leading-relaxed text-lg">
              {existingEntry.content}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="bg-ps-primary p-8 rounded-lg border-ps text-center"
          style={{
            borderWidth: '2px',
            borderStyle: 'dashed',
          }}
        >
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--ps-neutral-200)' }}
          >
            <svg
              className="w-6 h-6 text-ps-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ps-primary mb-2">
            No response yet
          </h3>
          {isOpen ? (
            <p className="text-ps-secondary">
              This prompt is still open for your response. Click the
              &ldquo;Write Entry&rdquo; button above to get started.
            </p>
          ) : (
            <p className="text-ps-secondary">
              This prompt has been closed and is no longer accepting
              responses.
            </p>
          )}
        </div>
      )}
    </div>
  );
}