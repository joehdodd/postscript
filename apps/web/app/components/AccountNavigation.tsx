'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { id: 'account', label: 'Account Info', href: '/account' },
  { id: 'billing', label: 'Billing', href: '/account/billing' },
  { id: 'security', label: 'Security', href: '/account/security' },
];

export default function AccountNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-ps-secondary rounded-lg p-1 shadow-sm">
      <div className="flex space-x-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/account' && pathname === '/account');
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-ps-primary-600 text-white shadow-sm'
                  : 'text-ps-text-secondary hover:text-ps-text-primary hover:bg-ps-neutral-100'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}