import LoadingDots from '@/components/LoadingDots';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import AddTransactionDrawer from './components/AddTransactionDrawer';
import CreateMutualTransaction from './components/CreateMutualTransaction';

export default function Transactions() {
  return (
    <div className='flex flex-col'>
      <header className='flex flex-row items-center justify-between px-2 py-4'>
        <span className='pl-2 text-2xl font-semibold text-primary'>
          Transactions
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
          <AddTransactionDrawer />
        </div>
      </header>
      <Divider />
      <section className='h-[calc(100vh-225px)] overflow-y-auto p-2'>
        {/* <Suspense fallback={<LoadingDots />}> */}
        {/* <FriendList /> */}
        {/* </Suspense> */}
      </section>
    </div>
  );
}
