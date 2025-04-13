import formatCurrency from '@/lib/currencyFormatter';
import { Card, CardBody } from '@heroui/card';
import React from 'react';

interface GroupData {
  id: string;
  name: string;
  groupTotalSpend?: number;
  transactionsCount: number;
}

const group: GroupData = {
  id: '1',
  name: 'Group 1',
  groupTotalSpend: 10000,
  transactionsCount: 10,
};

export default function MyGroupStatCard() {
  return (
    <div>
      <Card
        classNames={{
          base: 'rounded-t-none bg-gradient-to-tr from-neutral-50 via-zinc-300 to-stone-200 dark:bg-gradient-to-bl dark:from-zinc-950 dark:via-neutral-700 dark:to-slate-900',
        }}
      >
        <CardBody>
          <div className='relative flex flex-col'>
            <span className='text-md absolute left-1'>Group total spend: </span>
            {group.groupTotalSpend && (
              <p className='mb-3 mt-6 rounded-md border border-slate-50 p-2 text-center text-3xl font-bold dark:border-slate-50/50'>
                {formatCurrency(group.groupTotalSpend, 'LKR')}
              </p>
            )}
            <p>Number of transactions: {group.transactionsCount}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
