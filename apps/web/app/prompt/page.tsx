import { redirect } from 'next/navigation'
import { Card } from '../components/Card';
import { requireAuth } from '../actions/auth';
import { fetchUserPrompts } from '../actions/prompt';

// Define the Prompt type if not already imported
type Prompt = {
    id: string;
    content: string;
    createdAt: string | number | Date;
    isOpen: boolean;
};

export default async function Prompt() {
    const { userId } = await requireAuth();
    if (!userId) {
        redirect('/');
    }
    const prompts = await fetchUserPrompts(userId);
    return (
        <Card className="max-w-3/4 w-full h-full overflow-y-scroll">
            <div className="mb-6">
                <h2 className="text-xl text-slate-600 font-bold">
                    Your Prompts
                </h2>
                <p>You may still respond to any open prompts.</p>
            </div>
            {prompts?.map((prompt: Prompt) => (
                <div key={prompt.id} className="mb-4 p-4 rounded shadow-md bg-slate-200">
                    <p className="text-lg">{prompt.content}</p>
                    <p className="text-sm text-gray-500">
                        Created at: {new Date(prompt.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                        Status: {prompt.isOpen ? 'Open' : 'Closed'}
                    </p>
                </div>
            ))}
        </Card>
    );
}
