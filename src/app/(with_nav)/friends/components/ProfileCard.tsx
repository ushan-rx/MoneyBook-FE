import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { useUserStore } from '@/store/user-store';
import { useMutation } from '@tanstack/react-query';
import { ApiErrorResponse, apiService } from '@/lib/api';
import { AxiosError } from 'axios';

interface ProfileCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

interface FriendRequestCreateDto {
  senderId: string;
  receiverId: string;
}

export default function ProfileCard({
  userId,
  firstName,
  lastName,
  email,
  profilePicture,
}: ProfileCardProps) {
  const [isRequested, setIsRequested] = React.useState(false);
  const currentUserId = useUserStore((state) => state.user?.userId);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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
        throw error; // Rethrow the error to trigger onError
      }
    },
    onSuccess: (data) => {
      setSuccess(true);
      setIsRequested(true);
    },
    onError: (error: AxiosError) => {
      // Optionally handle error state here
      const errorData: any = error.response?.data || 'An error occurred';
      setError(errorData.message || 'An error occurred');
    },
  });

  // Handler for request button click
  const handleRequestClick = () => {
    if (!isRequested) {
      sendFriendRequest();
    } else {
      // Logic to cancel friend request
      setIsRequested(false);
    }
  };

  // Determine button state and text
  const getButtonState = () => {
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
          <p>
            Frontend developer and UI/UX enthusiast. Join me on this coding
            adventure!
          </p>

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
              Friend request sent successfully!
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
