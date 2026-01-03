import { PostCreationForm } from '@/components/post-creation-form'
import { ProtectedRoute } from '@/components/protected-route'

export default async function CreatePostPage() {
  return (
    <ProtectedRoute>
      <div className="p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Create Post
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
              Schedule a post across your connected social media platforms
            </p>
          </div>

          <PostCreationForm />
        </div>
      </div>
    </ProtectedRoute>
  )
}
