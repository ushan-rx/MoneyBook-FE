import LoadingDots from '@/components/LoadingDots';
import { requireAuth } from '@/lib/server-auth';
import React from 'react';
const UserDetailsForm = React.lazy(
  () => import('./components/UserDetailsForm')
);

export default async function Onboardingpage() {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return (
      <div>
        <React.Suspense fallback={<LoadingDots />}>
          <UserDetailsForm />
        </React.Suspense>
      </div>
    );
  }
}
