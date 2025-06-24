'use client';
import TopNavLayout from '@/components/layouts/WithoutNavLayout';
import { Button } from '@heroui/button';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import FriendDetailsPage from './components/friend-details-page';
import { useParams } from 'next/navigation';

export default function FriendPage() {
  const [name, setName] = useState('');
  const friendshipId = useParams().id as string;
  return (
    <TopNavLayout>
      <TopNavLayout.Header topic={name}>
        <Button className='absolute right-0 mr-2 min-w-fit border-blue-800 bg-transparent text-white'>
          <MenuIcon />
        </Button>
      </TopNavLayout.Header>
      <TopNavLayout.Body>
        <FriendDetailsPage setName={setName} friendshipId={friendshipId} />
      </TopNavLayout.Body>
    </TopNavLayout>
  );
}
