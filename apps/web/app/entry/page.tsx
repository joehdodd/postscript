import { redirect } from 'next/navigation';
import { Card } from '../components/Card';
import EntryForm from '../components/EntryForm';
import Prompt from '../components/Prompt';
import { requireAuth } from '../actions/auth';
import { fetchPrompt, fetchLatestOpenPrompt } from '../actions/prompt';
import { fetchEntryByPromptAndUser } from '../actions/entry';

export default async function Entry() {
  const { userId, promptId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  const prompt = promptId
    ? await fetchPrompt(promptId)
    : await fetchLatestOpenPrompt(userId);

  if (!prompt) {
    return (
      <Card className="w-full">
        <h2 className="text-xl text-slate-600 font-bold mb-4">No Prompt Available</h2>
        <p className="text-slate-500">
          You don&apos;t have any active prompts right now. Check your email for your daily prompt!
        </p>
      </Card>
    );
  }

  const existingEntry = await fetchEntryByPromptAndUser(prompt.id, userId);

  return (
    <Card className="w-full">
      <h2 className="text-xl text-slate-600 font-bold mb-4">
        {prompt.isOpen ? 'New Entry' : 'Your Entry'}
      </h2>
      <Prompt promptId={prompt.id} />
      {prompt.isOpen ? (
        <EntryForm userId={userId} promptId={prompt.id} />
      ) : (
        <div className="mt-4 p-4 bg-slate-50 rounded-md">
          <p className="text-slate-700">
            {existingEntry ? existingEntry.content : '...'}
          </p>
        </div>
      )}
    </Card>
  );
}
