'use client';
import React, { lazy, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import LoadingDots from '@/components/LoadingDots';
import { useUser } from '@/hooks/useUser';
const LoginSectionSwitcher = lazy(
  () => import('./components/LoginSectionSwitcher')
);

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    // If user is authenticated, redirect to home
    if (user?.userId) {
      router.replace('/home');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
        <span className='ml-2'>Checking authentication...</span>
      </div>
    );
  }
  // If user is null (not authenticated), show login section
  if (!user) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Suspense fallback={<LoadingDots />}>
          <LoginSectionSwitcher />
        </Suspense>
      </div>
    );
  }
}
