'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Spend Groups', href: '/spend-groups', icon: '💳' },
    { name: 'Friends', href: '/friends', icon: '👥' },
    { name: 'Home', href: '/home', icon: '🏠' },
    { name: 'Transactions', href: '/transactions', icon: '💸' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];
  return (
    <nav className='shadow-t fixed bottom-0 left-0 right-0 z-10 bg-white'>
      <div className='mx-auto flex max-w-screen-lg justify-around p-2'>
        {navigationItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center ${
              pathname === item.href ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <span className='text-2xl'>{item.icon}</span>
            <span className='text-xs'>{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
