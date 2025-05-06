'use client';
import { logoutUser } from '@/lib/auth';
import { addToast } from '@heroui/toast';
import { Button } from '@heroui/button';
import { LogOut } from 'lucide-react';
import React from 'react';

export default function LogoutHandler() {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    const result = await logoutUser();
    setIsLoading(false);
    if (result == false) {
      addToast({
        title: 'Logout failed',
        color: 'danger',
      });
    }
  };
  return (
    <div>
      <Button
        disabled={isLoading}
        variant='solid'
        color='danger'
        onPress={handleLogout}
        className='flex w-full items-center justify-center space-x-2'
      >
        <LogOut className='size-4' />
        <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
      </Button>
    </div>
  );
}
