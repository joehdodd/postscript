import { redirect } from 'next/navigation'
import { Card } from '@repo/ui/card';
import EntryForm from '../components/EntryForm';
import Prompt from '../components/Prompt';
import { requireAuth } from '../actions/auth';
import { fetchPrompt } from '../actions/prompt';
import { fetchEntryByPromptAndUser } from '../actions/entry';

type EntryPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Entry({ searchParams }: EntryPageProps) {
  const { userId, promptId } = await requireAuth(searchParams);
  if (!userId || !promptId) {
    redirect('/');
  }
  const prompt = await fetchPrompt(promptId);
  let existingEntry = null;
  if (!prompt.isOpen) {
    existingEntry = await fetchEntryByPromptAndUser(promptId, userId);
  }
  return (
    <Card className="max-w-md w-full">
      <h2 className="text-xl text-slate-600 dark:text-slate-200 font-bold">
        Add a new entry
      </h2>
      <Prompt promptId={promptId} />
      {prompt.isOpen ? (
        <EntryForm userId={userId} promptId={promptId} />
      ) : (
        <div>
          <p className="mt-4 text-red-600">This prompt is closed for new entries.</p>
          <p>{existingEntry ? existingEntry.content : 'No existing entry found.'}</p>
        </div>
      )}
    </Card>
  );
}
