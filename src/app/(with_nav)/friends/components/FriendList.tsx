import DateTimeComponent from '@/components/DateTimeComponent';
import { Fira_Code } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React, { lazy } from 'react';
const CircleUser = lazy(() =>
  import('lucide-react').then((module) => ({ default: module.CircleUser }))
);

interface FriendList {
  id: string;
  name: string;
  FriendBalance: number;
  friendImage?: string;
  LastTransaction?: {
    amount: number;
    name: string;
    date: string;
  };
}

const data: FriendList[] = [
  {
    id: '1',
    name: 'Neil Sims',
    FriendBalance: 320,
    friendImage:
      'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2025-02-08T12:09:30.000Z',
    },
  },
  {
    id: '2',
    name: 'Micheal Brown',
    FriendBalance: -320,
    friendImage:
      'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2025-02-07T12:08:30.000Z',
    },
  },
  {
    id: '3',
    name: 'John Doe',
    FriendBalance: 320,
    friendImage:
      'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-25T12:08:20.000Z',
    },
  },
  {
    id: '4',
    name: 'Jane Doe',
    FriendBalance: 320,
    friendImage:
      'https://flowbite.com/docs/images/people/profile-picture-4.jpg',
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-02-02T12:06:00.000Z',
    },
  },
  {
    id: '5',
    name: 'Micheal Brown',
    FriendBalance: -320,
    friendImage:
      'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-24T12:05:00.000Z',
    },
  },
  {
    id: '6',
    name: 'John Doe',
    FriendBalance: 320,
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-18T12:03:30.000Z',
    },
  },
  {
    id: '7',
    name: 'John Doe',
    FriendBalance: 0,
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-18T12:03:30.000Z',
    },
  },
  {
    id: '8',
    name: 'John Doe',
    FriendBalance: 320,
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-18T12:03:30.000Z',
    },
  },
  {
    id: '9',
    name: 'Jane Doe',
    FriendBalance: 320,
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-17T12:00:30.000Z',
    },
  },
  {
    id: '10',
    name: 'Jane Doe',
    FriendBalance: 320,
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-17T12:00:30.000Z',
    },
  },
  {
    id: '11',
    name: 'Jane Doe',
    FriendBalance: 320,
    LastTransaction: {
      amount: 320,
      name: 'credit',
      date: '2024-10-17T12:00:30.000Z',
    },
  },
];

export default function FriendList() {
  return (
    <div>
      <article className='flow-root w-full px-4'>
        <ul
          role='list'
          className='divide-y divide-gray-200 dark:divide-gray-700'
        >
          {data.map((friend) => (
            <Link href={`/${friend.id}`}>
              <li key={friend.id} className='py-3 sm:py-4'>
                <div className='flex items-center space-x-4'>
                  <div className='flex-shrink-0'>
                    {friend.friendImage ? (
                      <Image
                        src={friend.friendImage}
                        height={32}
                        width={32}
                        alt={friend.name}
                        className='rounded-full'
                      />
                    ) : (
                      <CircleUser className='h-8 w-8 rounded-full text-gray-400 dark:text-gray-500' />
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-base font-medium text-gray-900 dark:text-white'>
                      {friend.name}
                    </p>
                    {friend.FriendBalance > 0 ? (
                      <p className='truncate text-sm text-green-500 dark:text-green-400'>
                        {`+ Rs. ${friend.FriendBalance}`}
                      </p>
                    ) : friend.FriendBalance < 0 ? (
                      <p className='truncate text-sm text-red-500 dark:text-red-400'>
                        {`- Rs. ${Math.abs(friend.FriendBalance)}`}
                      </p>
                    ) : (
                      <p className='truncate text-sm text-primary-500'>
                        Balanced
                      </p>
                    )}
                  </div>
                  <div className='inline-flex flex-col items-end text-sm font-thin text-foreground/80'>
                    <DateTimeComponent
                      dateString={friend.LastTransaction?.date || ''}
                      key={friend.LastTransaction?.date}
                      type='default'
                    />
                    <span className='text-foreground/50'>{`${friend.LastTransaction?.name} - Rs. ${friend.LastTransaction?.amount}`}</span>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </article>
    </div>
  );
}
