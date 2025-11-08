'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/prompt', label: 'Your Prompts' },
  ];

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

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-ps-primary'
                      : 'text-ps-secondary hover:text-ps-primary'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--ps-primary-100)' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}