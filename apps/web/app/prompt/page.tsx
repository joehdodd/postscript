import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '../actions/auth';
import { fetchUserPrompts } from '../actions/prompt';
import GenerateNewPrompt from '../components/GenerateNewPrompt';

type Prompt = {
  id: string;
  content: string;
  createdAt: string | number | Date;
  isOpen: boolean;
};

export default async function Prompt() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }
  const prompts = await fetchUserPrompts(userId);

  return (
    <div className="min-h-screen bg-ps-primary">
      <div className="container mx-auto px-2 py-2 md:px-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="md:text-3xl font-bold text-ps-primary mb-2">
              Your Prompts
            </h1>
            <p className="text-ps-secondary">
              You may still respond to any open prompts. Click on any prompt to
              view details or write your entry.
            </p>
            <GenerateNewPrompt />
          </div>
          <div className="flex flex-col gap-2 space-y-4">
            {prompts?.length > 0 ? (
              prompts.map((prompt: Prompt) => (
                <Link key={prompt.id} href={`/prompt/${prompt.id}`}>
                  <div
                    className="bg-ps-secondary p-6 rounded-lg border-ps transition-all duration-200 cursor-pointer group hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      borderWidth: '1px',
                    }}
                  >
                    <div className="mb-3">
                      <p className="md:text-lg text-ps-primary leading-relaxed line-clamp-3">
                        &ldquo;{prompt.content}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${prompt.isOpen ? 'text-white' : 'text-ps-secondary'
                          }`}
                        style={{
                          backgroundColor: prompt.isOpen
                            ? 'var(--ps-secondary-500)'
                            : 'var(--ps-neutral-300)',
                        }}
                      >
                        {prompt.isOpen ? 'Open' : 'Closed'}
                      </span>
                      <span className="text-sm text-ps-secondary">
                        {new Date(prompt.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ps-secondary group-hover:text-ps-primary transition-colors">
                        {prompt.isOpen ? 'Click to respond' : 'View your entry'}
                      </span>
                      <svg
                        className="w-5 h-5 text-ps-secondary group-hover:text-ps-primary transition-all duration-200 transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div
                className="bg-ps-secondary p-12 rounded-lg border-ps text-center"
                style={{ borderWidth: '2px', borderStyle: 'dashed' }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--ps-neutral-200)' }}
                >
                  <svg
                    className="w-8 h-8 text-ps-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-ps-primary mb-2">
                  No prompts yet
                </h3>
                <p className="text-ps-secondary mb-6">
                  You&apos;ll receive your first thoughtful prompt soon. Check
                  your email for daily inspiration.
                </p>
                {/* <Link
                  href="/"
                  className="inline-block px-6 py-3 text-white font-medium rounded-lg transition-all duration-200"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--ps-primary-500) 0%, var(--ps-primary-600) 100%)',
                  }}
                >
                  Back to Home
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
