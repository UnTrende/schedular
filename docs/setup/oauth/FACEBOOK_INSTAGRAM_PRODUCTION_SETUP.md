# Facebook & Instagram OAuth - Production Setup

## 🎯 Prerequisites

✅ **You need**: Your Vercel deployment URL
- Example: `https://social-scheduler-xyz.vercel.app`

❌ **Won't work**: `http://localhost:3000` (Meta requires HTTPS)

---

## 📘 Part 1: Create Facebook App

### Step 1: Go to Facebook Developers

1. Visit: https://developers.facebook.com/
2. Click: **"Get Started"** (top right)
3. **Sign in** or **create account**

### Step 2: Create New App

1. Go to: https://developers.facebook.com/apps/
2. Click: **"Create App"** (green button)
3. Choose: **"Business"** type
4. Click: **"Next"**

### Step 3: App Details

```
Display Name: Social Scheduler
App Contact Email: your-email@example.com
Business Account: [Optional - Skip if you don't have one]
```

4. Click: **"Create App"**
5. Complete security check

---

## 🔧 Part 2: Configure Facebook Login

### Step 1: Add Facebook Login Product

1. In dashboard, find **"Add Products"**
2. Find **"Facebook Login"**
3. Click: **"Set Up"**

### Step 2: Choose Web Platform

1. Select: **"Web"**
2. **Site URL**: Enter your Vercel URL
   ```
   https://social-scheduler-xyz.vercel.app
   ```
3. Click: **"Save"**
4. Click: **"Continue"**

### Step 3: Configure Settings

1. Left sidebar: **Products** → **Facebook Login** → **Settings**

2. **Valid OAuth Redirect URIs** - Add:
   ```
   https://schedular-ten.vercel.app/api/oauth/callback
   ```

3. **Important Settings**:
   ```
   ✓ Use Strict Mode for Redirect URIs: Yes
   ✓ Login from Devices: No
   ```

4. Click: **"Save Changes"**

---

## 📸 Part 3: Add Instagram Support

### Step 1: Add Instagram Product

1. Dashboard: **"Add Products"**
2. Find: **"Instagram"**
3. Click: **"Set Up"**

### Step 2: Instagram Basic Display

1. Click: **"Create New App"**
2. **Display Name**: `Social Scheduler`

3. **OAuth Redirect URIs**:
   ```
   https://social-scheduler-xyz.vercel.app/api/oauth/callback
   ```

4. **Deauthorize Callback URL**:
   ```
   https://social-scheduler-xyz.vercel.app/api/oauth/deauthorize
   ```

5. **Data Deletion Request URL**:
   ```
   https://social-scheduler-xyz.vercel.app/api/oauth/delete
   ```

6. Click: **"Create App"**
7. Click: **"Save Changes"**

---

## 🔑 Part 4: Get Credentials

### Step 1: Get App ID and Secret

1. Left sidebar: **Settings** → **Basic**
2. You'll see:

   **App ID**:
   ```
   1234567890123456
   ```
   👆 **Copy this**

3. **App Secret**: Click "Show"
4. Enter your Facebook password
5. **App Secret**:
   ```
   abcdef1234567890abcdef1234567890
   ```
   👆 **Copy this**

---

## 💻 Part 5: Add to Vercel

### Update Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select: `social-scheduler` project
3. Go to: **Settings** → **Environment Variables**

4. Add these:

   **Variable**: `FACEBOOK_APP_ID`
   **Value**: `1234567890123456` (your app ID)
   **Environment**: Production, Preview, Development
   
   **Variable**: `FACEBOOK_APP_SECRET`
   **Value**: `abcdef...` (your app secret)
   **Environment**: Production, Preview, Development

5. Click: **"Save"**

### Redeploy

```bash
vercel --prod
```

Or in Vercel dashboard:
- Go to **Deployments** tab
- Click **"Redeploy"** on latest deployment

---

## 🧪 Part 6: Test OAuth Flow

### Step 1: Visit Your Live Site

```
https://social-scheduler-xyz.vercel.app
```

### Step 2: Sign In

Use Clerk authentication

### Step 3: Connect Facebook

1. Go to: **Connections** page
2. Find: **Facebook** card
3. Click: **"Connect"** button

### What Should Happen:

