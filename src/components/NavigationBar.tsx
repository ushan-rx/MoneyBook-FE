'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Contact, Users, WalletCards, User } from 'lucide-react';

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className='fixed inset-x-0 bottom-0 z-10 flex justify-center bg-gray-100 px-2 pb-3 pt-2 dark:bg-gray-900'>
      <div className='mx-auto w-full max-w-md'>
        <div className='rounded-lg bg-white shadow-lg dark:bg-black'>
          <div className='flex justify-center gap-2'>
            <button
              onClick={() => router.push('/spend-groups')}
              className={`mx-auto flex w-full items-end justify-center pt-2 text-center ${pathname === '/spend-groups' ? 'text-indigo-500' : 'text-gray-400'}`}
            >
              <span className='block py-1'>
                <Users className='inline-block' />
                <span className='block pb-2 text-sm'>Groups</span>
                {pathname === '/spend-groups' ? (
                  <span className='mx-auto block h-1 w-5 rounded-full bg-indigo-500'></span>
                ) : null}
              </span>
            </button>
            <button
              onClick={() => router.push('/friends')}
              className={`mx-auto flex w-full items-end justify-center pt-2 text-center ${pathname === '/friends' ? 'text-indigo-500' : 'text-gray-400'}`}
            >
              <span className='block py-1'>
                <Contact className='inline-block' />
                <span className='block pb-2 text-sm'>Friends</span>
                {pathname === '/friends' ? (
                  <span className='mx-auto block h-1 w-5 rounded-full bg-indigo-500'></span>
                ) : null}
              </span>
            </button>
            <button
              onClick={() => router.push('/home')}
              className={`mx-auto flex w-full items-end justify-center pt-2 text-center ${pathname === '/home' ? 'text-indigo-500' : 'text-gray-400'}`}
            >
              <span className='block py-1'>
                <Home className='inline-block' />
                <span className='block pb-2 text-sm'>Home</span>
                {pathname === '/home' ? (
                  <span className='mx-auto block h-1 w-5 rounded-full bg-indigo-500'></span>
                ) : null}
              </span>
            </button>
            <button
              onClick={() => router.push('/transactions')}
              className={`mx-auto flex w-full items-end justify-center pt-2 text-center ${pathname === '/transactions' ? 'text-indigo-500' : 'text-gray-400'}`}
            >
              <span className='block py-1'>
                <WalletCards className='inline-block' />
                <span className='block pb-2 text-sm'>Transactions</span>
                {pathname === '/transactions' ? (
                  <span className='mx-auto block h-1 w-5 rounded-full bg-indigo-500'></span>
                ) : null}
              </span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className={`mx-auto flex w-full items-end justify-center pt-2 text-center ${pathname === '/profile' ? 'text-indigo-500' : 'text-gray-400'}`}
            >
              <span className='block py-1'>
                <User className='inline-block' />
                <span className='block pb-2 text-sm'>Profile</span>
                {pathname === '/profile' ? (
                  <span className='mx-auto block h-1 w-5 rounded-full bg-indigo-500'></span>
                ) : null}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
