# Cloudflare R2 Setup Guide

## Overview

Cloudflare R2 provides S3-compatible object storage with zero egress fees. Perfect for storing uploaded media files.

## 🚀 Setup Steps

### Step 1: Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up for a free account
3. Verify your email

### Step 2: Create R2 Bucket

1. In Cloudflare Dashboard, go to **R2** in the sidebar
2. Click **"Create bucket"**
3. Enter bucket name: `social-scheduler`
4. Choose location: **Automatic** (recommended)
5. Click **"Create bucket"**

### Step 3: Get API Credentials

1. In R2 dashboard, go to **"Manage R2 API Tokens"**
2. Click **"Create API token"**
3. Configure:
   - **Token name**: `social-scheduler-upload`
   - **Permissions**: 
     - ✅ Object Read & Write
   - **TTL**: Never expire (or set custom)
   - **Bucket**: Select `social-scheduler`
4. Click **"Create API Token"**
5. **IMPORTANT**: Copy these values immediately (shown only once):
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### Step 4: Configure Public Access

1. Go to your bucket (`social-scheduler`)
2. Click **"Settings"** tab
3. Under **"Public access"**:
   - Enable **"Allow Access"**
   - Copy the **Public Bucket URL**

### Step 5: Setup CORS (Optional but Recommended)

1. In bucket settings, go to **"CORS Policy"**
2. Add policy:
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step 6: Update Environment Variables

Add to your `.env.local`:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=social-scheduler
R2_PUBLIC_DOMAIN=https://pub-xxxxx.r2.dev
```

**How to get Account ID**:
1. Go to Cloudflare Dashboard
2. Click on **R2** in sidebar
3. Your Account ID is shown in the URL: `dash.cloudflare.com/{ACCOUNT_ID}/r2`

**How to get Public Domain**:
1. Go to your bucket
2. Settings → Public Access
3. Copy the **Public Bucket URL** (e.g., `https://pub-xxxxx.r2.dev`)

---

## 🧪 Testing Your Setup

### Test 1: Check Environment Variables

```bash
cd social-scheduler

# Check if variables are set (should not show empty)
grep R2_ .env.local
```

### Test 2: Upload a Test File

1. Start the dev server:
```bash
npm run dev
```

2. Sign in to your app
3. Go to **Create Post**
4. Click **"Add Media"**
5. Upload an image
6. Check if preview shows

### Test 3: Verify File in R2

1. Go to Cloudflare R2 Dashboard
2. Open your bucket
3. Navigate to `uploads/{user-id}/`
4. You should see your uploaded file

### Test 4: Check Public URL

1. Copy the public URL from the upload
2. Paste in browser
3. Image should load

---

## 📊 Free Tier Limits

Cloudflare R2 Free Tier includes:
- ✅ **10 GB storage**
- ✅ **1 million Class A operations** (writes, lists) per month
- ✅ **10 million Class B operations** (reads) per month
- ✅ **Zero egress fees** (downloads are free!)

**Our Usage Estimate**:
- Average image: 2-5 MB
- 10 GB = ~2,000 images
- 1M writes = ~1M uploads
- Plenty for most use cases!

---

## 🔒 Security Best Practices

### 1. Use Presigned URLs
✅ **Already implemented** in our code
- Client requests presigned URL from our API
- Client uploads directly to R2 using presigned URL
- Server never handles the file data
- Presigned URLs expire after 1 hour

### 2. Validate File Types
✅ **Already implemented**
- Only allows: JPG, PNG, GIF, WebP, MP4
- Validates on both client and server

### 3. Limit File Sizes
✅ **Already implemented**
- Max 10 MB per file
- Checked before upload

### 4. User Isolation
✅ **Already implemented**
- Files stored in `uploads/{user-id}/`
- Each user can only access their own files

### 5. Rotate API Keys
🔄 **Recommended**
- Rotate keys every 90 days
- Use different keys for dev/prod

---

## 🐛 Troubleshooting

### Error: "Missing R2 environment variables"

**Solution**:
1. Check `.env.local` has all R2 variables
2. Restart dev server: `npm run dev`
3. Verify no typos in variable names

### Error: "Failed to generate presigned URL"

**Possible causes**:
1. Invalid API credentials
2. Bucket doesn't exist
3. API token doesn't have correct permissions

**Solution**:
1. Re-create API token with Read & Write permissions
2. Verify bucket name matches
3. Check Account ID is correct

### Error: "Failed to upload file"

**Possible causes**:
1. CORS not configured
2. File too large
3. Invalid file type
4. Network issue

**Solution**:
1. Add CORS policy (see Step 5)
2. Check file size < 10 MB
3. Verify file type is allowed
4. Try again

### Files Upload but Don't Display

**Possible causes**:
1. Public access not enabled
2. Wrong public domain in env
3. CORS blocking access

**Solution**:
1. Enable public access on bucket
2. Verify R2_PUBLIC_DOMAIN is correct
3. Add your domain to CORS allowed origins

### Images Show Broken Icon

**Possible causes**:
1. File deleted from R2
2. Wrong URL format
3. Public access disabled

**Solution**:
1. Check file exists in R2 dashboard
2. Verify URL format: `https://pub-xxx.r2.dev/uploads/...`
3. Re-enable public access

---

## 🔄 Alternative: Custom Domain (Optional)

For production, you can use a custom domain:

### Step 1: Setup Custom Domain
1. In R2 bucket settings
2. Go to **"Custom Domains"**
3. Click **"Connect Domain"**
4. Enter your domain: `media.yourdomain.com`
5. Follow DNS setup instructions

### Step 2: Update Environment Variable
```env
R2_PUBLIC_DOMAIN=https://media.yourdomain.com
```

**Benefits**:
- ✅ Branded URLs
- ✅ Better SEO
- ✅ More professional

---

## 📈 Monitoring Usage

### Check Storage Usage
1. Go to R2 Dashboard
2. Click on your bucket
3. See **"Storage"** metric

### Check Operation Counts
1. R2 Dashboard → **"Metrics"**
2. View:
   - Class A operations (writes)
   - Class B operations (reads)
   - Storage used

### Set Up Alerts (Recommended)
1. Enable email notifications
2. Set threshold: 80% of free tier
3. Get warned before hitting limits

---

## 💰 Cost Optimization

### Tips to Stay in Free Tier

1. **Optimize Images**
   - Compress before upload
   - Use WebP format
   - Resize to reasonable dimensions

2. **Delete Unused Files**
   - Remove media from deleted posts
   - Clean up test uploads

3. **Use CDN Caching**
   - Cloudflare automatically caches public files
   - Reduces Class B operations

4. **Monitor Usage**
   - Check dashboard weekly
   - Set up alerts

---

## ✅ Setup Checklist

- [ ] Created Cloudflare account
- [ ] Created R2 bucket named `social-scheduler`
- [ ] Generated API token with Read & Write permissions
- [ ] Enabled public access on bucket
- [ ] Copied public bucket URL
- [ ] Added all R2 variables to `.env.local`
- [ ] Configured CORS policy
- [ ] Restarted dev server
- [ ] Tested file upload
- [ ] Verified file appears in R2
- [ ] Checked public URL works

---

## 🎉 You're Ready!

Once all steps are complete, you can:
- ✅ Upload images and videos
- ✅ See previews immediately
- ✅ Attach media to posts
- ✅ Store up to 10GB free

---

**Need Help?**

Common issues and solutions are in the Troubleshooting section above.

For Cloudflare R2 docs: https://developers.cloudflare.com/r2/
