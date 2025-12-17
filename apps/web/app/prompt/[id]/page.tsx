import { redirect } from 'next/navigation';
import { fetchPrompt } from '../../actions/prompt';
import { fetchEntryByPromptAndUser } from '../../actions/entry';
import { requireAuth } from '../../actions/auth';
import PromptHeader from '../../components/Prompt/PromptHeader';
import PromptContent from '../../components/Prompt/PromptContent';
import PromptResponse from '../../components/Prompt/PromptResponse';
import PromptActions from '../../components/Prompt/PromptActions';

type PromptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromptDetail({ params }: PromptPageProps) {
  const { userId } = await requireAuth();
  if (!userId) {
    redirect('/');
  }

  const { id } = await params;
  const [prompt, existingEntry] = await Promise.all([
    fetchPrompt(id),
    fetchEntryByPromptAndUser(id, userId),
  ]);

  if (!prompt) {
    redirect('/prompt');
  }

  return (
    <div className="min-h-screen bg-ps-primary">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-ps-secondary rounded-lg border-ps p-8 mb-6 border shadow-md">
            <PromptHeader prompt={prompt} />
            <PromptContent content={prompt.content} />
            <hr className="my-6 border-ps-border" />
            <PromptResponse
              promptId={id}
              isOpen={prompt.isOpen}
              existingEntry={existingEntry}
            />
            <PromptActions existingEntry={existingEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}
