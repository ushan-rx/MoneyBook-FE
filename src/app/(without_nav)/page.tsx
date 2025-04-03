'use client';
import React, { Suspense, useEffect } from 'react';
import LoginSectionSwitcher from '../components/LoginSectionSwitcher';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import LoadingDots from '@/components/LoadingDots';

export default function Page() {
  const router = useRouter();
  const { user, isLoading } = useUserStore();

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
  } else if (user === null) {
    // If user is null (not authenticated), show login section
    return (
      <div className='flex h-screen items-center justify-center'>
        <Suspense fallback={<LoadingDots />}>
          <LoginSectionSwitcher />
        </Suspense>
      </div>
    );
  }
}
