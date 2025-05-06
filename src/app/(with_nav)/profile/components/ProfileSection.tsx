'use client';
import { useUser } from '@/hooks/useUser';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Skeleton } from '@heroui/skeleton';

export default function ProfileSection() {
  const { user, isLoading, error } = useUser();
  if (isLoading || !user) {
    return (
      <div className='mb-6 flex flex-col items-center'>
        <div className='relative'>
          <Skeleton className='rounded-full' isLoaded={false}>
            <div className='size-[96px]'></div>
          </Skeleton>
        </div>
        <Skeleton className='mt-2 rounded-lg' isLoaded={false}>
          <div className='h-5 w-32'></div>
        </Skeleton>
        <Skeleton className='mt-2 rounded-lg' isLoaded={false}>
          <div className='h-5 w-48'></div>
        </Skeleton>
      </div>
    );
  } else if (error) {
    return (
      <div className='mb-6 flex flex-col items-center'>
        <div className='relative'>
          <div className='mb-4 size-24 overflow-hidden rounded-full border-2 border-primary'>
            <div className='size-[96px]'></div>
          </div>
        </div>
        <h1 className='mt-2 text-xl font-bold text-danger-500'>
          Error loading profile
        </h1>
      </div>
    );
  }
  return (
    <div className='relative mb-6 flex flex-col items-center'>
      <div className='relative'>
        <div className='size-24 overflow-hidden rounded-full border-2 border-primary'>
          <Image
            src={`${user.profilePicture || '/placeholder.svg'}`}
            alt='Profile picture'
            width={96}
            height={96}
            className='size-full object-cover'
          />
        </div>
      </div>
      <h1 className='mt-2 text-xl font-bold'>{`${user.firstName} ${user.lastName}`}</h1>
      <p className='text-mutedForeground'>{`${user.email}`}</p>
      <Link
        href='/profile/edit'
        className='mt-4 flex flex-row gap-2 rounded-full bg-primary p-2 align-middle text-primary-foreground shadow-md'
      >
        <Pencil className='size-4 self-center' />
        <span>Edit profile</span>
      </Link>
    </div>
  );
}
