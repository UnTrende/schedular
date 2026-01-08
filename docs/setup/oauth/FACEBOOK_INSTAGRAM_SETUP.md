# Facebook & Instagram OAuth Setup - Step by Step

## Overview

Facebook and Instagram use the same OAuth system since Facebook owns Instagram. You'll create one app that works for both platforms.

---

## 📘 Part 1: Facebook Developer Account Setup

### Step 1: Create Facebook Developer Account

1. **Go to**: https://developers.facebook.com/
2. **Click**: "Get Started" (top right)
3. **Choose**: 
   - Use existing Facebook account, OR
   - Create new Facebook account
4. **Complete** the registration:
   - Accept developer terms
   - Verify email if needed

### Step 2: Verify Your Account (If Required)

Some accounts need verification:
1. Go to **Settings** → **Profile**
2. Add phone number if requested
3. Complete identity verification if prompted
4. Wait for approval (usually instant)

---

## 📱 Part 2: Create Facebook App

### Step 1: Create New App

1. **Go to**: https://developers.facebook.com/apps/
2. **Click**: "Create App" (green button)

### Step 2: Choose App Type

You'll see several options:
- ✅ **Select**: "Business" (recommended)
- OR **Select**: "Consumer" (also works)
- **Click**: "Next"

### Step 3: Fill App Details

```
App Name: Social Scheduler
Contact Email: your-email@example.com
```

Optional:
```
Business Account: [Select if you have one, or skip]
```

4. **Click**: "Create App"
5. **Complete** security check (if shown)

### Step 4: You're In!

You should now see your app dashboard.

---

## 🔧 Part 3: Configure Facebook Login

### Step 1: Add Facebook Login Product

1. In your app dashboard, look for **"Add Products"** section
2. Find **"Facebook Login"**
3. **Click**: "Set Up"

### Step 2: Choose Platform

You'll see platform options:
- ✅ **Select**: "Web"
- **Enter Site URL**: `http://localhost:3000`
- **Click**: "Save"
- **Click**: "Continue"

### Step 3: Configure OAuth Settings

1. In left sidebar, go to: **Facebook Login** → **Settings**
2. Find **"Valid OAuth Redirect URIs"**
3. **Add this URL**:
   ```
   http://localhost:3000/api/oauth/callback
   ```
4. **Click**: "Save Changes"

### Additional Settings (Optional but Recommended)

Scroll down and configure:
```
✓ Login from Devices: No
✓ Use Strict Mode for Redirect URIs: Yes
```

---

## 🔑 Part 4: Get Facebook Credentials

### Step 1: Go to Basic Settings

1. In left sidebar, click: **Settings** → **Basic**
2. You'll see your app credentials

### Step 2: Copy App ID

```
App ID: 1234567890123456
```
**Click the copy icon** to copy it.

### Step 3: Copy App Secret

1. **Click**: "Show" next to App Secret
2. **Enter your Facebook password** to reveal it
3. **Copy** the secret:
   ```
   App Secret: abcdef1234567890abcdef1234567890
   ```

### Step 4: Save These Credentials

Keep them safe! You'll need them in a moment.

---

## 📸 Part 5: Add Instagram Support

### Step 1: Add Instagram Product

1. In app dashboard, find **"Add Products"** section again
2. Find **"Instagram"**
3. **Click**: "Set Up"

### Step 2: Choose Instagram Basic Display

1. You'll see Instagram product page
2. Look for **"Instagram Basic Display"**
3. **Click**: "Create New App"

### Step 3: Create Instagram App

Fill in the form:
```
Display Name: Social Scheduler
Privacy Policy URL: http://localhost:3000/privacy (you'll create this later)
Terms of Service URL: http://localhost:3000/terms (you'll create this later)
```

For now, you can use placeholder URLs. We'll create actual pages later.

**Click**: "Create App"

### Step 4: Configure Instagram OAuth

In the Instagram Basic Display settings, add:

1. **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/api/oauth/callback
   ```

2. **Deauthorize Callback URL**:
   ```
   http://localhost:3000/api/oauth/deauthorize
   ```

3. **Data Deletion Request URL**:
   ```
   http://localhost:3000/api/oauth/delete
   ```

**Click**: "Save Changes"

### Step 5: Note About Credentials

Instagram uses the **same credentials as Facebook**:
- Same App ID
- Same App Secret

---

## 💻 Part 6: Add Credentials to Your App

### Step 1: Open Your .env.local File

```bash
cd social-scheduler
nano .env.local
# or use your text editor
```

### Step 2: Add Facebook/Instagram Credentials

Add these lines (replace with your actual values):

```env
# Facebook OAuth (also used for Instagram)
FACEBOOK_APP_ID=1234567890123456
FACEBOOK_APP_SECRET=abcdef1234567890abcdef1234567890
```

### Step 3: Save and Close

- **Save** the file
- **Close** your editor

### Step 4: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C if running)
# Start it again
npm run dev
```

---

## 🧪 Part 7: Test Your Setup

### Test Facebook Connection

