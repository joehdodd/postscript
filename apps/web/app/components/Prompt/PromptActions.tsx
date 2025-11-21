import Link from 'next/link';

type Entry = {
  id: string;
};

type PromptActionsProps = {
  existingEntry?: Entry | null;
};

export default function PromptActions({ existingEntry }: PromptActionsProps) {
  return (
    <div className="pt-6 border-ps" style={{ borderTopWidth: '1px' }}>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/prompt"
          className="px-5 py-3 text-sm font-medium text-ps-secondary border-ps rounded-lg transition-all duration-200"
          style={{
            borderWidth: '1px',
            backgroundColor: 'transparent',
          }}
        >
          ← Back to Prompts
        </Link>
        {existingEntry && (
          <Link
            href={`/entry/${existingEntry.id}`}
            className="px-5 py-3 text-sm font-medium text-ps-primary transition-colors duration-200 hover:text-ps-secondary"
          >
            View Full Entry →
          </Link>
        )}
      </div>
    </div>
  );
}