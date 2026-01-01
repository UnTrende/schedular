# Deploy to Vercel - Quick Guide

## Why Deploy First?

Facebook and Instagram OAuth **require HTTPS URLs** for callbacks. They won't accept `localhost` URLs.

**Solution**: Deploy to Vercel (free) to get a public HTTPS URL, then configure OAuth.

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Choose your preferred login method (GitHub, email, etc.)

### Step 3: Deploy

```bash
cd social-scheduler
vercel
```

**Follow the prompts**:
```
? Set up and deploy "social-scheduler"? Yes
? Which scope? [Your account]
? Link to existing project? No
? What's your project's name? social-scheduler
? In which directory is your code located? ./
? Want to override the settings? No
```

### Step 4: Wait for Deployment

```
✅ Production: https://social-scheduler-xyz.vercel.app
```

**Copy this URL!** You'll need it for Facebook/Instagram setup.

---

## 🔧 Configure Environment Variables

### Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your project: `social-scheduler`
3. Go to: **Settings** → **Environment Variables**

### Add These Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Cloudflare R2
R2_ACCOUNT_ID=32d604c14bfbcc0ba0d35077d054d2a0
R2_ACCESS_KEY_ID=510c7f9b61244ea517eca701b837e33e
R2_SECRET_ACCESS_KEY=6ed483c5fb48d0f304d115cbdc45269ba3ad113516a01db5c982634b2e11d106
R2_BUCKET_NAME=social-scheduler
R2_PUBLIC_DOMAIN=https://pub-777c4c5194974623a5a94121ae458c7e.r2.dev

# Upstash QStash (if you have it)
QSTASH_TOKEN=your_token_here
QSTASH_CURRENT_SIGNING_KEY=sig_xxx
QSTASH_NEXT_SIGNING_KEY=sig_yyy

# Facebook/Instagram OAuth (add after setup)
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Worker URL (add after deploying worker)
NEXT_PUBLIC_WORKER_URL=
```

### Step 5: Redeploy

After adding variables:
```bash
vercel --prod
```

---

## ✅ Verify Deployment

### Test Your Live Site

1. Visit your URL: `https://social-scheduler-xyz.vercel.app`
2. Sign in
3. Click around - everything should work!

**OAuth Callback URL for Meta**:
```
https://social-scheduler-xyz.vercel.app/api/oauth/callback
```

---

## 🔄 Update Clerk URLs

### In Clerk Dashboard

1. Go to: https://dashboard.clerk.com
2. Select your app
3. Go to: **Paths**
4. Update URLs to your Vercel domain:
   ```
   Home URL: https://social-scheduler-xyz.vercel.app
   Sign-in URL: https://social-scheduler-xyz.vercel.app/sign-in
   Sign-up URL: https://social-scheduler-xyz.vercel.app/sign-up
   ```

5. Go to: **Allowed origins**
6. Add your Vercel URL:
   ```
   https://social-scheduler-xyz.vercel.app
   ```

---

## 📱 Now Ready for Facebook/Instagram Setup!

With your app deployed on Vercel with HTTPS, you can now:

1. ✅ Use the proper callback URL
2. ✅ Facebook/Instagram will accept it
3. ✅ OAuth will work correctly

**Next**: Follow the updated Facebook/Instagram setup guide below.

---

## 🐛 Troubleshooting

### Build Failed

Check:
- All environment variables are set
- No syntax errors in code
- Run `npm run build` locally first

### Site Loads but Features Don't Work

- Check environment variables in Vercel
- Make sure they're in **Production** environment
- Redeploy after adding variables

### OAuth Still Not Working

- Verify callback URL matches exactly
- Check Clerk allowed origins
- Clear browser cache

---

**Once deployed, continue to Facebook/Instagram setup!**
