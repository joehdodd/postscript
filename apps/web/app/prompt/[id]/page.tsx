import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '../../components/Card';
import { fetchPrompt } from '../../actions/prompt';
import { fetchEntryByPromptAndUser } from '../../actions/entry';
import { requireAuth } from '../../actions/auth';

type PromptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromptDetail({ params }: PromptPageProps) {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  const { id } = await params;
  const [prompt, existingEntry] = await Promise.all([
    fetchPrompt(id),
    fetchEntryByPromptAndUser(id, userId),
  ]);

  if (!prompt) {
    redirect('/prompt');
  }

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
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-ps-primary mb-2">
              Prompt Details
            </h1>
            <div className="flex items-center gap-4 text-sm text-ps-secondary">
              <span>Created: {formatDate(prompt.createdAt)}</span>
              {prompt.sentAt && <span>Sent: {formatDate(prompt.sentAt)}</span>}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prompt.isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {prompt.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-ps-primary mb-3">
              The Prompt
            </h2>
            <div
              className="bg-ps-secondary p-4 rounded-lg border-l-4"
              style={{ borderLeftColor: 'var(--ps-primary-500)' }}
            >
              <p className="text-lg text-ps-primary italic leading-relaxed">
                &ldquo;{prompt.content}&rdquo;
              </p>
            </div>
          </div>

          {/* Entry Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ps-primary">
                Your Response
              </h2>
              {prompt.isOpen && !existingEntry && (
                <Link
                  href={`/entry/${id}`}
                  className="px-4 py-2 rounded-md text-white text-sm font-medium"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--ps-primary-500) 0%, var(--ps-primary-600) 100%)',
                  }}
                >
                  Write Entry
                </Link>
              )}
            </div>

            {existingEntry ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="mb-3 text-sm text-ps-secondary">
                  Written on {formatDate(existingEntry.createdAt)}
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-ps-primary leading-relaxed">
                    {existingEntry.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200 text-center">
                <p className="text-ps-secondary mb-2">No response yet</p>
                {prompt.isOpen ? (
                  <p className="text-sm text-ps-secondary">
                    This prompt is still open for your response.
                  </p>
                ) : (
                  <p className="text-sm text-ps-secondary">
                    This prompt has been closed.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Link
                href="/prompt"
                className="px-4 py-2 text-sm font-medium text-ps-secondary border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                ← Back to Prompts
              </Link>
              {existingEntry && (
                <Link
                  href={`/entry/${existingEntry.id}`}
                  className="px-4 py-2 text-sm font-medium text-ps-primary hover:text-ps-secondary transition-colors"
                >
                  View Full Entry →
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
