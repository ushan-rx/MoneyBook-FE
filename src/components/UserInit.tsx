'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export function UserInit() {
  const { user, error, isLoading, refetch } = useUser();
  const [retries, setRetries] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = useMemo(() => ['/'], []);

  useEffect(() => {
    // Fetch user data if not already loaded
    if (!user && !isLoading && retries < 1) {
      refetch();
      setRetries((prev) => prev + 1);
    }
    if (error && retries >= 1 && !publicPaths.includes(pathname)) {
      router.push('/');
    }
  }, [user, isLoading, error, retries, router, pathname, publicPaths, refetch]);

  return null;
}
