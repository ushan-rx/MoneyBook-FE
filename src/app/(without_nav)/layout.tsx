import LoadingDots from '@/components/LoadingDots';
import { UserInit } from '@/components/UserInit';
import { Suspense } from 'react';

export default function WithoutNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserInit /> {/* initialize user data */}
      <Suspense fallback={<LoadingDots />}>{children}</Suspense>
    </div>
  );
}
