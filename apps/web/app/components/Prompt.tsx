import { fetchPrompt } from '../actions/prompt';

export default async function Prompt({ promptId }: { promptId: string }) {
    const prompt = await fetchPrompt(promptId);
    return (
        <div>
            <p>{prompt.content}</p>
        </div>
    );
}