import { Sun, Settings } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from './components/theme-toggle';
import { requireAuth } from '@/lib/server-auth';
import { Divider } from '@heroui/divider';
import LogoutHandler from './components/logout-handler';
import { lazy, Suspense } from 'react';
import LoadingDots from '@/components/LoadingDots';
const ProfileSection = lazy(() => import('./components/ProfileSection'));

export default async function ProfilePage() {
  const auth = await requireAuth();

  if (auth.authenticated) {
    return (
      <div className='container mx-auto max-w-md px-4 py-8'>
        <Card className='mb-[80px] p-6'>
          <Suspense fallback={<LoadingDots />}>
            <ProfileSection />
          </Suspense>
          <Divider className='my-4' />
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Sun className='size-4' />
                <span>Dark Mode</span>
              </div>
              <ThemeToggle />
            </div>

            <Divider />

            <div className='space-y-3'>
              <h2 className='text-sm font-medium text-mutedForeground'>
                SETTINGS
              </h2>
              <Link
                href='/profile/security'
                className='flex items-center space-x-2 py-2'
              >
                <Settings className='size-4' />
                <span>Security</span>
              </Link>
              <Link
                href='/profile/notifications'
                className='flex items-center space-x-2 py-2'
              >
                <Settings className='size-4' />
                <span>Notifications</span>
              </Link>
              <Link
                href='/profile/privacy'
                className='flex items-center space-x-2 py-2'
              >
                <Settings className='size-4' />
                <span>Privacy</span>
              </Link>
            </div>

            <Divider />
            <LogoutHandler />
          </div>
        </Card>
      </div>
    );
  }
}
