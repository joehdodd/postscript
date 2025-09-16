import { Card } from '@repo/ui/card';
import EntryForm from '../components/EntryForm';
import { redirect } from 'next/navigation';
import { auth } from '../actions/auth';
import { getTokenFromCookieOrSearchParams } from '../utils/auth-util';

type EntryPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Entry({ searchParams }: EntryPageProps) {
  const tokenParam = (await searchParams).token;
  const token = await getTokenFromCookieOrSearchParams(new URLSearchParams({ token: Array.isArray(tokenParam) ? tokenParam.join(',') : tokenParam || '' }));
  if (!token) {
    redirect('/');
  }
  const authResult = await auth(token);
  if (!authResult.valid) {
    redirect('/');
  }
  return (
    <Card className="max-w-md w-full">
      <h2 className="text-xl text-slate-600 dark:text-slate-200 font-bold">
        Add a new entry
      </h2>
      <EntryForm />
    </Card>
  );
}
