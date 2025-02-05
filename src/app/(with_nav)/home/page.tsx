import React from 'react';
import StatsViewer from './components/StatsViewer';
import RecentTransactions from './components/RecentTransactions';

export default function Home() {
  return (
    <div>
      <div className='flex flex-col'>
        <StatsViewer />
        <span className='sticky top-[60px] mx-3 mb-4 mt-2 max-h-6 py-2 text-lg font-semibold text-slate-700 dark:text-slate-300'>
          Recent Transactions
        </span>
        <RecentTransactions />
      </div>
    </div>
  );
}
