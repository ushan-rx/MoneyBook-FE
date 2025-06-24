import type { FriendSummary } from '@/types/TransactionTypes';
import { Card } from '@heroui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FriendSummaryCardProps {
  summary: FriendSummary;
  isVisible: boolean;
}

export function FriendSummaryCard({
  summary,
  isVisible,
}: FriendSummaryCardProps) {
  const balanceColor =
    summary.balance > 0
      ? 'text-red-600'
      : summary.balance < 0
        ? 'text-green-600'
        : 'text-gray-600';
  const balanceText =
    summary.balance > 0
      ? `You owe Rs.${summary.balance}`
      : summary.balance < 0
        ? `Owes you Rs.${Math.abs(summary.balance)}`
        : 'All settled up!';

  return summary != null ? (
    <div
      className={`sticky top-16 z-10 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Card className='mx-2 mb-6 border-0 shadow-xl dark:bg-gray-900'>
        <div className='m-2 mx-4 grid grid-cols-2 gap-4'>
          <div className='rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-2 text-center shadow-sm dark:from-slate-800/70 dark:to-slate-800/30'>
            <div className='mb-1 flex items-center justify-center gap-2'>
              <div className='flex items-center justify-center rounded-full bg-green-200'>
                <TrendingUp className='size-4 text-green-600' />
              </div>
              <span className='text-sm font-medium text-green-700 dark:text-green-500'>
                You Loaned
              </span>
            </div>
            <p className='text-lg font-bold text-green-600 dark:text-green-500'>
              Rs.{summary.totalBorrowed}
            </p>
          </div>
          <div className='rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-2 text-center shadow-sm dark:from-slate-800/70 dark:to-slate-800/30'>
            <div className='mb-1 flex items-center justify-center gap-2'>
              <div className='flex items-center justify-center rounded-full bg-red-200 dark:text-red-500'>
                <TrendingDown className='size-4 text-red-600' />
              </div>
              <span className='text-sm font-medium text-red-700 dark:text-red-500'>
                You Borrowed
              </span>
            </div>
            <p className='text-lg font-bold text-red-600 dark:text-red-500'>
              Rs.{summary.totalLent}
            </p>
          </div>
        </div>

        <div className='mx-4 mb-3 rounded-xl bg-gray-100 p-3 text-center shadow-sm dark:bg-black/30'>
          <div className='mb-1 flex items-center justify-center gap-2'>
            <div className='flex items-center justify-center rounded-full bg-gray-200'>
              <DollarSign className='size-4 text-gray-600' />
            </div>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
              Balance
            </span>
          </div>
          <p className={`text-xl font-bold ${balanceColor}`}>{balanceText}</p>
        </div>
      </Card>
    </div>
  ) : (
    <Card className='mx-2 mb-6 flex flex-col justify-center border-0 align-middle shadow-xl dark:bg-gray-900'>
      <div className='text-center text-danger-500'>Could not load data</div>
    </Card>
  );
}
