'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ hasDashboardAccess }: { hasDashboardAccess?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/prompt', label: 'Your Prompts' },
    { href: '/account', label: 'Account' },
  ];

  if (hasDashboardAccess) {
    navItems.unshift({ href: '/', label: 'Dashboard' });
  }

  return (
    <nav className="border-ps" style={{ borderBottomWidth: '1px' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-md md:text-2xl font-bold text-ps-primary hover:opacity-80 transition-opacity"
          >
            _postscript
          </Link>

          {/* Navigation Links */}
          <div className="flex md:items-center md:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'text-ps-primary bg-ps-primary/10 dark:bg-ps-primary/20'
                    : 'text-ps-secondary hover:text-ps-primary hover:bg-ps-primary/5 dark:hover:bg-ps-primary/10'
                    }`}
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
