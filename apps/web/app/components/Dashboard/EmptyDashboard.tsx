import Link from 'next/link';

export function EmptyDashboard() {
  return (
    <div className="min-h-screen bg-ps-primary-50">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-ps-primary mb-6">
            Welcome to Your Journey
          </h1>
          <p className="text-xl text-ps-secondary mb-8 leading-relaxed">
            Ready to start reflecting? Your first thoughtful prompt is waiting 
            for you. No pressure, no commitment—just gentle questions that help 
            you explore your thoughts.
          </p>
          
          <div className="bg-ps-secondary rounded-lg p-8 mb-8">
            <h3 className="text-lg font-semibold text-ps-primary mb-4">
              How it works:
            </h3>
            <div className="space-y-3 text-left text-ps-secondary">
              <p>📧 Receive thoughtful prompts in your inbox</p>
              <p>✍️ Write as much or as little as you want</p>
              <p>🌱 Build a sustainable reflection practice</p>
            </div>
          </div>

          <Link 
            href="/prompt"
            className="inline-block bg-ps-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-ps-primary-600 transition-colors"
          >
            Start Writing
          </Link>
          
          <p className="text-sm text-ps-secondary-600 mt-4">
            Your entries are private and secure
          </p>
        </div>
      </div>
    </div>
  );
}