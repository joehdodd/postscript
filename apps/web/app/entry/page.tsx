import { Card } from "@repo/ui/card";
import EntryForm from "../components/EntryForm";

export default async function Entry() {
  return (
    <Card className="max-w-md w-full">
      <h2 className="text-xl text-slate-600 dark:text-slate-200 font-bold">Add a new entry</h2>
      <EntryForm/>
    </Card>
  );
}
