'use client';
import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Tabs, Tab } from '@heroui/tabs';

import { Suspense, lazy } from 'react';
import LoadingDots from '@/components/LoadingDots';

const PersonalSpendingCard = lazy(() => import('./PersonalSpendingCard'));
const MutualTransactionsCard = lazy(() => import('./MutualTransactionsCard'));

export default function StatsViewer() {
  const [selected, setSelected] = React.useState<string | number | null>(
    'personal'
  );

  return (
    <div className='flex w-full flex-col'>
      <Card
        shadow='sm'
        className='mx-3 mt-2 h-[380px] max-w-full bg-gradient-to-b from-white to-cyan-50 dark:bg-gradient-to-t dark:from-blue-950 dark:via-sky-900 dark:to-slate-950'
      >
        <Suspense fallback={<LoadingDots />}>
          <CardBody className='justify-end overflow-hidden'>
            <Tabs
              fullWidth
              aria-label='stats-viewer'
              selectedKey={selected}
              size='md'
              placement='bottom'
              onSelectionChange={setSelected}
              variant='underlined'
            >
              <Tab key='personal' title='Personal' className='text-base'>
                <div className='flex flex-col gap-2 text-medium'>
                  <Card
                    shadow='none'
                    className='border-none bg-transparent text-sm'
                  >
                    <CardHeader className='justify-center pb-0'>
                      <span className='text-lg font-medium'>
                        Personal Transactions - This month
                      </span>
                    </CardHeader>
                    <CardBody className='pb-0'>
                      <PersonalSpendingCard />
                    </CardBody>
                  </Card>
                </div>
              </Tab>
              <Tab key='mutual' title='Mutual' className='text-base'>
                <div className='flex flex-col gap-2 text-medium'>
                  <Card
                    shadow='none'
                    className='border-none bg-transparent text-sm'
                  >
                    <CardHeader className='justify-center pb-0'>
                      <span className='text-lg font-medium'>
                        Mutual Transactions
                      </span>
                    </CardHeader>
                    <CardBody className='pb-0'>
                      <MutualTransactionsCard />
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Suspense>
      </Card>
    </div>
  );
}
