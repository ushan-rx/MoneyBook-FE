import DateTimeComponent from '@/components/DateTimeComponent';
import React from 'react';

interface GroupList {
  id: string;
  name: string;
  groupTotalSpend?: number;
  LastTransaction?: {
    name: string;
    date: string;
  };
}

const data: GroupList[] = [
  {
    id: '1',
    name: 'Boarding group',
    groupTotalSpend: 2000,
    LastTransaction: {
      name: 'foods',
      date: '2025-02-07T12:08:30.000Z',
    },
  },
  {
    id: '2',
    name: 'Class friends',
    groupTotalSpend: 1000,
    LastTransaction: {
      name: 'credit',
      date: '2025-02-08T12:09:30.000Z',
    },
  },
  {
    id: '3',
    name: 'Family',
  },
  {
    id: '4',
    name: 'Starbucks',
    groupTotalSpend: 0,
  },
];

export default function GroupList() {
  return (
    <article className='flow-root w-full px-4'>
      <ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
        {data.map((group) => (
          <li key={group.id} className='py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <h3 className='text-sm font-semibold text-foreground'>
                  {group.name}
                </h3>
                {group.groupTotalSpend && group.groupTotalSpend > 0 ? (
                  <p className='text-xs font-light text-foreground/80'>
                    {`Total spends: Rs.${group.groupTotalSpend}`}
                  </p>
                ) : (
                  <p className='text-xs font-light text-gray-500'>
                    No transactions yet
                  </p>
                )}
              </div>
              <div className='flex flex-col items-end'>
                <p className='text-sm font-light text-foreground/80'>
                  {group.LastTransaction && (
                    <DateTimeComponent
                      dateString={group.LastTransaction?.date}
                      type='default'
                    />
                  )}
                </p>
                <p className='text-sm text-foreground/60'>
                  {group.LastTransaction?.name}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
