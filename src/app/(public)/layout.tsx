import LoadingDots from '@/components/LoadingDots';
import { UserInit } from '@/components/UserInit';
import { Suspense } from 'react';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserInit />
      <Suspense fallback={<LoadingDots />}>{children}</Suspense>
    </div>
  );
}