1. **Visit**: http://localhost:3000
2. **Sign in** to your app (if not already)
3. **Go to**: Connections page
4. **Find**: Facebook card
5. **Click**: "Connect" button

**What should happen**:
- Browser redirects to Facebook
- You see "Continue as [Your Name]"
- Authorize the app
- Redirected back to your app
- Success message appears
- Facebook shows as "Connected"

### Test Instagram Connection

Same process:
1. **Go to**: Connections page
2. **Find**: Instagram card
3. **Click**: "Connect" button

**What should happen**:
- Browser redirects to Instagram/Facebook
- Authorize the app
- Redirected back
- Instagram shows as "Connected"

---

## 📋 App Review & Permissions

### For Development (Current Stage)

Your app is in **Development Mode**:
- ✅ Works for you (app creator)
- ✅ Works for added testers
- ❌ Doesn't work for public users

**This is perfect for building your app!**

### For Production (Later)

When ready to go live:

1. **Add Testers** (optional, for beta testing):
   - Settings → Roles → Testers
   - Add Facebook user IDs or emails
   
2. **Request Permissions** (when ready for production):
   - App Review → Permissions and Features
   - Request permissions you need:
     - `pages_manage_posts`
     - `instagram_basic`
     - `instagram_content_publish`
   
3. **Submit for Review**:
   - Provide screencast of your app
   - Explain how you use each permission
   - Wait for Facebook review (few days)

---

## 🔍 Verify Your Setup

### Checklist

- [ ] Facebook developer account created
- [ ] App created in Facebook dashboard
- [ ] Facebook Login product added
- [ ] OAuth redirect URI configured
- [ ] App ID copied
- [ ] App Secret copied
- [ ] Instagram product added
- [ ] Instagram Basic Display configured
- [ ] Credentials added to `.env.local`
- [ ] Dev server restarted
- [ ] Tested Facebook connection
- [ ] Tested Instagram connection

---

## 🐛 Troubleshooting

### "Invalid OAuth redirect URI" Error

**Problem**: The callback URL doesn't match

**Solution**:
1. Check it's exactly: `http://localhost:3000/api/oauth/callback`
2. No trailing slash
3. Must be `http` (not `https`) for localhost
4. Check for typos
5. Save changes in Facebook dashboard
6. Try again

### "App Not Set Up" Error

**Problem**: Facebook Login not configured

**Solution**:
1. Go to Products → Facebook Login
2. Make sure it's added
3. Go to Settings
4. Add OAuth redirect URI
5. Save changes

### Can't Reveal App Secret

**Problem**: Facebook asks for password

**Solution**:
1. Enter your Facebook password
2. If you forgot it, reset it
3. Complete any security checks
4. Try again

### Connection Works but Shows "Demo User"

**Problem**: Using placeholder token (demo mode)

**Solution**:
This is expected in current implementation. The actual token exchange will be implemented when building the publishing worker (Part 10).

For now, you're testing the OAuth flow, which is working correctly!

### Instagram Asks for Business Account

**Problem**: Instagram requires business/creator account for API

**Solution**:
For testing:
- Can skip for now
- Use Facebook connection instead

For production:
- Convert Instagram account to business/creator
- Connect to Facebook page
- Then reconnect

---

## 📸 What You Can Do Now

### With Facebook Connected:
- Ready to post to Facebook pages (Part 10)
- Can schedule posts for Facebook
- Test full flow

### With Instagram Connected:
- Ready to post to Instagram (Part 10)
- Can schedule posts for Instagram
- Test full flow

---

## 🎯 Next Steps

Now that Facebook and Instagram are set up:

1. ✅ **Facebook & Instagram OAuth working**
2. ⏭️ **Optional**: Set up Twitter and LinkedIn
3. ⏭️ **Continue**: Part 9 (Post Scheduling)
4. ⏭️ **Complete**: Part 10 (Publishing Worker)

---

## 📚 Useful Links

- **Facebook Developers**: https://developers.facebook.com/
- **App Dashboard**: https://developers.facebook.com/apps/
- **Facebook Login Docs**: https://developers.facebook.com/docs/facebook-login/
- **Instagram Basic Display**: https://developers.facebook.com/docs/instagram-basic-display-api/
- **Graph API Explorer**: https://developers.facebook.com/tools/explorer/

---

## 💡 Pro Tips

1. **Bookmark Your App Dashboard**
   - You'll visit it often during development

2. **Test Accounts**
   - Create test Facebook accounts for testing
   - Add them as testers in your app

3. **Development Mode**
   - Keep app in development mode while building
   - Only go live when ready

4. **Monitor Errors**
   - Check browser console for errors
   - Look at Network tab for failed requests

5. **Token Expiry**
   - Facebook tokens expire (60 days default)
   - You'll need refresh logic (Part 10)

---

## ✅ Success!

If you can see Facebook and Instagram as "Connected" in your app, you've successfully set up OAuth for both platforms!

**You're now ready to**:
- Schedule posts for Facebook
- Schedule posts for Instagram
- Continue building the app

Great job! 🎉

---

**Need help?** Check the troubleshooting section above or review the Facebook developer documentation.
