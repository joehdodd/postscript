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
      <div className="container mx-auto p-4 md:px-6 md:py-4">
        <div className="flex gap-4 flex-col md:items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg md:text-2xl font-bold text-ps-primary hover:opacity-80 transition-opacity"
          >
            Postscript
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2 justify-between md:items-center md:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${isActive
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
