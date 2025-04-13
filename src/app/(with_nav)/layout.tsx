import LoadingDots from '@/components/LoadingDots';
import NavigationBar from '@/components/NavigationBar';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Suspense } from 'react';
import { UserInit } from '@/components/UserInit';

export default async function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Pass server-side user data to client component for hydration */}
      <UserInit />
      <DefaultLayout>
        <Suspense fallback={<LoadingDots />}>{children}</Suspense>
      </DefaultLayout>
      <NavigationBar />
    </div>
  );
}
