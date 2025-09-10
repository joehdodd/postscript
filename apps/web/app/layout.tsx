import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '_postscript',
  description: 'Your personal journaling app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="p-4 bg-slate-200 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
