'use client';

import EmployeeLayout from '@/components/layout/employee-layout';
import { PostsFeed } from '@/components/posts-feed';

export default function EmployeeFeedPage() {
  return (
    <EmployeeLayout>
      <PostsFeed />
    </EmployeeLayout>
  );
}
