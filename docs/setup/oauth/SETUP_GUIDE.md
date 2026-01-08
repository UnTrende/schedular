# OAuth Setup Guide - Social Media Platforms

## Overview

This guide explains how to set up OAuth credentials for each social media platform to enable account connections.

## 🔑 Important Notes

### Security & Production
- **Demo Mode**: The current implementation includes a demo OAuth flow for testing
- **Production**: You need real OAuth apps from each platform
- **Token Encryption**: Implement proper encryption before going live (see Part 8 documentation)

---

## 🐦 Twitter / X OAuth Setup

### Step 1: Create Twitter Developer Account

1. Go to https://developer.twitter.com/
2. Sign up for a developer account
3. Complete the application process (usually instant for basic access)

### Step 2: Create an App

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Click **"+ Create Project"**
3. Fill in project details
4. Create an app within the project

### Step 3: Configure OAuth 2.0

1. In your app settings, go to **"User authentication settings"**
2. Click **"Set up"**
3. Configure:
   - **App permissions**: Read and write
   - **Type of App**: Web App
   - **Callback URL**: `http://localhost:3000/api/oauth/callback` (dev)
   - **Website URL**: `http://localhost:3000`

### Step 4: Get Credentials

1. Go to **"Keys and tokens"** tab
2. Copy:
   - **Client ID**
   - **Client Secret**

### Step 5: Add to Environment

```env
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

---

## 📘 Facebook OAuth Setup

### Step 1: Create Facebook Developer Account

1. Go to https://developers.facebook.com/
2. Sign up / Sign in
3. Complete identity verification if needed

### Step 2: Create an App

1. Click **"My Apps"** → **"Create App"**
2. Choose **"Business"** type
3. Fill in app details
4. Complete security check

### Step 3: Add Facebook Login

1. In your app dashboard, click **"Add Product"**
2. Find **"Facebook Login"** and click **"Set Up"**
3. Choose **"Web"** platform

### Step 4: Configure Settings

1. Go to **Facebook Login** → **Settings**
2. Add OAuth redirect URI:
   - `http://localhost:3000/api/oauth/callback`
3. Save changes

### Step 5: Get Credentials

1. Go to **Settings** → **Basic**
2. Copy:
   - **App ID**
   - **App Secret** (click "Show")

### Step 6: Add to Environment

```env
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

---

## 📸 Instagram OAuth Setup

**Note**: Instagram uses Facebook's OAuth system.

### Step 1: Use Facebook App

1. Use the same app you created for Facebook
2. Or create a new one following Facebook steps above

### Step 2: Add Instagram Product

1. In your Facebook app, click **"Add Product"**
2. Find **"Instagram"** and click **"Set Up"**
3. Follow the setup wizard

### Step 3: Instagram Basic Display

1. Go to **Instagram** → **Basic Display**
2. Click **"Create New App"**
3. Configure:
   - **Valid OAuth Redirect URIs**: `http://localhost:3000/api/oauth/callback`
   - **Deauthorize Callback URL**: `http://localhost:3000/api/oauth/deauthorize`
   - **Data Deletion Request URL**: `http://localhost:3000/api/oauth/delete`

### Step 4: Get Credentials

Use the same credentials as Facebook:
```env
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

---

## 💼 LinkedIn OAuth Setup

### Step 1: Create LinkedIn App

1. Go to https://www.linkedin.com/developers/
2. Click **"Create app"**
3. Fill in:
   - **App name**
   - **LinkedIn Page** (you need to create a company page first)
   - **App logo**
   - **Legal agreement**

### Step 2: Request Products

1. In your app, go to **"Products"** tab
2. Request **"Share on LinkedIn"** product
3. Request **"Sign In with LinkedIn"** product
4. Wait for approval (usually instant for basic access)

### Step 3: Configure OAuth

1. Go to **"Auth"** tab
2. Add **Redirect URLs**:
   - `http://localhost:3000/api/oauth/callback`
3. Copy your credentials

### Step 4: Get Credentials

1. In **"Auth"** tab, find:
   - **Client ID**
   - **Client Secret**

### Step 5: Add to Environment

```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

---

## 🔐 Complete Environment Variables

Add all credentials to `.env.local`:

```env
# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Facebook OAuth (also used for Instagram)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

