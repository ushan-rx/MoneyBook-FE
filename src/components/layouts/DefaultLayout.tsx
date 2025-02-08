import React from 'react';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <header className='sticky inset-x-0 top-0 z-[999] min-h-[60px] border-b-small border-primary-50 bg-gray-100 py-4 text-center text-2xl dark:bg-gray-900'>
        MONEYBOOK
      </header>
      <main>{children}</main>
    </div>
  );
}
