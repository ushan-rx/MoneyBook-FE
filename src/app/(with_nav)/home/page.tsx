import React, { Suspense } from 'react';
const StatsViewer = React.lazy(() => import('./components/StatsViewer'));
const RecentTransactions = React.lazy(
  () => import('./components/RecentTransactions')
);
import { Button } from '@heroui/button';
import Link from 'next/link';
import LoadingDots from '@/components/LoadingDots';
import { requireAuth } from '@/lib/server-auth';

export default async function Home() {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return (
      <div>
        <div className='flex flex-col'>
          <Suspense fallback={<LoadingDots />}>
            <StatsViewer />
          </Suspense>
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
          <Suspense fallback={<LoadingDots />}>
            <RecentTransactions />
          </Suspense>
        </div>
      </div>
    );
  }
}
