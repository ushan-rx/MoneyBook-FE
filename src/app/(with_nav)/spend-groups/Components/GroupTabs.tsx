'use client';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import AddGroupDrawer from '../components/AddGroupDrawer';
import { Tab, Tabs } from '@heroui/tabs';
import LoadingDots from '@/components/LoadingDots';
const GroupList = React.lazy(() => import('../components/GroupList'));

export default function GroupTabs() {
  return (
    <Tabs
      aria-label='Options'
      classNames={{
        tabList:
          'gap-6 w-full relative rounded-none p-0 border-b border-divider',
        cursor: 'w-full bg-primary-400',
        tab: 'px-0 h-12',
        tabContent:
          'group-data-[selected=true]:text-primary-400 text-base font-bold',
      }}
      color='primary'
      variant='underlined'
      fullWidth
    >
      <Tab key='created' title='Created'>
        <header
          className={`flex flex-row items-center justify-between px-2 pb-2`}
        >
          <span className='pl-2 text-2xl font-semibold text-foreground/80'>
            Created Groups
          </span>
          <div className='flex gap-4'>
            <Button
              isIconOnly
              radius='full'
              variant='faded'
              color='primary'
              aria-label='Search Group'
            >
              <Search />
              <Link href={'#'}></Link>
            </Button>
            <AddGroupDrawer />
          </div>
        </header>
        <section className='relative h-[calc(100vh-225px)] overflow-y-auto p-2'>
          <Divider />
          <Suspense fallback={<LoadingDots />}>
            <GroupList />
          </Suspense>
        </section>
      </Tab>
      <Tab key='joined' title='Joined'>
        <header className='flex flex-row items-center justify-between px-2 pb-2'>
          <span className='pl-2 text-2xl font-semibold text-foreground/80'>
            Joined Groups
          </span>
          <div className='flex gap-4'>
            <Button
              isIconOnly
              radius='full'
              variant='faded'
              color='primary'
              aria-label='Search Group'
            >
              <Search />
              <Link href={'#'}></Link>
            </Button>
          </div>
        </header>
        <section className='h-[calc(100vh-225px)] overflow-y-auto p-2'>
          <Divider />
          <Suspense fallback={<LoadingDots />}>
            <GroupList />
          </Suspense>
        </section>
      </Tab>
    </Tabs>
  );
}
