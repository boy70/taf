'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EmployeeLayout from '@/components/layout/employee-layout';
import { PostsComponent } from '@/components/posts-component';
import { Card } from '@/components/ui/card';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: string;
  author: { id: string; name: string; email: string };
  createdAt: string;
  taggedUserIds?: string;
  comments?: { id: string; content: string; author: { id: string; name: string } }[];
  likes?: { userId: string }[];
}

export default function EmployeePostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts?approved=true&limit=20`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Community Posts
          </h1>
          <p className="text-gray-600 mt-2">
            Share and engage with posts from your organization
          </p>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading posts...</p>
          </Card>
        ) : (
          <PostsComponent
            posts={posts as any}
            onRefreshAction={fetchPosts}
            canApprove={false}
          />
        )}
      </div>
    </EmployeeLayout>
  );
}
