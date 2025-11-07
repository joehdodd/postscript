'use client';
import { createEntry } from '../actions/entry';

export default function EntryForm({
  userId,
  promptId,
}: {
  userId: string;
  promptId: string;
}) {
  return (
    <form
      action={async (formData: FormData) => {
        await createEntry(formData, userId, promptId);
      }}
      className="h-full mt-4 flex flex-col gap-4"
    >
      <textarea
        name="content"
        className="w-full h-[65%] p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100"
        rows={5}
        placeholder="Write your thoughts here..."
      ></textarea>
      <button
        type="submit"
        className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Save Entry
      </button>
    </form>
  );
}
