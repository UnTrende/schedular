import { ProtectedRoute } from '@/components/protected-route'
import CreatePostClient from './CreatePostClient'

export default async function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostClient />
    </ProtectedRoute>
  )
}
