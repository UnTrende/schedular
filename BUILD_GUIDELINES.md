# Build & Refactoring Guidelines

## Critical Fixes Log (Jan 2026)

The following issues caused Vercel build failures and were resolved. **Read this before modifying components to prevent regression.**

### 1. Component Imports (Module Not Found)
**Issue:** Moving components to subfolders (e.g., `src/components/shared/`) broke relative imports in sibling files (e.g., `import { PlatformIcon } from './platform-icon'`).
**Rule:** **ALWAYS use absolute path aliases** when importing components, especially if they might be moved or are in `shared` folders.
*   ❌ `import { LoadingSpinner } from './loading-spinner'`
*   ✅ `import { LoadingSpinner } from '@/components/shared/loading-spinner'`

### 2. Type Safety (Missing Imports & implicit any)
**Issue:** `SocialProfilesSidebar` used `SocialConnection` without importing it, and `EventDetailsModal` used `any` for `platform`.
**Rule:**
*   Ensure all custom types are correctly imported from `@/types`.
*   Avoid `any` for platform fields; use the `Platform` union type.

### 3. Strict Null Checks (TypeScript)
**Issue:** Logic like `isPublished ? format(post.published_at) : ...` failed because `published_at` is optional (`string | undefined`). TypeScript strictly forbids passing `undefined` to functions expecting `string | Date`.
**Rule:** **Explicitly check for existence** of optional fields before passing them to helper functions.
*   ❌ `isPublished ? formatRelativeTime(post.published_at) : ...`
*   ✅ `isPublished && post.published_at ? formatRelativeTime(post.published_at) : ...`
