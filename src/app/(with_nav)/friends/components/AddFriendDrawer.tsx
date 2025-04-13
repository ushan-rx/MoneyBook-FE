'use client';
import React, { useState, useMemo, useCallback } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@heroui/drawer';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Avatar } from '@heroui/avatar';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useDisclosure } from '@heroui/use-disclosure';
import { Button } from '@heroui/button';
import { CirclePlus } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { ApiResponse, apiService } from '@/lib/api';
import Image from 'next/image';

// Define the user type based on the API response
interface NormalUserBriefDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export default function AddFriendDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [query, setQuery] = useState<string>('');
  const [showListbox, setShowListbox] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<NormalUserBriefDto | null>(
    null
  );
  // Debounce search query to avoid excessive API calls
  const [debouncedQuery] = useDebounce(query, 300);

  // Fetch users based on search query
  const { data, isLoading } = useQuery({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return {
          timestamp: new Date().toISOString(),
          status: 200,
          message: 'No search query provided',
          data: [],
        } as ApiResponse<NormalUserBriefDto[]>;
      }

      // Pass query as a parameter to the params argument, not as an object
      return await apiService.get<NormalUserBriefDto[]>('/users/search', {
        query: debouncedQuery,
      });
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 10000, // 10 seconds before refetching
  });

  // Get users from the API response
  const users = useMemo(() => {
    return data?.data || [];
  }, [data]);

  // Filter locally if there are users already fetched
  const filteredUsers = useMemo(() => {
    if (!query || query.length < 2) return [];
    if (!users.length) return [];

    // Local filtering between refetches during stale time
    return users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, users]);

  // Handle query change
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);

      if (newQuery.length >= 2) {
        setShowListbox(true);
      } else {
        setShowListbox(false);
      }
      // Reset selected user when searching
      if (selectedUser) {
        setSelectedUser(null);
      }
    },
    [selectedUser]
  );

  // Handle user selection
  const handleUserSelect = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.userId === userId);
      if (user) {
        setSelectedUser(user);
        setShowListbox(false);
      }
    },
    [users]
  );

  // Reset everything when the drawer closes
  const handleDrawerClose = useCallback(() => {
    setQuery('');
    setSelectedUser(null);
    setShowListbox(false);
  }, []);

  return (
    <div>
      <Button
        onPress={onOpen}
        isIconOnly
        radius='full'
        variant='faded'
        color='primary'
        aria-label='Add friend'
      >
        <CirclePlus />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleDrawerClose();
          onOpenChange();
        }}
        size='5xl'
        placement='bottom'
        backdrop='blur'
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className='flex flex-col gap-1'>
                Add Friends
              </DrawerHeader>
              <DrawerBody>
                <div className='min-h-[400px]'>
                  <Form>
                    <div className='relative w-full'>
                      <Input
                        type='text'
                        placeholder='Search by name or email...'
                        value={query}
                        onChange={handleQueryChange}
                        className='w-full text-medium'
                      />
                    </div>
                  </Form>

                  {showListbox && (
                    <ListboxWrapper>
                      <Listbox
                        classNames={{
                          base: 'max-w-xs',
                          list: 'max-h-[300px] overflow-scroll',
                        }}
                        items={filteredUsers}
                        label='Users'
                        variant='flat'
                        emptyContent={
                          isLoading
                            ? 'Searching...'
                            : query.length < 2
                              ? 'Type at least 2 characters'
                              : 'No matching users found'
                        }
                        selectionMode='single'
                        onAction={(key) => handleUserSelect(key.toString())}
                      >
                        {(item) => (
                          <ListboxItem
                            key={item.userId}
                            textValue={`${item.firstName} ${item.lastName}`}
                          >
                            <div className='flex items-center gap-2'>
                              <Avatar
                                alt={`${item.firstName} ${item.lastName}`}
                                className='shrink-0'
                                size='sm'
                                src={
                                  item.profilePicture ||
                                  'https://heroui.com/avatars/avatar-1.png'
                                }
                              />
                              <div className='flex flex-col'>
                                <span className='text-small'>
                                  {`${item.firstName} ${item.lastName}`}
                                </span>
                                <span className='text-tiny text-default-400'>
                                  {item.email}
                                </span>
                              </div>
                            </div>
                          </ListboxItem>
                        )}
                      </Listbox>
                    </ListboxWrapper>
                  )}

                  {!showListbox && !selectedUser && (
                    <div className='mt-10 px-10'>
                      <article className='flex flex-col items-center justify-center rounded-md border border-default-200 bg-background/50 p-4 pb-8 text-foreground-500 shadow-md'>
                        <h2 className='text-center'>
                          Scan from you friend's app
                        </h2>
                        <h2 className='mb-4 text-center'>
                          to add them as a friend
                        </h2>
                        <Image
                          loading='lazy'
                          alt='qr code for request'
                          src={
                            'https://api.qrserver.com/v1/create-qr-code/?data=23b3423j34h234nn3k423&amp;size=100x100'
                          }
                          height={160}
                          width={160}
                        />
                      </article>
                    </div>
                  )}

                  <div className='mt-6'>
                    {selectedUser && (
                      <ProfileCard
                        firstName={selectedUser.firstName}
                        lastName={selectedUser.lastName}
                        email={selectedUser.email}
                        profilePicture={
                          selectedUser.profilePicture ||
                          'https://heroui.com/avatars/avatar-1.png'
                        }
                        userId={selectedUser.userId}
                      />
                    )}
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='w-full rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100'>
    {children}
  </div>
);
