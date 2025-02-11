import LoadingDots from '@/components/LoadingDots';
import NavigationBar from '@/components/NavigationBar';
import { Suspense } from 'react';

export default function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Suspense fallback={<LoadingDots />}>{children}</Suspense>
      <NavigationBar />
    </div>
  );
}
