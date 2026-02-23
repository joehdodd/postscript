import './globals.css';
import type { Metadata } from 'next';
import ConditionalNavigation from './components/ConditionalNavigation';

export const metadata: Metadata = {
  title: 'Postscript',
  description: 'Your personal journaling app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ps-primary text-ps-primary">
        <ConditionalNavigation />
        {children}
      </body>
    </html>
  );
}
