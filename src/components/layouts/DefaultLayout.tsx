import React from 'react';
import NavigationBar from '@/components/NavigationBar';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <header className='bg-green-50 py-4 text-center text-2xl'>
        MONEYBOOK
      </header>
      <main>{children}</main>
    </div>
  );
}
