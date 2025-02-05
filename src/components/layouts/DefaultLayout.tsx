import React from 'react';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <header className='sticky inset-x-0 top-0 z-[999] min-h-[60px] bg-primary-300 py-4 text-center text-2xl text-white dark:bg-primary-900'>
        MONEYBOOK
      </header>
      <main>{children}</main>
    </div>
  );
}
