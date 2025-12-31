'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components/post-card'
import { EmptyState } from '@/components/empty-state'
import { Button, Modal } from '@/components/ui'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/components/providers/toast-provider'
import { ScheduledPost, PostStatus } from '@/types'
import Link from 'next/link'

interface PostListProps {
  statusFilter?: PostStatus | 'all'
}

export function PostList({ statusFilter = 'all' }: PostListProps) {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: ScheduledPost | null }>({
    isOpen: false,
    post: null,
  })
  const toast = useToast()

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.data || [])
      } else {
        toast.error('Failed to load posts')
      }
    } catch (error) {
      toast.error('An error occurred while loading posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.post) return

    try {
      const response = await fetch(`/api/posts/${deleteModal.post.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        setPosts(posts.filter((p) => p.id !== deleteModal.post!.id))
        setDeleteModal({ isOpen: false, post: null })
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon="event_note"
        title={
          statusFilter === 'all'
            ? 'No scheduled posts'
            : `No ${statusFilter} posts`
        }
        description="Create your first post to get started with automated social media scheduling."
        action={
          <Link href="/create-post">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined text-xl">add</span>
              <span>Create Post</span>
            </Button>
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={(post) => setDeleteModal({ isOpen: true, post })}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, post: null })}
        title="Delete Post"
        description="Are you sure you want to delete this scheduled post? This action cannot be undone."
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, post: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <span className="material-symbols-outlined text-xl">delete</span>
            <span>Delete</span>
          </Button>
        </div>
      </Modal>
    </>
  )
}
