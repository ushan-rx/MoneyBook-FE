'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import TopNavLayout from '@/components/layouts/WithoutNavLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiResponse, apiService } from '@/lib/api';
import { useEffect, useRef } from 'react';
import { addToast } from '@heroui/toast';
import { useUserStore } from '@/store/user-store';

interface FriendRequestDto {
  requestId: number;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  sender?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    username?: string;
  };
}

const fetchFriendRequests = async ({ pageParam = 0 }) => {
  return await apiService.get<FriendRequestDto[]>('/friends/pending', {
    page: pageParam,
    size: 10,
  });
};

export default function FriendRequestsPage() {
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLLIElement | null>(null);
  const user = useUserStore((state) => state.user);

  // Fetch friend requests with infinite scrolling
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['friendRequests'],
    queryFn: fetchFriendRequests,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && !lastPage.pagination.isLast) {
        return lastPage.pagination.pageNumber + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  // Accept friend request mutation
  const acceptMutation = useMutation({
    mutationFn: (recieverId: string) =>
      apiService.post(`/friends/respondFriendRequest`, {
        senderId: user?.userId,
        receiverId: recieverId,
        status: 'ACCEPTED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      addToast({
        title: 'Friend request accepted',
        color: 'success',
      });
    },
    onError: (error: any) => {
      addToast({
        title: `Failed to accept request`,
        color: 'danger',
      });
    },
  });

  // Reject friend request mutation
  const rejectMutation = useMutation({
    mutationFn: (recieverId: string) =>
      apiService.post(`/friends/respondFriendRequest`, {
        senderId: user?.userId,
        receiverId: recieverId,
        status: 'REJECTED',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      addToast({
        title: 'Friend request rejected',
        color: 'success',
      });
    },
    onError: (error: any) => {
      addToast({
        title: `Failed to reject request`,
        color: 'danger',
      });
    },
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

  // Flatten all pages of friend requests
  const friendRequests = data?.pages.flatMap((page) => page.data) || [];

  // Handle accept friend request
  const handleAccept = (recieverId: string) => {
    acceptMutation.mutate(recieverId);
  };

  // Handle reject friend request
  const handleReject = (recieverId: string) => {
    rejectMutation.mutate(recieverId);
  };

  // get initials for avatar fallback
  const getInitials = (request: FriendRequestDto) => {
    if (!request.sender) return '?';
    return `${request.sender.firstName.charAt(0)}${request.sender.lastName.charAt(0)}`;
  };

  // get full name
  const getFullName = (request: FriendRequestDto) => {
    if (!request.sender) return 'Unknown User';
    return `${request.sender.firstName} ${request.sender.lastName}`;
  };

  // get username or email as fallback
  const getUsername = (request: FriendRequestDto) => {
    if (!request.sender) return '';
    return request.sender.username || request.sender.email;
  };

  return (
    <TopNavLayout>
      <TopNavLayout.Header topic='Friend Requests'></TopNavLayout.Header>
      <TopNavLayout.Body>
        <div className='container mx-auto max-w-md px-2 py-8'>
          <Card>
            <CardHeader className='pb-4'>
              <h2 className='text-xl font-semibold'>Pending Requests</h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='flex justify-center py-8'>
                  <Loader2 className='size-8 animate-spin text-primary' />
                </div>
              ) : isError ? (
                <div className='py-8 text-center text-destructive'>
                  <p>Error loading friend requests. Please try again.</p>
                </div>
              ) : friendRequests.length === 0 ? (
                <div className='py-8 text-center text-mutedForeground'>
                  <p>You don't have any friend requests at the moment.</p>
                </div>
              ) : (
                <ul className='space-y-4'>
                  {friendRequests.map((request, index) => (
                    <li
                      key={request.requestId}
                      className='flex flex-col items-center justify-between rounded-lg border p-3'
                      ref={
                        index === friendRequests.length - 1
                          ? lastElementRef
                          : null
                      }
                    >
                      <div className='mb-4 flex items-center justify-start gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={
                              request.sender?.profilePicture ||
                              '/placeholder.svg?height=40&width=40'
                            }
                            alt={getFullName(request)}
                          />
                          <AvatarFallback>
                            {getInitials(request)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{getFullName(request)}</p>
                          <p className='text-sm text-mutedForeground'>
                            {getUsername(request)}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => handleReject(request.senderId)}
                          disabled={rejectMutation.isPending}
                        >
                          {rejectMutation.isPending ? (
                            <Loader2 className='mr-1 size-4 animate-spin' />
                          ) : (
                            <X className='mr-1 size-4' />
                          )}
                          Reject
                        </Button>
                        <Button variant='outline' size='sm' asChild>
                          <Link href={`/profile/${request.senderId}`}>
                            <User className='mr-1 size-4' />
                            Profile
                          </Link>
                        </Button>
                        <Button
                          variant='default'
                          size='sm'
                          className='bg-green-600 hover:bg-green-700'
                          onClick={() => handleAccept(request.senderId)}
                          disabled={acceptMutation.isPending}
                        >
                          {acceptMutation.isPending ? (
                            <Loader2 className='mr-1 size-4 animate-spin' />
                          ) : (
                            <Check className='mr-1 size-4' />
                          )}
                          Accept
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {isFetchingNextPage && (
                <div className='flex justify-center py-4'>
                  <Loader2 className='size-6 animate-spin text-primary' />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TopNavLayout.Body>
    </TopNavLayout>
  );
}
