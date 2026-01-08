'use client'

import { useRouter } from 'next/navigation'
import { PostCreationForm } from '@/components/posts/post-creation-form'

export default function CreatePostClient() {
  const router = useRouter()

  const handlePostCreated = () => {
    router.push('/scheduled-posts')
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <div className="p-4 md:p-10 h-full">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="mb-10 text-center sm:text-left space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-gradient pb-1">
            Create Post
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
            Schedule a post across your connected social media platforms
          </p>
        </div>

        <div className="flex-1 p-1">
          <PostCreationForm onPostCreated={handlePostCreated} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
