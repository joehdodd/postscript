import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card } from '../components/Card';
import EntryForm from '../components/EntryForm';
import Prompt from '../components/Prompt';
import { requireAuth } from '../actions/auth';
import { fetchPrompt, fetchLatestOpenPrompt } from '../actions/prompt';
import { fetchEntryByPromptAndUser } from '../actions/entry';
import { validateMagicLinkToken } from '@/lib/auth';

export default async function Entry() {
  // Authenticate user
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  // Get token to extract promptId if present
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let promptId: string | undefined;
  if (token) {
    const payload = await validateMagicLinkToken(token);
    promptId = payload?.promptId;
  }

  // Fetch the prompt - either from token or latest open prompt
  const prompt = promptId
    ? await fetchPrompt(promptId)
    : await fetchLatestOpenPrompt(userId);

  if (!prompt) {
    return (
      <Card className="max-w-2xl w-full">
        <h2 className="text-xl text-slate-600 font-bold mb-4">No Prompt Available</h2>
        <p className="text-slate-500">
          You don&apos;t have any active prompts right now. Check your email for your daily prompt!
        </p>
      </Card>
    );
  }

  // Check if user already submitted an entry for this prompt
  const existingEntry = await fetchEntryByPromptAndUser(prompt.id, userId);

  return (
    <Card className="max-w-2xl w-full">
      <h2 className="text-xl text-slate-600 font-bold mb-4">
        {prompt.isOpen ? 'New Entry' : 'Your Entry'}
      </h2>

      <Prompt promptId={prompt.id} />

      {prompt.isOpen && !existingEntry ? (
        <EntryForm userId={userId} promptId={prompt.id} />
      ) : (
        <div className="mt-4 p-4 bg-slate-50 rounded-md">
          <p className="text-slate-700">
            {existingEntry ? existingEntry.content : 'No entry submitted yet.'}
          </p>
        </div>
      )}
    </Card>
  );
}
