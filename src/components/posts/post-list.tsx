'use client'

import { useState } from 'react'
import { PostCard } from '@/components/posts/post-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Button, Modal } from '@/components/ui'
import { useToast } from '@/components/providers/toast-provider'
import { ScheduledPost } from '@/types'
import Link from 'next/link'

export type DateFilter = 'latest' | 'older' | 'all'

interface PostListProps {
  posts: ScheduledPost[]
  selectedIds?: string[]
  onToggleSelection?: (id: string, selected: boolean) => void
  emptyMessage?: string
}

export function PostList({ 
  posts,
  selectedIds = [],
  onToggleSelection,
  emptyMessage = "No scheduled posts"
}: PostListProps) {
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: ScheduledPost | null }>({
    isOpen: false,
    post: null,
  })
  const toast = useToast()

  const handleDelete = async () => {
    if (!deleteModal.post) return

    try {
      const response = await fetch(`/api/posts/${deleteModal.post.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        // We rely on parent to refresh or we can emit an event, but window.reload in parent handles it for now.
        // Ideally we should have an onDeleteSuccess callback prop.
        window.location.reload()
        setDeleteModal({ isOpen: false, post: null })
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon="event_note"
        title={emptyMessage}
        description="Create a post to fill up your schedule."
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            selected={selectedIds.includes(post.id)}
            onSelect={(checked) => onToggleSelection?.(post.id, checked)}
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
