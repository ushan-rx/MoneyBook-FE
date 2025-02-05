import React from 'react';
import { Divider } from '@heroui/divider';

export default function MutualTransactionsCard() {
  return (
    <div className='flex flex-col text-center'>
      <span className='-m-1 text-lg font-semibold text-slate-600 dark:text-slate-400'>
        Jan - 2025
      </span>
      <ol className='grid w-full grid-cols-2 gap-y-1 px-3 pb-4 text-base text-slate-700 dark:text-slate-200'>
        <li className='text-left text-primary-700 dark:text-zinc-400'>
          New Loans:
        </li>
        <li className='text-right font-semibold text-primary-700 dark:text-zinc-400'>
          Rs.10,000
        </li>

        <li className='text-left text-primary-700 dark:text-zinc-400'>
          New Borrowings:
        </li>
        <li className='text-right font-semibold text-primary-700 dark:text-zinc-400'>
          Rs.5,000
        </li>

        <li className='text-left'>Collected Loans:</li>
        <li className='text-right font-semibold'>Rs.5,000</li>

        <li className='text-left'>Settled Borrowings:</li>
        <li className='text-right font-semibold'>Rs.5,000</li>
      </ol>
      <Divider />
      <ol>
        <li className='mt-4 w-full rounded-md border border-ring/60 bg-background/70 px-3 py-2 text-lg'>
          Total Loans: <span className='font-semibold'>Rs.10,000</span>
        </li>
        <li className='mt-4 w-full rounded-md border border-ring/60 bg-background/70 px-3 py-2 text-lg'>
          Total Borrowings: <span className='font-semibold'>Rs.5,000</span>
        </li>
      </ol>
    </div>
  );
}
