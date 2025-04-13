import { Button } from '@heroui/button';
import Link from 'next/link';
import React, { Suspense, lazy } from 'react';
import { Search } from 'lucide-react';
import { Divider } from '@heroui/divider';
import LoadingDots from '@/components/LoadingDots';
import { requireAuth } from '@/lib/server-auth';
const FriendList = lazy(() => import('./components/FriendList'));
const AddFriendDrawer = lazy(() => import('./components/AddFriendDrawer'));

export default async function Friends() {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return (
      <div className='flex flex-col'>
        <header className='flex flex-row items-center justify-between px-2 py-4'>
          <span className='pl-2 text-2xl font-semibold text-primary'>
            Friends
          </span>
          <div className='flex gap-4'>
            <Button
              isIconOnly
              radius='full'
              variant='faded'
              color='primary'
              aria-label='search friend'
            >
              <Search />
              <Link href={'#'}></Link>
            </Button>
            <Suspense fallback={<LoadingDots />}>
              <AddFriendDrawer />
            </Suspense>
          </div>
        </header>
        <Divider />
        <section className='h-[calc(100vh-225px)] overflow-y-auto p-2'>
          <Suspense fallback={<LoadingDots />}>
            <FriendList />
          </Suspense>
        </section>
      </div>
    );
  }
}
