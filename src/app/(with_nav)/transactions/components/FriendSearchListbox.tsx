import { ListboxWrapper } from '@/components/ListboxWrapper';
import { Avatar } from '@heroui/avatar';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { FriendSearchResultDto } from './CreateMutualTransaction';

interface FriendSearchListboxProps {
  users: FriendSearchResultDto[];
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  onUserSelect: (user: FriendSearchResultDto) => void;
}

export default function FriendSearchListbox({
  users,
  isLoading,
  isError,
  searchQuery,
  onUserSelect,
}: FriendSearchListboxProps) {
  return (
    <ListboxWrapper>
      <Listbox
        aria-label='Friend selection'
        classNames={{
          base: 'max-w-full',
          list: 'max-h-[300px] overflow-auto',
        }}
        items={users}
        emptyContent={
          isLoading ? (
            <div className='flex items-center justify-center p-2'>
              <Loader2 className='size-5 animate-spin text-primary' />
              <span className='ml-2'>Searching...</span>
            </div>
          ) : isError ? (
            'Error searching friends.'
          ) : searchQuery.length < 2 ? (
            'Type at least 2 characters.'
          ) : (
            'No matching friends found.'
          )
        }
        variant='flat'
        onAction={(key) => {
          const user = users.find((u) => u.userId === key);
          if (user) {
            onUserSelect(user);
          }
        }}
      >
        {(user) => (
          <ListboxItem
            key={user.userId}
            textValue={`${user.firstName} ${user.lastName}`}
          >
            <div className='flex items-center gap-2 py-1'>
              <Avatar
                alt={`${user.firstName} ${user.lastName}`}
                className='shrink-0'
                size='sm'
                name={`${user.firstName}`}
                src={user.profilePicture || ''}
              />
              <div className='flex flex-col'>
                <span className='text-small'>
                  {`${user.firstName} ${user.lastName}`}
                </span>
                <span className='text-tiny text-default-400'>{user.email}</span>
              </div>
            </div>
          </ListboxItem>
        )}
      </Listbox>
    </ListboxWrapper>
  );
}
