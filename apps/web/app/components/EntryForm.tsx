'use client';
import { createEntry } from "../actions/entry";

export default function EntryForm() {
    return (
        <form action={createEntry} className="mt-4 flex flex-col gap-4">
            <textarea
                name="content"
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100"
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
};