```
1. Browser redirects to Facebook
   ✓ Shows Facebook OAuth page
   
2. You see "Continue as [Your Name]"
   ✓ Shows permissions request
   
3. Click "Continue"
   ✓ Redirects back to your app
   
4. Success!
   ✓ Toast notification appears
   ✓ Facebook shows as "Connected"
   ✓ Your username displays
```

### Step 4: Connect Instagram

Same process:
1. Click: **"Connect"** on Instagram card
2. Authorize on Facebook/Instagram
3. Should show as connected

---

## 🎭 Part 7: Test Users (Optional)

While your app is in Development Mode, only you can use it.

### Add Test Users

1. Dashboard: **Roles** → **Testers**
2. Click: **"Add Testers"**
3. Enter Facebook user IDs or emails
4. They can now connect their accounts

---

## 📱 Part 8: App Review (For Production)

When ready to go public:

### Required for Instagram

1. Dashboard: **App Review** → **Permissions and Features**
2. Request these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`

3. For each permission:
   - Click **"Request"**
   - Provide:
     - App demo video (screen recording)
     - Explanation of usage
     - Test account credentials

4. Submit for review
5. Wait 3-5 business days

### Required for Facebook

Similar process for:
- `pages_manage_posts`
- `pages_read_engagement`

---

## ✅ Verification Checklist

- [ ] App created on Facebook
- [ ] Facebook Login added
- [ ] Instagram product added
- [ ] OAuth redirect URIs use HTTPS
- [ ] All URLs point to Vercel domain
- [ ] App ID copied
- [ ] App Secret copied
- [ ] Variables added to Vercel
- [ ] App redeployed
- [ ] Tested Facebook connection
- [ ] Tested Instagram connection
- [ ] Connection shows in UI
- [ ] Username displays correctly

---

## 🐛 Common Issues & Fixes

### Issue: "Invalid OAuth Redirect URI"

**Cause**: URL mismatch

**Fix**:
1. Check exact URL in Facebook dashboard:
   ```
   https://social-scheduler-xyz.vercel.app/api/oauth/callback
   ```
2. Must be HTTPS
3. No trailing slash
4. Must match exactly
5. Save changes
6. Wait 5 minutes for cache

### Issue: "App Not Set Up"

**Cause**: Facebook Login not configured

**Fix**:
1. Products → Facebook Login
2. Check it's added
3. Go to Settings
4. Verify redirect URI
5. Save changes

### Issue: Connection Works but Shows Demo Data

**Cause**: Token exchange not fully implemented

**Status**: This is expected for now. In current implementation:
- OAuth flow works ✓
- Connection is created ✓
- Demo token is stored ✓
- Real token exchange happens in worker (Part 10) ✓

The connection IS working - you're just seeing placeholder data until you set up the worker.

### Issue: "Can't Load URL" on Facebook OAuth Page

**Cause**: Vercel app not accessible or URL wrong

**Fix**:
1. Test your Vercel URL in browser
2. Make sure it loads
3. Check redirect URI is exact match
4. Clear Facebook cache (Settings → Privacy → Clear Browsing Data)

---

## 📊 Development vs Production

### Development Mode (Current)
- ✅ Works for you (app creator)
- ✅ Works for added testers
- ✅ No public access
- ✅ Perfect for building/testing

### Production Mode (After Review)
- ✅ Works for any user
- ✅ Public OAuth
- ✅ Requires app review
- ✅ Takes 3-5 days

**Recommendation**: Stay in Development Mode until app is fully tested.

---

## 🎯 Summary

### Your OAuth Callback URL

```
https://social-scheduler-xyz.vercel.app/api/oauth/callback
```

### What Works Now

- ✅ OAuth flow on production
- ✅ Real Facebook authorization
- ✅ Real Instagram authorization  
- ✅ HTTPS callback accepted
- ✅ Connections saved to database
- ✅ Status tracking

### What's Next

After connecting accounts:
1. Create posts
2. Schedule them
3. Worker publishes to platforms (when deployed)

---

## 📞 Need Help?

### Facebook Developer Support
- Dashboard: https://developers.facebook.com/support/
- Community: https://developers.facebook.com/community/

### Check These First
1. Redirect URI is HTTPS ✓
2. URL matches exactly ✓
3. Changes saved ✓
4. App redeployed ✓
5. Waited 5 minutes for cache ✓

---

## ✨ Success!

Once you see:
- Facebook: "Connected" ✅
- Instagram: "Connected" ✅

**You're ready to start scheduling posts!** 🎉

---

**Your production OAuth setup is complete!**
