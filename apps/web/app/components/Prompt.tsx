import { fetchPrompt } from '../actions/prompt';

export default async function Prompt({ promptId }: { promptId: string }) {
    const prompt = await fetchPrompt(promptId);
    return (
        <div>
            <h3 className="text-lg font-semibold">Your Prompt for Today</h3>
            <p>{prompt.content}</p>
        </div>
    );
}