import LoadingDots from '@/components/LoadingDots';
import { UserInit } from '@/components/UserInit';
import { Suspense } from 'react';

export default async function WithoutNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Pass server-side user data to client component for hydration */}
      <UserInit />
      <Suspense fallback={<LoadingDots />}>{children}</Suspense>
    </div>
  );
}
