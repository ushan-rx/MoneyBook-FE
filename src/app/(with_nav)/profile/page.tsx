import { requireAuth } from '@/lib/server-auth';
import React from 'react';

export default async function Profile() {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return <div>Profile</div>;
  }
}
