// Definition: Top navigation bar for pages without bottom navigation bar
// example children: button with drawer component to be shown at the right of the top nav
// The top navigation bar includes a back button and a title.
'use client';
import { Button } from '@heroui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function TopNav({
  children,
  topic,
}: {
  children: React.ReactNode;
  topic: string;
}) {
  const router = useRouter();
  return (
    <div className='relative z-50 flex justify-center border-b-foreground-500 bg-blue-600/80 p-2 align-middle text-white shadow-md dark:border-blue-900 dark:bg-blue-950 dark:text-white/90'>
      <Button
        onPress={() => router.back()}
        className='absolute left-0 ml-2 border-blue-600/90 bg-transparent text-white'
        variant='faded'
        isIconOnly
      >
        <ChevronLeft />
      </Button>
      <h1 className='m-1 text-2xl'>{topic}</h1>
      <div className='absolute right-0 mr-2'>{children}</div>
    </div>
  );
}
