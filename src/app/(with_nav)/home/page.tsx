import React from 'react';
import StatsViewer from './components/StatsViewer';
import RecentTransactions from './components/RecentTransactions';
import { Button } from '@heroui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className='flex flex-col'>
        <StatsViewer />
        <div className='sticky top-[60px] z-[900] mb-2 mt-4 flex max-h-6 flex-row items-center gap-2 border-b-1 bg-background px-3 py-6'>
          <span className='text-lg font-semibold text-slate-700 dark:text-slate-300'>
            Recent Transactions
          </span>
          <Button
            variant='light'
            color='primary'
            className='text-base underline'
          >
            <Link href={'#'}>More</Link>
          </Button>
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
}
