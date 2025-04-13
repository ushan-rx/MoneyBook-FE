import { Card } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { ScrollShadow } from '@heroui/scroll-shadow';
import React, { useState } from 'react';
import type { Selection } from '@react-types/shared';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Avatar } from '@heroui/avatar';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

export const friends = [
  {
    id: 1,
    name: 'Tony Reichert',
    role: 'CEO',
    team: 'Management',
    status: 'active',
    age: '29',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png',
    email: 'tony.reichert@example.com',
  },
  {
    id: 2,
    name: 'Zoey Lang',
    role: 'Tech Lead',
    team: 'Development',
    status: 'paused',
    age: '25',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png',
    email: 'zoey.lang@example.com',
  },
  {
    id: 3,
    name: 'Jane Fisher',
    role: 'Sr. Dev',
    team: 'Development',
    status: 'active',
    age: '22',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png',
    email: 'jane.fisher@example.com',
  },
  {
    id: 4,
    name: 'William Howard',
    role: 'C.M.',
    team: 'Marketing',
    status: 'vacation',
    age: '28',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png',
    email: 'william.howard@example.com',
  },
  {
    id: 5,
    name: 'Kristen Copper',
    role: 'S. Manager',
    team: 'Sales',
    status: 'active',
    age: '24',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png',
    email: 'kristen.cooper@example.com',
  },
  {
    id: 6,
    name: 'Brian Kim',
    role: 'P. Manager',
    team: 'Management',
    age: '29',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png',
    email: 'brian.kim@example.com',
    status: 'active',
  },
  {
    id: 7,
    name: 'Michael Hunt',
    role: 'Designer',
    team: 'Design',
    status: 'paused',
    age: '27',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png',
    email: 'michael.hunt@example.com',
  },
];

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100'>
    {children}
  </div>
);

export default function AddMembers({
  groupId,
  groupName,
}: {
  groupId: string;
  groupName: string;
}) {
  const [values, setValues] = useState<Selection>(new Set([]));
  const [searchQuery, setSearchQuery] = React.useState('');

  // to filter friends based on search query
  const filteredList = React.useMemo(() => {
    if (!searchQuery) {
      return friends;
    }
    return friends.filter((friend) => {
      return friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // to store and update selected items at top
  const arrayValues = Array.from(values);
  const topContent = React.useMemo(() => {
    if (!arrayValues.length) {
      return null;
    }
    return (
      <ScrollShadow
        hideScrollBar
        className='flex w-full gap-1 px-1 py-0.5'
        orientation='horizontal'
        isEnabled={false}
      >
        {arrayValues.map((value) => (
          <Chip key={value}>
            {friends.find((friend) => `${friend.id}` === `${value}`)?.name}
          </Chip>
        ))}
      </ScrollShadow>
    );
  }, [arrayValues]);

  return (
    <div className='flex min-h-[100px] flex-col gap-4'>
      <h2 className='text-lg font-bold text-primary-800'>
        Add friends to group
      </h2>
      {topContent && (
        <Card className='flex flex-col gap-4 rounded-md bg-background/55 p-4'>
          {topContent}
        </Card>
      )}
      <section className='h-[calc(100vh-440px)]'>
        <Form className='relative w-full'>
          <Input
            type='text'
            placeholder='Search by name...'
            className='text-medium'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </Form>
        <ListboxWrapper>
          <Listbox
            classNames={{
              list: 'max-h-[calc(100vh-500px)] overflow-scroll',
            }}
            items={filteredList}
            label='Assigned to'
            selectionMode='multiple'
            variant='flat'
            onSelectionChange={setValues}
          >
            {(item) => (
              <ListboxItem key={item.id} textValue={item.name}>
                <div className='flex items-center gap-2'>
                  <Avatar
                    alt={item.name}
                    className='shrink-0'
                    size='sm'
                    src={item.avatar}
                  />
                  <div className='flex flex-col'>
                    <span className='text-small'>{item.name}</span>
                    <span className='text-tiny text-default-400'>
                      {item.email}
                    </span>
                  </div>
                </div>
              </ListboxItem>
            )}
          </Listbox>
        </ListboxWrapper>
      </section>
      <Button variant='solid' color='primary' className='mx-2 mb-4'>
        Add
      </Button>
    </div>
  );
}
