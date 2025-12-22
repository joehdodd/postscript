import Link from 'next/link';
import { EntryPreviewCard } from './EntryPreviewCard';

interface EntryPreview {
  id: string;
  content: string;
  createdAt: Date;
  promptId: string;
}

interface RecentEntriesProps {
  entries: EntryPreview[];
  loading?: boolean;
}

export function RecentEntries({ entries, loading = false }: RecentEntriesProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ps-primary">Recent Entries</h2>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-ps-secondary rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ps-primary">Recent Entries</h2>
        <div className="bg-ps-secondary rounded-lg p-6 text-center">
          <p className="text-ps-secondary-600">No entries yet. Start writing to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-ps-primary">Recent Entries</h2>
        <Link 
          href="/prompt" 
          className="text-sm text-ps-secondary-600 hover:text-ps-primary transition-colors"
        >
          Show more entries →
        </Link>
      </div>
      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryPreviewCard
            key={entry.id}
            id={entry.id}
            content={entry.content}
            createdAt={entry.createdAt}
            promptId={entry.promptId}
          />
        ))}
      </div>
    </div>
  );
}