import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ScheduledPostsClient } from './scheduled-posts-client'
import { getUserPosts } from '@/lib/db/posts'

export default async function ScheduledPostsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Fetch initial posts (status 'all')
  const { data: posts } = await getUserPosts(userId, {})

  return <ScheduledPostsClient initialPosts={posts || []} />
}
