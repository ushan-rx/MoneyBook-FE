'use client';
import DateTimeComponent from '@/components/DateTimeComponent';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

interface FriendWithTransactionSummaryDto {
  friendName: string;
  avatar?: string;
  friendshipId: string;
  lastTransactionName?: string;
  lastTransactionType?: string;
  lastTransactionAmount?: number;
  lastTransactionDate?: string;
}

export default function FriendList() {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFriendRef = useRef<HTMLLIElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['friends'],
      queryFn: async ({ pageParam = 0 }) => {
        return await apiService.get<FriendWithTransactionSummaryDto[]>(
          '/friends/FriendDetailedList',
          { page: pageParam, size: 10 }
        );
      },
      getNextPageParam: ({ data, pagination }) =>
        !pagination || pagination.isLast || !data || data.length === 0
          ? undefined
          : pagination.pageNumber + 1,
      initialPageParam: 0,
    });

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (lastFriendRef.current) {
      observer.current.observe(lastFriendRef.current);
    }

    return () => observer.current?.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const friends = data?.pages.flatMap((page) => page.data) || [];

  console.log('Friends data:', friends);
  return (
    <div>
      <article className='flow-root w-full px-4'>
        <ul
          role='list'
          className='divide-y divide-gray-200 dark:divide-gray-700'
        >
          {friends.map((friend, index) => (
            <Link
              key={friend.friendshipId}
              href={`/friends/${friend.friendshipId}`}
            >
              <li
                className='py-3 sm:py-4'
                ref={index === friends.length - 1 ? lastFriendRef : null}
              >
                <div className='flex items-center space-x-4'>
                  <div className='shrink-0'>
                    {friend.avatar ? (
                      <Image
                        src={friend.avatar}
                        height={32}
                        width={32}
                        alt={friend.friendName}
                        className='rounded-full'
                      />
                    ) : (
                      <div className='flex size-8 items-center justify-center rounded-full bg-gray-400 text-white'>
                        {friend.friendName[0]}
                      </div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-base font-medium text-gray-900 dark:text-white'>
                      {friend.friendName}
                    </p>
                    {/* {friend.lastTransactionAmount !== undefined && (
                      <p
                        className={`truncate text-sm ${
                          friend.lastTransactionAmount > 0
                            ? 'text-green-500 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                        }`}
                      >
                        {`${
                          friend.lastTransactionAmount > 0 ? '+' : '-'
                        } Rs. ${Math.abs(friend.lastTransactionAmount)}`}
                      </p>
                    )} */}
                  </div>
                  <div className='inline-flex flex-col items-end text-sm font-thin text-foreground/80'>
                    {friend.lastTransactionDate && (
                      <DateTimeComponent
                        dateString={friend.lastTransactionDate}
                        type='default'
                      />
                    )}
                    {friend.lastTransactionName && (
                      <span className='text-foreground/50'>{`${friend.lastTransactionName} - Rs. ${friend.lastTransactionAmount}`}</span>
                    )}
                  </div>
                </div>
              </li>
            </Link>
          ))}
          {isFetchingNextPage && (
            <li className='py-4 text-center text-sm text-gray-500'>
              Loading more...
            </li>
          )}
        </ul>
      </article>
    </div>
  );
}