---

## 🧪 Testing OAuth Flow

### Test Without Real Credentials (Demo Mode)

1. Start your app: `npm run dev`
2. Sign in to your account
3. Go to **Connections** page
4. Click **"Connect"** on any platform
5. It will create a demo connection (no real OAuth)

### Test With Real Credentials

1. Add OAuth credentials to `.env.local`
2. Restart dev server
3. Go to **Connections** page
4. Click **"Connect"**
5. You'll be redirected to the platform's OAuth page
6. Authorize the app
7. You'll be redirected back with the connection created

---

## 🚨 Important Production Steps

### Before Going Live

1. **Implement Token Encryption**
   ```typescript
   // Use Web Crypto API for client-side encryption
   // Encrypt tokens before sending to server
   // Never store plaintext tokens
   ```

2. **Update Callback URLs**
   - Change from `localhost` to your production domain
   - Update in each platform's developer console

3. **Implement Token Exchange**
   - Currently using placeholder tokens
   - Implement real token exchange in `/api/oauth/callback/route.ts`
   - Exchange authorization code for access token
   - Fetch user profile from each platform

4. **Add Token Refresh**
   - Store refresh tokens (encrypted)
   - Implement token refresh logic
   - Handle expired tokens gracefully

5. **Add Scopes Management**
   - Request only needed permissions
   - Handle scope changes
   - Re-authorization flow

---

## 📋 OAuth Flow Diagram

```
1. User clicks "Connect" on platform
   ↓
2. App redirects to /api/oauth/[platform]
   ↓
3. Server generates state (CSRF protection)
   ↓
4. Server redirects to platform's OAuth page
   ↓
5. User authorizes app on platform
   ↓
6. Platform redirects to /api/oauth/callback?code=...&state=...
   ↓
7. Server validates state
   ↓
8. Server exchanges code for access token
   ↓
9. Server encrypts token
   ↓
10. Server stores encrypted token in database
   ↓
11. User redirected to /connections?success=true
```

---

## 🔧 Troubleshooting

### "Invalid redirect URI" Error
- Check callback URL matches exactly in developer console
- Include protocol (http/https)
- No trailing slashes

### "Invalid client ID" Error
- Verify environment variables are set
- Check for typos in `.env.local`
- Restart dev server after adding variables

### "Unauthorized" Error
- App may not be approved for production use
- Check app status in developer console
- Some platforms require review before going live

### OAuth Callback Never Completes
- Check browser console for errors
- Verify state parameter is valid
- Check network tab for failed requests

---

## 📊 Platform Comparison

| Platform | Setup Difficulty | Approval Time | Free Tier |
|----------|-----------------|---------------|-----------|
| Twitter  | Easy            | Instant       | Yes       |
| Facebook | Medium          | Instant       | Yes       |
| Instagram| Medium          | Instant       | Yes       |
| LinkedIn | Easy            | Instant       | Yes       |

---

## 🎯 Current Implementation Status

### ✅ Implemented
- OAuth URL generation
- State parameter (CSRF protection)
- Callback handling
- Demo mode (for testing without credentials)
- Connection storage
- Connection management UI

### ⏳ Needs Implementation (Production)
- Real token exchange
- Token encryption
- Token refresh
- Platform API calls
- Error handling for each platform
- Scope management

---

## 📚 Additional Resources

### Twitter
- [Twitter OAuth 2.0 Docs](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [API Reference](https://developer.twitter.com/en/docs/api-reference-index)

### Facebook
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login/)
- [Graph API](https://developers.facebook.com/docs/graph-api/)

### Instagram
- [Instagram Basic Display](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram API](https://developers.facebook.com/docs/instagram-api)

### LinkedIn
- [LinkedIn OAuth 2.0](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Share API](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api)

---

## ✅ Setup Checklist

- [ ] Created developer accounts for all platforms
- [ ] Created apps in each developer console
- [ ] Configured OAuth callback URLs
- [ ] Copied client IDs and secrets
- [ ] Added credentials to `.env.local`
- [ ] Restarted dev server
- [ ] Tested connection flow
- [ ] Verified connections are saved

---

**Status**: OAuth infrastructure ready. Add real credentials to enable live connections!
