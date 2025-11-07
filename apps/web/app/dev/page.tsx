import { generateTestToken, createTestPrompt } from '../actions/dev';
import { Card } from '../components/Card';

export default function DevPage() {
  async function testMagicLink(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const createPrompt = formData.get('createPrompt') === 'on';

    // Generate test data
    const { userId, testUrl } = await generateTestToken(email);
    
    if (createPrompt) {
      const prompt = await createTestPrompt(userId);
      const tokenWithPrompt = await generateTestToken(email, prompt.id);
      console.log('\n=== Test Magic Link with Prompt ===');
      console.log(`Email: ${email}`);
      console.log(`User ID: ${userId}`);
      console.log(`Prompt ID: ${prompt.id}`);
      console.log(`Test URL: ${tokenWithPrompt.testUrl}`);
      console.log('==================================\n');
    } else {
      console.log('\n=== Test Magic Link ===');
      console.log(`Email: ${email}`);
      console.log(`User ID: ${userId}`);
      console.log(`Test URL: ${testUrl}`);
      console.log('=======================\n');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Dev Tools</h1>
        <p className="text-sm text-slate-600 mb-6">
          Generate magic link tokens for testing (dev only)
        </p>
        
        <form action={testMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              defaultValue="test@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="createPrompt"
              id="createPrompt"
              className="mr-2"
            />
            <label htmlFor="createPrompt" className="text-sm">
              Create test prompt
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700"
          >
            Generate Magic Link
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-100 rounded text-sm">
          <p className="font-medium mb-2">How to test:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Enter an email address</li>
            <li>Optionally check &ldquo;Create test prompt&rdquo;</li>
            <li>Click &ldquo;Generate Magic Link&rdquo;</li>
            <li>Check terminal for the test URL</li>
            <li>Copy and paste the URL in your browser</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
