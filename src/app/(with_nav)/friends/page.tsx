import { Button } from '@heroui/button';
import Link from 'next/link';
import React, { Suspense, lazy } from 'react';
import { CirclePlus, Search } from 'lucide-react';
import { Divider } from '@heroui/divider';
import LoadingDots from '@/components/LoadingDots';
const FriendList = lazy(() => import('./components/FriendList'));
const AddFriendDrawer = lazy(() => import('./components/AddFriendDrawer'));

export default function Friends() {
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
          <AddFriendDrawer />
          {/* <Button
            isIconOnly
            radius='full'
            variant='faded'
            color='primary'
            aria-label='Add friend'
          >
            <CirclePlus />
            <Link href={'#'}></Link>
          </Button> */}
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
