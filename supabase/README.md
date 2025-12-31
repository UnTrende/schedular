# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Project Name**: social-scheduler
   - **Database Password**: (generate a strong password and save it)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `schema.sql` file
4. Paste into the editor
5. Click "Run" to execute

This will create:
- ✅ `social_connections` table
- ✅ `scheduled_posts` table
- ✅ Enums for platform, status types
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Auto-update triggers

## Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbG...` (safe to expose in frontend)
   - **service_role key**: `eyJhbG...` (keep secret, server-side only)

## Step 4: Update Environment Variables

Add to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Test Connection

Run this test in your terminal:

```bash
cd social-scheduler
npm run dev
```

Then test the database connection by creating a test post through the API.

## Verifying Setup

### Check Tables Created

1. Go to **Table Editor** in Supabase
2. You should see:
   - `social_connections`
   - `scheduled_posts`

### Check RLS Policies

1. Go to **Authentication** → **Policies**
2. You should see policies for both tables:
   - View, Insert, Update, Delete policies

### Test Row Level Security

Try to query the tables:

```sql
-- This should work (returns empty array for unauthenticated)
SELECT * FROM social_connections;

-- This should be blocked by RLS
INSERT INTO social_connections (user_id, platform, encrypted_access_token)
VALUES ('test', 'twitter', 'test');
```

## Database Schema Diagram

```
social_connections
├── id (uuid, PK)
├── user_id (text)
├── platform (enum)
├── encrypted_access_token (text)
├── platform_username (text, nullable)
├── platform_user_id (text, nullable)
├── status (enum)
├── last_synced_at (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz, nullable)

scheduled_posts
├── id (uuid, PK)
├── user_id (text)
├── content (text)
├── media_urls (text[])
├── scheduled_at (timestamptz)
├── platform (enum)
├── status (enum)
├── published_at (timestamptz, nullable)
├── error_message (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz, nullable)
```

## Important Notes

### Row Level Security (RLS)

- ✅ **Enabled** on both tables
- ✅ Users can only access their own data
- ✅ User ID comes from JWT token (`request.jwt.claims`)
- ⚠️ Service role bypasses RLS (use carefully)

### Clerk + Supabase Integration

The RLS policies expect the user ID from Clerk to be in the JWT:

```javascript
// This is handled automatically by our middleware
user_id = current_setting('request.jwt.claims', true)::json->>'sub'
```

For API routes using service role, you'll manually filter by user_id.

### Performance

- ✅ Indexes created on frequently queried columns
- ✅ Auto-updating `updated_at` timestamps
- ✅ Efficient queries with proper filtering

## Troubleshooting

### "relation does not exist"
- Run the schema.sql again
- Check you're on the correct project

### RLS prevents inserts
- Check your middleware is passing user ID correctly
- For testing, you can temporarily disable RLS:
  ```sql
  ALTER TABLE social_connections DISABLE ROW LEVEL SECURITY;
  ```
  (Don't forget to re-enable it!)

### Connection timeout
- Check your API keys are correct
- Verify project URL has no trailing slash
- Check Supabase project is not paused (free tier pauses after inactivity)

## Next Steps

Once setup is complete, you can:
1. ✅ Create social media connections
2. ✅ Schedule posts
3. ✅ Query user-specific data
4. ✅ Use database utilities in `src/lib/db/`
