import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/lib/auth';

export function useAuth() {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: fetchUser,
    staleTime: 60 * 1000, // Cache user for 40 seconds
    retry: false, // Prevent infinite retries
  });
}
