import Link from 'next/link';
import { createEntrySnippet } from '../../actions/dashboard';

interface EntryPreviewCardProps {
  id: string;
  content: string;
  createdAt: Date;
  promptId: string;
}

export function EntryPreviewCard({ id, content, createdAt, promptId }: EntryPreviewCardProps) {
  const snippet = createEntrySnippet(content);
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric', 
    year: 'numeric',
  });

  return (
    <Link href={`/entry/${promptId}`} className="block">
      <div className="bg-ps-secondary rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-ps-primary text-sm mb-2 line-clamp-3">
          {snippet}
        </p>
        <p className="text-ps-secondary-600 text-xs">
          {formattedDate}
        </p>
      </div>
    </Link>
  );
}