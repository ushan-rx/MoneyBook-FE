import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/auth';
import { User, useUserStore } from '@/store/user-store';
import { useEffect } from 'react';

export function useUser() {
  const { user, updateUser, error, setError } = useUserStore();

  const query = useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 60 * 1000, // Cache user detauls for 60 seconds
    retry: false,
  });
  // update user store when success
  useEffect(() => {
    if (query.data && !query.isPending) {
      updateUser(query.data);
    }
  }, [query.data, query.isPending, updateUser]);
  // handle error state
  useEffect(() => {
    if (query.error) {
      setError(query.error.message);
    }
  }, [query.error, setError]);

  return {
    user,
    error: error || (query.error as Error)?.message,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
