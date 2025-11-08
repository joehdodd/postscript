'use client';

import Link from 'next/link';

export default function PublicNavigation() {
  return (
    <nav className="border-ps" style={{ borderBottomWidth: '1px' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-ps-primary hover:opacity-80 transition-opacity"
          >
            _postscript
          </Link>

          {/* Public Navigation - minimal or empty */}
          <div className="flex items-center gap-6">
            {/* You can add public links here if needed, like About, Login, etc. */}
          </div>
        </div>
      </div>
    </nav>
  );
}