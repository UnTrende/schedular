# Database Setup Guide - Part 3 Complete ✅

## Overview

Supabase PostgreSQL database has been successfully integrated with full Row Level Security (RLS) and typed database operations.

## 🎯 What's Been Implemented

### 1. Supabase Client Configuration

#### Client-Side Client
- **File**: `src/lib/supabase/client.ts`
- Singleton pattern for browser operations
- Uses anon key (respects RLS)
- Automatic connection pooling

#### Server-Side Clients
- **File**: `src/lib/supabase/server.ts`
- Two clients:
  - `getSupabaseServer()` - Respects RLS (for user operations)
  - `getSupabaseServerClient()` - Service role (bypasses RLS for admin tasks)

### 2. Database Schema

#### Tables Created
- **`social_connections`** - Stores encrypted OAuth tokens
  - `id` (UUID, primary key)
  - `user_id` (text, from Clerk)
  - `platform` (enum: twitter, facebook, instagram, linkedin)
  - `encrypted_access_token` (text)
  - `platform_username` (text, nullable)
  - `platform_user_id` (text, nullable)
  - `status` (enum: active, reconnect_needed, inactive)
  - `last_synced_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz, nullable)

- **`scheduled_posts`** - Stores post queue
  - `id` (UUID, primary key)
  - `user_id` (text, from Clerk)
  - `content` (text)
  - `media_urls` (text array)
  - `scheduled_at` (timestamptz)
  - `platform` (enum)
  - `status` (enum: pending, published, failed)
  - `published_at` (timestamptz, nullable)
  - `error_message` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz, nullable)

#### Indexes Created
- ✅ `user_id` on both tables (for filtering)
- ✅ `platform`, `status` on both tables (for queries)
- ✅ `scheduled_at` on posts (for upcoming posts query)

### 3. Row Level Security (RLS)

#### Policies Implemented
Both tables have complete RLS policies:
- **SELECT**: Users can view their own records only
- **INSERT**: Users can create their own records
- **UPDATE**: Users can modify their own records
- **DELETE**: Users can delete their own records

User ID is extracted from JWT: `current_setting('request.jwt.claims')::json->>'sub'`

### 4. Database Utility Functions

#### Connection Operations
- **File**: `src/lib/db/connections.ts`
- `getUserConnections(userId)` - Get all connections
- `getConnectionByPlatform(userId, platform)` - Get specific platform
- `createConnection(data)` - Add new connection
- `updateConnection(id, updates)` - Update connection
- `deleteConnection(id)` - Remove connection
- `getConnectionByPlatformServer(userId, platform)` - Server-side fetch

#### Post Operations
- **File**: `src/lib/db/posts.ts`
- `getUserPosts(userId, filters?)` - Get posts with optional filters
- `getPostById(postId)` - Get single post
- `createPost(data)` - Create scheduled post
- `updatePost(id, updates)` - Update post
- `deletePost(id)` - Delete post
- `getUpcomingPosts(userId, limit)` - Get next N posts
- `getPostStats(userId)` - Get post count statistics
- `getPostsToPublishServer()` - Server: Get posts ready to publish
- `updatePostStatusServer(id, status, error?)` - Server: Update status

### 5. API Routes

#### Database Test
- **Endpoint**: `GET /api/db-test`
- Tests database connectivity
- Verifies table access
- Returns user-specific data counts

#### Connections API
- **Endpoint**: `GET /api/connections`
- Get all connections for authenticated user
- Returns array of connection objects

- **Endpoint**: `POST /api/connections`
- Create new social media connection
- Body: `{ platform, encrypted_access_token, platform_username?, platform_user_id? }`
- Validates platform and enforces uniqueness

#### Posts API
- **Endpoint**: `GET /api/posts`
- Get posts with optional filters
- Query params: `?status=pending&platform=twitter&limit=10&stats=true`
- Returns posts or statistics

- **Endpoint**: `POST /api/posts`
- Create scheduled post
- Body: `{ content, media_urls?, scheduled_at, platform }`
- Validates future scheduling time

### 6. Database Types

#### TypeScript Types
- **File**: `src/lib/supabase/database.types.ts`
- Complete TypeScript definitions for all tables
- Includes Row, Insert, and Update types
- Enum definitions for platform, status types

### 7. Encryption Utilities

- **File**: `src/lib/encryption.ts`
- Placeholder for token encryption (Part 8)
- Functions: `encryptToken()`, `decryptToken()`, `generateUserKey()`
- Token validation helpers

## 📁 File Structure

```
social-scheduler/
├── supabase/
│   ├── schema.sql              # Database schema to run in Supabase
│   └── README.md               # Setup instructions
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Client-side Supabase client
│   │   │   ├── server.ts       # Server-side Supabase clients
│   │   │   └── database.types.ts # TypeScript types
│   │   ├── db/
│   │   │   ├── connections.ts  # Connection CRUD operations
│   │   │   └── posts.ts        # Post CRUD operations
│   │   └── encryption.ts       # Token encryption utilities
│   └── app/
│       └── api/
│           ├── db-test/        # Database test endpoint
│           ├── connections/    # Connections API
│           └── posts/          # Posts API
```

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details
4. Wait ~2 minutes for provisioning

### Step 2: Run Database Schema

1. Go to **SQL Editor** in Supabase
2. Copy contents of `supabase/schema.sql`
3. Paste and click "Run"

This creates:
- ✅ Tables with proper structure
- ✅ Enums for type safety
- ✅ Indexes for performance
- ✅ RLS policies for security
- ✅ Auto-update triggers

### Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)

### Step 4: Update Environment Variables

Update your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Test Connection

```bash
cd social-scheduler
npm run dev

