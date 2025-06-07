import { Card, CardHeader } from '@/components/ui/card';
import { requireAuth } from '@/lib/server-auth';
import EditProfileForm from './components/EditProfileForm';
import TopNavLayout from '@/components/layouts/WithoutNavLayout';

export default async function EditProfilePage() {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return (
      <TopNavLayout>
        <TopNavLayout.Header topic='Edit Profile'></TopNavLayout.Header>
        <TopNavLayout.Body>
          <div className='container mx-auto max-w-md px-4 py-8'>
            <Card>
              <CardHeader className='pb-4'></CardHeader>
              <EditProfileForm />
            </Card>
          </div>
        </TopNavLayout.Body>
      </TopNavLayout>
    );
  }
}
