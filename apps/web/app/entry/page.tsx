import { redirect } from 'next/navigation'
import { Card } from '../components/Card';
import EntryForm from '../components/EntryForm';
import Prompt from '../components/Prompt';
import { requireAuth } from '../actions/auth';
import { fetchUserPrompts } from '../actions/prompt';

export default async function Entry() {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }
  const prompts = await fetchUserPrompts(userId);
  console.log('prompts', prompts)
  return (
    <Card className="max-w-2xl w-full max-h-[400px] h-full">
      <h2 className="text-xl text-slate-600 font-bold">
        New Entry
      </h2>
      {/* <Prompt promptId={promptId} /> */}
      {/* {prompt?.isOpen ? (
        <div>
          <p>Fart</p>
        </div>
        // <EntryForm userId={userId} promptId={promptId} />
      ) : (
        <div>
          <p>{existingEntry ? existingEntry.content : 'No existing entry found.'}</p>
        </div>
      )} */}
    </Card>
  );
}
