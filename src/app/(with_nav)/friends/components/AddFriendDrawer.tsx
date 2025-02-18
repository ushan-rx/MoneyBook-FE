'use client';
import React from 'react';
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

export const users = [
  {
    id: 1,
    userName: 'Tony_Reichert',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png',
    email: 'tony.reichert@example.com',
  },
  {
    id: 2,
    userName: 'Zoey_Lang',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png',
    email: 'zoey.lang@example.com',
  },
  {
    id: 3,
    userName: 'Jane_Fisher',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png',
    email: 'jane.fisher@example.com',
  },
  {
    id: 4,
    userName: 'William_Howard',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png',
    email: 'william.howard@example.com',
  },
  {
    id: 5,
    userName: 'Kristen_Copper',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png',
    email: 'kristen.cooper@example.com',
  },
  {
    id: 6,
    userName: 'Brian_Kim',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png',
    email: 'brian.kim@example.com',
  },
  {
    id: 7,
    userName: 'Michael_Hunt',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png',
    email: 'michael.hunt@example.com',
  },
  {
    id: 8,
    userName: 'Samantha_Brooks',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png',
    email: 'samantha.brooks@example.com',
  },
  {
    id: 9,
    userName: 'Frank_Harrison',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png',
    email: 'frank.harrison@example.com',
  },
  {
    id: 10,
    userName: 'Emma_Adams',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png',
    email: 'emma.adams@example.com',
  },
  {
    id: 11,
    userName: 'Brandon_Stevens',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png',
    email: 'brandon.stevens@example.com',
  },
  {
    id: 12,
    userName: 'Megan_Richards',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png',
    email: 'megan.richards@example.com',
  },
];

export default function AddFriendDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        onOpenChange={onOpenChange}
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
                        placeholder='Search by username...'
                        // {...register('username')}
                        // value={query}
                        // onChange={(e) => setQuery(e.target.value)}
                        className='w-full text-medium'
                      />

                      {/* Show validation error if present */}
                      {/* {errors.username && (
                        <p className='mt-1 text-sm text-red-500'>
                          {errors.username.message}
                        </p>
                      )} */}
                    </div>
                  </Form>
                  <ListboxWrapper>
                    <Listbox
                      classNames={{
                        base: 'max-w-xs',
                        list: 'max-h-[300px] overflow-scroll',
                      }}
                      items={users}
                      label='Assigned to'
                      variant='flat'
                      // onSelectionChange={setValues}
                    >
                      {(item) => (
                        <ListboxItem key={item.id} textValue={item.userName}>
                          <div className='flex items-center gap-2'>
                            <Avatar
                              alt={item.userName}
                              className='flex-shrink-0'
                              size='sm'
                              src={item.avatar}
                            />
                            <div className='flex flex-col'>
                              <span className='text-small'>
                                {item.userName}
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
                  <div className='mt-6'>
                    <ProfileCard />
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
