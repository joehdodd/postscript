import { fetchPrompt } from '../../actions/prompt';

export default async function Prompt({ promptId }: { promptId: string }) {
  const prompt = await fetchPrompt(promptId);

  if (!prompt) {
    return null;
  }

  return (
    <div className="mb-3 md:mb-6">
      <p className="md:text-lg text-ps-primary italic">
        &ldquo;{prompt.content}&rdquo;
      </p>
      {prompt.sentAt && (
        <p className="text-sm text-ps-primary mt-2">
          Sent {new Date(prompt.sentAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
