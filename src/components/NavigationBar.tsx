'use client';
import { useRouter, usePathname } from 'next/navigation';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems: { name: string; href: string; icon: IconName }[] = [
    { name: 'Groups', href: '/spend-groups', icon: 'users' },
    { name: 'Friends', href: '/friends', icon: 'contact' },
    { name: 'Home', href: '/home', icon: 'home' },
    { name: 'Transactions', href: '/transactions', icon: 'wallet-cards' },
    { name: 'Profile', href: '/profile', icon: 'user' },
  ];

  return (
    <nav className='fixed inset-x-0 bottom-0 z-10 flex justify-center bg-gray-100 px-2 pb-3 pt-2 dark:bg-gray-900'>
      <div className='mx-auto w-full max-w-md'>
        <div className='rounded-lg bg-white shadow-lg dark:bg-black'>
          <div className='flex justify-center gap-2'>
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`mx-auto flex w-full items-end justify-center pt-2 text-center ${pathname === item.href ? 'text-indigo-500' : 'text-gray-400'}`}
              >
                <span className='block py-1'>
                  <DynamicIcon className='inline-block' name={item.icon} />
                  <span className='block pb-2 text-sm'>{item.name}</span>
                  {pathname === item.href ? (
                    <span className='mx-auto block h-1 w-5 rounded-full bg-indigo-500'></span>
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
