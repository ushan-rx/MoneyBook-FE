import GroupDetailsDrawer from '../components/GroupDetailsDrawer';
import TopNavLayout from '@/components/layouts/WithoutNavLayout';
import StatCardMotionDiv from '../components/StatCardMotionDiv';
import { requireAuth } from '@/lib/server-auth';

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await requireAuth();
  if (auth.authenticated) {
    return (
      <TopNavLayout>
        <TopNavLayout.Header topic='group'>
          <GroupDetailsDrawer />
        </TopNavLayout.Header>
        <TopNavLayout.Body>
          <StatCardMotionDiv />
        </TopNavLayout.Body>
      </TopNavLayout>
    );
  }
}
