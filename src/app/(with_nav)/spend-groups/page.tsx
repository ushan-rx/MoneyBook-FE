import React from 'react';
import { requireAuth } from '@/lib/server-auth';
import GroupTabs from './components/GroupTabs';

export default async function SpendGroups() {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return (
      <div className='relative flex flex-col'>
        <GroupTabs />
      </div>
    );
  }
}
