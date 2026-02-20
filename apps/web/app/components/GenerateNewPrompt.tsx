'use client';
import { useState } from 'react';
import { generatePrompt } from '../actions/prompt/generatePrompt';

const GenerateNewPrompt = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className="inline-block px-6 py-3 mt-2 text-white font-medium rounded-lg transition-all duration-200"
      style={{
        background:
          'linear-gradient(135deg, var(--ps-primary-500) 0%, var(--ps-primary-600) 100%)',
      }}
      onClick={async () => {
        setIsLoading(true);
        try {
          const response = await generatePrompt();
          if (response.success) {
            location.reload(); // Refresh the page to load new prompts
          } else {
            alert('Failed to generate prompt: ' + response.message);
          }
        } catch (error) {
          console.error('Error calling generatePrompt:', error);
          alert('An unexpected error occurred.');
        } finally {
          setIsLoading(false);
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? 'Generating...' : 'Generate New Prompt'}
    </button>

  )

}

export default GenerateNewPrompt;
