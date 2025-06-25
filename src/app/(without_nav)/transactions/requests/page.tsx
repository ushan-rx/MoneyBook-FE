'use client';
import TopNavLayout from '@/components/layouts/WithoutNavLayout';
import { Loader2 } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import TransactionRequestCard from './components/transaction-request-card';
import { useEffect, useRef } from 'react';

export default function TransactionRequestsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLLIElement | null>(null);

  // Fetch pending transaction requests
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['mutualTransactionRequests'],
    queryFn: async ({ pageParam = 0 }) => {
      return await apiService.get('/mutual-transactions/pending-requests', {
        page: pageParam,
        size: 10,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && !lastPage.pagination.isLast) {
        return lastPage.pagination.pageNumber + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (lastElementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 }
      );

      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const transactionRequests = data?.pages.flatMap((page) => page.data) || [];

  return (
    <TopNavLayout>
      <TopNavLayout.Header topic='Transaction Requests' />
      <TopNavLayout.Body>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='size-8 animate-spin text-primary' />
          </div>
        ) : isError ? (
          <div className='py-8 text-center text-destructive'>
            <p>Error loading transaction requests. Please try again.</p>
          </div>
        ) : transactionRequests.length === 0 ? (
          <div className='py-8 text-center text-mutedForeground'>
            <p>You don't have any transaction requests at the moment.</p>
          </div>
        ) : (
          <ul className='space-y-4'>
            {transactionRequests.map((transaction, index) => (
              <li
                key={transaction.transactionID}
                ref={
                  index === transactionRequests.length - 1
                    ? lastElementRef
                    : null
                }
              >
                <TransactionRequestCard transaction={transaction} />
              </li>
            ))}
          </ul>
        )}
        {isFetchingNextPage && (
          <div className='flex justify-center py-4'>
            <Loader2 className='size-6 animate-spin text-primary' />
          </div>
        )}
      </TopNavLayout.Body>
    </TopNavLayout>
  );
}
