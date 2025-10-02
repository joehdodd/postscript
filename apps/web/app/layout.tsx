import './globals.css';
import type { Metadata } from 'next';

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
      <body className="p-4 flex justify-center bg-slate-200 text-slate-700">
        {children}
      </body>
    </html>
  );
}
