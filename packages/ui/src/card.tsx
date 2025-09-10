import { type JSX } from 'react';

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className={`${className} p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800`}
    >
      {children}
    </div>
  );
}
