import { Card } from '@repo/ui/card';
import EntryForm from '../components/EntryForm';
import Prompt from '../components/Prompt';
import { requireAuth } from '../utils/auth-util';
import { redirect } from 'next/navigation';

type EntryPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Entry({ searchParams }: EntryPageProps) {
  const { userId, promptId } = await requireAuth(searchParams);
  if (!userId || !promptId) {
    redirect('/');
  }
  return (
    <Card className="max-w-md w-full">
      <h2 className="text-xl text-slate-600 dark:text-slate-200 font-bold">
        Add a new entry
      </h2>
      <Prompt promptId={promptId} />
      <EntryForm userId={userId} promptId={promptId} />
    </Card>
  );
}
