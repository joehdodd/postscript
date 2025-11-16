'use client';
import { useEffect, useState } from 'react';

export default function TypewriterText() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = '_postscript';
  const typingSpeed = 150; // milliseconds

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
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
