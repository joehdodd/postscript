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
      <body className="bg-ps-primary text-ps-primary">
        {children}
      </body>
    </html>
  );
}
