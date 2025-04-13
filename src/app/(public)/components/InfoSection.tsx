import {
  BarChart3,
  CalendarDaysIcon,
  PiggyBank,
  QrCode,
  Users,
} from 'lucide-react';
import React from 'react';

export default function InfoSection() {
  return (
    <div className='-mt-8 flex w-full flex-col items-center overflow-y-auto'>
      <article>
        <h2 className='mb-6 text-center text-xl font-semibold text-gray-800 dark:text-gray-100'>
          Why Choose <span className='text-primary-600'>MoneyBook?</span>
        </h2>
        <ul className='mb-10 space-y-3'>
          <li className='flex items-center gap-4 rounded-md bg-slate-50 p-3 shadow-md dark:bg-slate-900'>
            <BarChart3 className='text-blue-500' />
            <div className='flex flex-col items-start'>
              <p className='font-semibold'>Track</p>
              <p className='text-gray-500 dark:text-gray-400'>
                your daily expenses effortlessly
              </p>
            </div>
          </li>
          <li className='flex items-center gap-4 rounded-md bg-slate-50 p-3 shadow-md dark:bg-slate-900'>
            <PiggyBank className='text-green-500' />
            <div className='flex flex-col items-start'>
              <p className='font-semibold'>Set Budgets</p>
              <p className='text-gray-500 dark:text-gray-400'>
                and monitor your savings
              </p>
            </div>
          </li>
          <li className='flex items-center gap-4 rounded-md bg-slate-50 p-3 shadow-md dark:bg-slate-900'>
            <Users className='text-purple-500' />
            <div className='flex flex-col items-start'>
              <p className='font-semibold'>Split Expenses</p>
              <p className='text-gray-500 dark:text-gray-400'>
                seamlessly with friends & groups
              </p>
            </div>
          </li>
          <li className='flex items-center gap-4 rounded-md bg-slate-50 p-3 shadow-md dark:bg-slate-900'>
            <QrCode className='text-red-500' />
            <div className='flex flex-col items-start'>
              <p className='font-semibold'>Secure Transactions</p>
              <p className='text-gray-500 dark:text-gray-400'>
                with QR & OTP verification
              </p>
            </div>
          </li>
          <li className='flex items-center gap-4 rounded-md bg-slate-50 p-3 shadow-md dark:bg-slate-900'>
            <CalendarDaysIcon className='text-orange-500' />
            <div className='flex flex-col items-start'>
              <p className='font-semibold'>Stay Organized</p>
              <p className='text-gray-500 dark:text-gray-400'>
                with transaction history
              </p>
            </div>
          </li>
        </ul>
      </article>
    </div>
  );
}
