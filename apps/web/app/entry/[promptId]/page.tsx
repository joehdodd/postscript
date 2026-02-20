import { redirect } from 'next/navigation';
import { Card } from '../../components/Card';
import EntryForm from '../../components/EntryForm';
import Prompt from '../../components/Prompt';
import { requireAuth } from '../../actions/auth';
import { fetchPrompt, fetchLatestOpenPrompt } from '../../actions/prompt';
import { fetchEntryByPromptAndUser } from '../../actions/entry';
import Link from 'next/link';

interface EntryPageProps {
  params: Promise<{ promptId: string }>;
}

export default async function Entry({ params }: EntryPageProps) {
  const { userId } = await requireAuth();
  if (!userId || !params) {
    redirect('/');
  }

  const { promptId } = await params;

  const prompt = promptId
    ? await fetchPrompt(promptId)
    : await fetchLatestOpenPrompt(userId);

  if (!prompt) {
    return (
      <Card className="h-[600px] w-full">
        <h2 className="text-xl text-slate-600 font-bold mb-4">
          No Prompt Available
        </h2>
        <p className="text-slate-500">
          You don&apos;t have any active prompts right now. Check your email for
          your daily prompt!
        </p>
        <Link
          href="/prompt"
          className="text-blue-500 hover:underline mt-4 block"
        >
          View Your Prompts
        </Link>
      </Card>
    );
  }

  const existingEntry = await fetchEntryByPromptAndUser(prompt.id, userId);

  return (
    <Card className="h-[600px] w-full">
      <h2 className="text-xl text-ps-primary font-bold mb-4">
        {prompt.isOpen ? 'New Entry' : 'Your Entry'}
      </h2>
      <Prompt promptId={prompt.id} />
      {prompt.isOpen ? (
        <EntryForm userId={userId} promptId={prompt.id} />
      ) : (
        <div className="mt-4 p-4 rounded-md">
          <p className="text-ps-primary leading-relaxed">
            {existingEntry ? existingEntry.content : '...'}
          </p>
        </div>
      )}
    </Card>
  );
}
