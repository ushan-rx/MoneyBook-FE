import LoadingDots from '@/components/LoadingDots';
import NavigationBar from '@/components/NavigationBar';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Suspense } from 'react';

export default function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DefaultLayout>
        <Suspense fallback={<LoadingDots />}>{children}</Suspense>
      </DefaultLayout>
      <NavigationBar />
    </div>
  );
}
