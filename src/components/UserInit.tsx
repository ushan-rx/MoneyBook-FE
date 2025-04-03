'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '@/store/user-store';
import { useRouter, usePathname } from 'next/navigation';

export function UserInit() {
  const { fetchUser, user, isLoading, error } = useUserStore();
  const [retries, setRetries] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = useMemo(() => ['/', '/onboarding'], []);

  useEffect(() => {
    // Fetch user data if not already loaded
    if (!user && !isLoading && retries < 3) {
      fetchUser();
      setRetries((prev) => prev + 1);
    }

    // Handle persistent errors that might indicate auth issues
    if (error && retries >= 3 && !publicPaths.includes(pathname)) {
      router.push('/');
    }
  }, [
    fetchUser,
    user,
    isLoading,
    error,
    retries,
    router,
    pathname,
    publicPaths,
  ]);

  return null;
}
