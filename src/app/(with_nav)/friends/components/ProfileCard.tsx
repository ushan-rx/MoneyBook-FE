import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { useUserStore } from '@/store/user-store';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { AxiosError } from 'axios';

interface ProfileCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePicture: string;
}

interface FriendRequestCreateDto {
  senderId: string;
  receiverId: string;
}

interface FriendRequestDto {
  requestId: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
}

export default function ProfileCard({
  userId,
  firstName,
  lastName,
  email,
  bio,
  profilePicture,
}: ProfileCardProps) {
  const [isRequested, setIsRequested] = React.useState(false);
  const currentUserId = useUserStore((state) => state.user?.userId);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [friendRequest, setFriendRequest] = useState<FriendRequestDto | null>(
    null
  );

  // Fetch friend request data
  useEffect(() => {
    const fetchFriendRequest = async () => {
      if (!currentUserId) return;

      try {
        const response = await apiService.get(
          `/friends/getFriendRequest/${userId}`
        );

        console.log('Friend request:', response.data);
        if (response.data) {
          setFriendRequest(response.data);

          // Update isRequested state if current user is the sender of a pending request
          if (
            response.data.status === 'PENDING' &&
            response.data.senderId === currentUserId
          ) {
            setIsRequested(true);
          }
        }
      } catch (error) {
        console.error('Error fetching friend request:', error);
      }
    };

    if (currentUserId && userId) {
      fetchFriendRequest();
    }
  }, [userId, currentUserId]);

  // Create friend request mutation
  const { mutate: sendFriendRequest, isPending } = useMutation({
    mutationFn: async () => {
      if (!currentUserId) {
        throw new Error('Current user ID is not available');
      }
      const requestData: FriendRequestCreateDto = {
        senderId: currentUserId,
        receiverId: userId,
      };
      try {
        return await apiService.post('/friends/sendFriendRequest', requestData);
      } catch (error) {
        console.error('Error sending friend request:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Friend request sent successfully:', data);
      setFriendRequest({
        ...data.data,
        status: 'PENDING',
      });

      setSuccess(true);
      setIsRequested(true);
    },
    onError: (error: AxiosError) => {
      const errorData: any = error.response?.data || 'An error occurred';
      setError(errorData.message || 'An error occurred');
    },
  });

  // Cancel friend request mutation
  const { mutate: cancelFriendRequest, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      if (!friendRequest?.requestId) {
        throw new Error('Friend request ID is not available');
      }
      return await apiService.delete(
        `/friends/request/${friendRequest.requestId}`
      );
    },
    onSuccess: () => {
      setFriendRequest(null);
      setIsRequested(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error: AxiosError) => {
      const errorData: any = error.response?.data || 'An error occurred';
      setError(errorData.message || 'Failed to cancel friend request');
    },
  });

  // Accept friend request mutation
  const { mutate: acceptFriendRequest, isPending: isAccepting } = useMutation({
    mutationFn: async () => {
      if (!friendRequest?.requestId) {
        throw new Error('Friend request ID is not available');
      }
      return await apiService.post(
        `/friends/acceptFriendRequest/${friendRequest.requestId}`
      );
    },
    onSuccess: () => {
      if (friendRequest) {
        setFriendRequest({
          ...friendRequest,
          status: 'ACCEPTED',
        });
      }
      setSuccess(true);
      // setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error: AxiosError) => {
      const errorData: any = error.response?.data || 'An error occurred';
      setError(errorData.message || 'Failed to accept friend request');
    },
  });

  // Handler for request button click
  const handleRequestClick = () => {
    if (friendRequest) {
      // Case: Friend request exists
      if (friendRequest.status === 'PENDING') {
        // Case: Current user sent the request - can cancel
        if (friendRequest.senderId === currentUserId) {
          cancelFriendRequest();
        }
        // Case: Current user received the request - can accept
        else if (friendRequest.receiverId === currentUserId) {
          acceptFriendRequest();
        }
      }
      // For other cases (e.g., ACCEPTED status), button is disabled
    } else {
      // No friend request exists - send new request
      sendFriendRequest();
    }
  };

  // Determine button state and text
  const getButtonState = () => {
    // Handle cases where friend request exists
    if (friendRequest) {
      if (friendRequest.status === 'ACCEPTED') {
        return {
          text: 'Friends',
          variant: 'flat' as const,
          isDisabled: true,
        };
      } else if (friendRequest.status === 'PENDING') {
        if (friendRequest.senderId === currentUserId) {
          return {
            text: isCancelling ? 'Cancelling...' : 'Cancel Request',
            variant: 'bordered' as const,
            isDisabled: isCancelling,
          };
        } else {
          return {
            text: isAccepting ? 'Accepting...' : 'Accept Request',
            variant: 'solid' as const,
            isDisabled: isAccepting,
          };
        }
      }
    }

    // Default cases (no friend request or other statuses)
    if (isPending) {
      return {
        text: 'Requesting...',
        variant: 'bordered' as const,
        isDisabled: true,
      };
    } else if (isRequested) {
      return {
        text: 'Cancel',
        variant: 'bordered' as const,
        isDisabled: false,
      };
    } else {
      return {
        text: 'Request',
        variant: 'solid' as const,
        isDisabled: false,
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div>
      <Card>
        <CardHeader className='justify-center'>
          <div>
            <Avatar
              isBordered
              radius='full'
              size='lg'
              src={profilePicture}
              className='mt-2 justify-self-center'
            />
            <div className='mt-4 flex flex-col gap-1 text-center'>
              <h4 className='text-medium font-semibold leading-none text-default-600'>
                {firstName} {lastName}
              </h4>
              <h5 className='text-small tracking-tight text-default-400'>
                {email}
              </h5>
            </div>
          </div>
        </CardHeader>
        <CardBody className='px-3 py-0 text-center text-small text-default-400'>
          <p>{bio}</p>

          <div className='mx-2 mb-1 mt-4 flex justify-between'>
            <div className='flex gap-1'>
              <p className='text-small font-semibold text-default-400'>4</p>
              <p className='text-small text-default-400'>Friends</p>
            </div>
            <div className='flex gap-1'>
              <p className='text-small font-semibold text-default-400'>97.1K</p>
              <p className='text-small text-default-400'>Score</p>
            </div>
          </div>
          <Divider />
        </CardBody>
        <CardFooter className='flex flex-col justify-center gap-3'>
          <Button
            className={
              buttonState.variant === 'bordered'
                ? 'border-default-200 bg-transparent text-foreground'
                : ''
            }
            color='primary'
            radius='full'
            size='sm'
            variant={buttonState.variant}
            isDisabled={buttonState.isDisabled}
            onPress={handleRequestClick}
          >
            {buttonState.text}
          </Button>
          {error && (
            <p className='text-center text-small text-red-500'>{`Error: ${error}`}</p>
          )}
          {success && (
            <p className='text-center text-small text-green-500'>
              {friendRequest?.status === 'ACCEPTED'
                ? 'Friend request accepted!'
                : isRequested
                  ? 'Friend request sent successfully!'
                  : 'Friend request cancelled!'}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
