'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import type {
  TransactionFilters,
  MutualTransaction,
  FriendSummary,
} from '@/types/TransactionTypes';
import { FriendSummaryCardMotion } from './friend-summary-card-motion';
import { TransactionCard } from './transaction-card';
import { FilterDrawer } from './filter-drawer';
import { Loader2, DollarSign } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { apiService } from '@/lib/api';
import { cleanFiltersForApi } from '@/validations/filter-transaction';

const HIDE_CARD_SCROLL_THRESHOLD = 80;
const INFINITE_SCROLL_LOAD_OFFSET = 1000;

export default function FriendDetailsPage({
  setName,
  friendshipId = '7',
}: {
  setName: (name: string) => void;
  friendshipId: string;
}) {
  const [isCardVisible, setIsCardVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [friendId, setFriendId] = useState<string>('');
  const { user } = useUser();

  const currentUserId = user?.userId || '';

  // fetch friend summary data
  const { data: friendSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['friendSummary', friendshipId],
    queryFn: async () => {
      return await apiService.get<FriendSummary>(
        `/friends/${friendshipId}/summary`
      );
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!friendshipId,
  });
  const friendSummaryData = friendSummary?.data || null;

  // Set the friend's name in the header component
  useEffect(() => {
    setName(friendSummaryData?.friendName || '');
    setFriendId(friendSummaryData?.friendID || '');
  }, [setName, friendSummaryData, friendSummary]);

  // Fetch mutual transactions between the current user and the friend
  const {
    data: transactionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: transactionsLoading,
  } = useInfiniteQuery({
    queryKey: ['transactions', friendId, currentUserId, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const cleanedFilters = cleanFiltersForApi(filters);
      return await apiService.get<MutualTransaction[]>(
        '/mutual-transactions/between',
        {
          user1: currentUserId,
          user2: friendId,
          ...cleanedFilters,
          page: pageParam,
          size: 10,
        }
      );
    },
    getNextPageParam: ({ data, pagination }) =>
      !pagination || pagination.isLast || !data || data.length === 0
        ? undefined
        : pagination.pageNumber + 1,
    initialPageParam: 0,
    enabled: !!currentUserId && !!friendId,
  });

  // Handle scroll events to show/hide the summary card and load more transactions
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (
      currentScrollY > lastScrollY.current &&
      currentScrollY > HIDE_CARD_SCROLL_THRESHOLD
    ) {
      setIsCardVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      setIsCardVisible(true);
    }

    lastScrollY.current = currentScrollY;

    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - INFINITE_SCROLL_LOAD_OFFSET &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Create a debounced version of scroll handler using useMemo
  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, 100),
    [handleScroll]
  );

  // Clean up the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedHandleScroll.cancel();
    };
  }, [debouncedHandleScroll]);
  // Attach the debounced scroll handler to the window scroll event
  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [debouncedHandleScroll]);
  // Flatten all transactions from the paginated data
  const allTransactions = useMemo(
    () => transactionsData?.pages.flatMap((item) => item.data) || [],
    [transactionsData?.pages]
  );

  // loading state
  if (summaryLoading || transactionsLoading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-slate-950/60'>
        <div className='flex h-64 items-center justify-center'>
          <Loader2 className='size-10 animate-spin text-blue-500' />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950/60'>
      {friendSummaryData && (
        <FriendSummaryCardMotion
          summary={friendSummaryData}
          isVisible={isCardVisible}
        />
      )}

      <FilterDrawer onFiltersChange={setFilters} currentFilters={filters} />

      <div className='px-4 pb-24'>
        <div>
          {allTransactions.length === 0 ? (
            <div className='mt-4 rounded-xl bg-white p-8 py-12 text-center shadow-sm dark:bg-black/60'>
              <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <DollarSign className='size-8 text-gray-400' />
              </div>
              <p className='text-lg text-gray-500'>No transactions found</p>
              <p className='mt-2 text-sm text-gray-400'>
                Try adjusting your filters or add a new transaction
              </p>
            </div>
          ) : (
            allTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.transactionID}
                transaction={transaction}
                onUpdate={fetchNextPage}
              />
            ))
          )}
        </div>

        {isFetchingNextPage && (
          <div className='flex justify-center py-4'>
            <Loader2 className='size-8 animate-spin text-blue-500' />
          </div>
        )}

        {!hasNextPage && allTransactions.length > 0 && (
          <div className='py-8 text-center'>
            <p className='text-sm text-gray-500'>No more transactions</p>
          </div>
        )}
      </div>
    </div>
  );
}
