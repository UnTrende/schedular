# ✅ R2 Setup Checklist

## Current Status

✅ **R2 Credentials Configured** - Added to `.env.local`
⏳ **Bucket Creation Required** - You need to create the bucket

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create R2 Bucket

1. Go to https://dash.cloudflare.com/r2
2. Click **"Create bucket"**
3. Name: `social-scheduler`
4. Location: **Automatic**
5. Click **"Create bucket"**

### Step 2: Enable Public Access

1. Click on your `social-scheduler` bucket
2. Go to **Settings** tab
3. Under **"Public access"**, click **"Allow Access"**
4. Confirm the action

### Step 3: Add CORS Policy (Optional but Recommended)

1. In bucket settings, go to **"CORS Policy"**
2. Click **"Add CORS Policy"**
3. Paste this JSON:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "http://localhost:3001"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

4. Click **"Save"**

### Step 4: Verify Public URL

1. In bucket settings, under **Public access**
2. Copy the **Public Bucket URL**
3. Should match: `https://pub-777c4c5194974623a5a94121ae458c7e.r2.dev`
4. If different, update `R2_PUBLIC_DOMAIN` in `.env.local`

### Step 5: Restart Dev Server

```bash
cd social-scheduler
# Stop any running servers
pkill -f "next dev"

# Start fresh
npm run dev
```

---

## 🧪 Test Your Setup

### Test 1: Visit the App
```
1. Open http://localhost:3000
2. Sign in (or sign up)
3. Go to "Create Post"
4. You should see "Add Media" button
```

### Test 2: Upload a File
```
1. Click "Add Media"
2. Select an image (< 10 MB)
3. Watch the upload progress
4. Preview should appear
5. ✅ Success!
```

### Test 3: Verify in R2 Dashboard
```
1. Go to Cloudflare R2 → social-scheduler bucket
2. Navigate: uploads → {your-user-id} → {filename}
3. Your file should be there
4. Click on it to see the public URL
```

---

## ❓ Troubleshooting

### "Access Denied" Error
**Cause**: Bucket doesn't exist yet
**Fix**: Create bucket named `social-scheduler` (Step 1)

### Upload Fails Silently
**Cause**: CORS not configured
**Fix**: Add CORS policy (Step 3)

### Preview Doesn't Show
**Cause**: Public access not enabled
**Fix**: Enable public access (Step 2)

### Different Public URL
**Cause**: Cloudflare assigned different URL
**Fix**: Update `R2_PUBLIC_DOMAIN` in `.env.local` with your actual URL

---

## ✨ What Works Right Now

Even without R2 setup:
- ✅ App runs perfectly
- ✅ Can create posts (without media)
- ✅ All other features work
- ✅ Upload UI shows (just fails gracefully)

**With R2 setup**:
- ✅ Upload images & videos
- ✅ See previews
- ✅ Attach media to posts
- ✅ Professional media management

---

## 📊 Your Credentials (Configured)

```
Account ID: 32d604c14bfbcc0ba0d35077d054d2a0
Access Key: 510c7f9b61244ea517eca701b837e33e
Secret Key: [CONFIGURED - DO NOT SHARE]
Bucket Name: social-scheduler
Public Domain: https://pub-777c4c5194974623a5a94121ae458c7e.r2.dev
```

All credentials are safely stored in `.env.local` (not in git).

---

## 🎯 Current Progress

**Completed**: 7 out of 10 parts (70%)

✅ 1. Project Setup
✅ 2. Authentication
✅ 3. Database
✅ 4. UI Components
✅ 5. Auth Pages
✅ 6. Post Creation
✅ 7. File Upload (code ready, needs bucket)

**Next**: Part 8 - Social Connections (OAuth)

---

## 💡 Pro Tip

You can continue building without setting up R2 right now. The app works fine, and you can add R2 later. Just create the bucket when you're ready to test uploads!

**Ready to continue?** We can move to Part 8 (Social Connections) while you set up R2 in the background.