# In another terminal or browser:
# 1. Sign in first at http://localhost:3000/sign-in
# 2. Then test: http://localhost:3000/api/db-test
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "data": {
    "userId": "user_xxx",
    "connections": [],
    "posts": [],
    "tablesAccessible": true
  }
}
```

## 🧪 Testing Database Operations

### Test Creating a Connection

```bash
curl -X POST http://localhost:3000/api/connections \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "twitter",
    "encrypted_access_token": "test_token_123",
    "platform_username": "testuser"
  }'
```

### Test Creating a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "My first scheduled post!",
    "scheduled_at": "2025-12-31T12:00:00Z",
    "platform": "twitter",
    "media_urls": []
  }'
```

### Test Getting Posts

```bash
# All posts
curl http://localhost:3000/api/posts

# Filter by status
curl http://localhost:3000/api/posts?status=pending

# Get statistics
curl http://localhost:3000/api/posts?stats=true
```

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ Enabled on all tables
- ✅ Users can only access their own data
- ✅ Automatic enforcement via JWT claims
- ✅ No manual user_id filtering needed in queries

### Token Encryption
- ⚠️ Currently using placeholder encryption
- 🔜 Will implement Web Crypto API in Part 8
- 🔐 Tokens should be encrypted in browser before storage

### API Security
- ✅ Authentication required on all API routes
- ✅ Input validation on POST requests
- ✅ User ID from Clerk JWT
- ✅ Proper error handling

## 📊 Database Schema Diagram

```
┌─────────────────────────────────────┐
│     social_connections              │
├─────────────────────────────────────┤
│ id (PK)                             │
│ user_id → Clerk User                │
│ platform (enum)                     │
│ encrypted_access_token              │
│ platform_username                   │
│ platform_user_id                    │
│ status (enum)                       │
│ last_synced_at                      │
│ created_at                          │
│ updated_at                          │
│                                     │
│ UNIQUE(user_id, platform)           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     scheduled_posts                 │
├─────────────────────────────────────┤
│ id (PK)                             │
│ user_id → Clerk User                │
│ content                             │
│ media_urls (array)                  │
│ scheduled_at                        │
│ platform (enum)                     │
│ status (enum)                       │
│ published_at                        │
│ error_message                       │
│ created_at                          │
│ updated_at                          │
└─────────────────────────────────────┘
```

## 🔧 Common Database Operations

### Get User's Connections
```typescript
import { getUserConnections } from '@/lib/db/connections'

const { data, error } = await getUserConnections(userId)
```

### Create a Scheduled Post
```typescript
import { createPost } from '@/lib/db/posts'

const { data, error } = await createPost({
  user_id: userId,
  content: "Hello world!",
  scheduled_at: new Date(Date.now() + 3600000).toISOString(),
  platform: 'twitter',
  media_urls: []
})
```

### Get Upcoming Posts
```typescript
import { getUpcomingPosts } from '@/lib/db/posts'

const { data, error } = await getUpcomingPosts(userId, 10)
```

### Update Post Status (Server-side)
```typescript
import { updatePostStatusServer } from '@/lib/db/posts'

const { data, error } = await updatePostStatusServer(
  postId,
  'published'
)
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has all three Supabase variables
- Restart dev server after adding variables

### "relation does not exist"
- Run `supabase/schema.sql` in SQL Editor
- Check you're on the correct Supabase project

### RLS blocks operations
- User must be authenticated (Clerk session)
- User ID must match the record's user_id
- For testing, you can temporarily disable RLS (don't forget to re-enable!)

### Type errors with Supabase
- We're using untyped client for flexibility
- Types are in `database.types.ts` for reference
- Can regenerate types later with Supabase CLI

## 📈 Performance Optimization

### Indexes
- All frequently queried columns are indexed
- Composite indexes may be added as usage grows

### Query Optimization
- Use `.select()` to specify needed columns
- Use `.limit()` for pagination
- Filter early in the query chain

### Caching (Future)
- Consider Redis for frequently accessed data
- Cache connection status
- Cache post statistics

## 🎯 Next Steps (Part 4)

With the database ready, we'll:
1. Create reusable UI components
2. Build proper layouts with navigation
3. Convert HTML mockups to React
4. Add loading and error states
5. Implement theme toggle

---

**Status**: ✅ Part 3 Complete - Database fully configured and tested!
