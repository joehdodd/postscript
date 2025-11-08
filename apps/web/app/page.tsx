'use client';

import { useState, useEffect } from 'react';

function TypewriterText() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = '_postscript';
  const typingSpeed = 150; // milliseconds

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <h1 className="text-6xl font-bold text-ps-primary mb-6 tracking-tight">
      {displayText}
      <span className="animate-pulse text-ps-primary">|</span>
    </h1>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, var(--ps-neutral-50), var(--ps-neutral-100))' }}>
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <TypewriterText />
          <p className="text-xl text-ps-secondary mb-8 leading-relaxed">
            Daily prompts delivered to your inbox. Reflect, write, and grow one entry at a time.
          </p>
          <div className="inline-flex items-center gap-4 text-sm text-ps-secondary">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ps-secondary-500)' }}></div>
              Personal reflection
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ps-primary-500)' }}></div>
              Daily prompts
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ps-accent-500)' }}></div>
              Mindful moments
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-ps-secondary backdrop-blur-sm border-ps">
            <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--ps-primary-500), var(--ps-primary-600))' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-ps-primary mb-2">Daily Prompts</h3>
            <p className="text-sm text-ps-secondary">
              Thoughtful questions delivered to your inbox to spark reflection and creativity.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-ps-secondary backdrop-blur-sm border-ps">
            <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--ps-secondary-500), var(--ps-secondary-600))' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="font-semibold text-ps-primary mb-2">Simple Writing</h3>
            <p className="text-sm text-ps-secondary">
              Clean, distraction-free interface for capturing your thoughts and reflections.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-ps-secondary backdrop-blur-sm border-ps">
            <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--ps-accent-500), var(--ps-accent-600))' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-ps-primary mb-2">Mindful Moments</h3>
            <p className="text-sm text-ps-secondary">
              Build a habit of daily reflection and mindfulness, one prompt at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-8 border-ps mt-16" style={{ borderTopWidth: '1px' }}>
        <div className="text-center text-sm text-ps-secondary">
          <p>Start your reflection journey today</p>
        </div>
      </div>
    </div>
  );
}
