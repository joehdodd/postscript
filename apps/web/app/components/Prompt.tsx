import { fetchPrompt } from '../actions/prompt';

export default async function Prompt({ promptId }: { promptId: string }) {
  const prompt = await fetchPrompt(promptId);
  
  if (!prompt) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <p className="text-lg text-slate-700 italic">
        &ldquo;{prompt.content}&rdquo;
      </p>
      {prompt.sentAt && (
        <p className="text-sm text-slate-400 mt-2">
          Sent {new Date(prompt.sentAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}