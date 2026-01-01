# Vercel Environment Variables Setup

## 🚨 White Screen / 500 Error Fix

The white screen happens because **Clerk environment variables are missing** in Vercel.

---

## 🔧 Quick Fix (5 Minutes)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your project: **schedular**
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add Clerk Variables (REQUIRED)

These are **critical** - app won't work without them:

**Variable 1**:
```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_Z3VpZGluZy1tdXN0YW5nLTIxLmNsZXJrLmFjY291bnRzLmRldiQ
Environment: Production, Preview, Development
```

**Variable 2**:
```
Name: CLERK_SECRET_KEY
Value: [Your Clerk secret key - starts with sk_test_...]
Environment: Production, Preview, Development
```

**Variable 3-6** (URLs):
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
Environment: Production, Preview, Development (all three)
```

### Step 3: Add Other Variables (Optional but Recommended)

**Supabase** (for data persistence):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Cloudflare R2** (for file uploads):
```
R2_ACCOUNT_ID=32d604c14bfbcc0ba0d35077d054d2a0
R2_ACCESS_KEY_ID=510c7f9b61244ea517eca701b837e33e
R2_SECRET_ACCESS_KEY=6ed483c5fb48d0f304d115cbdc45269ba3ad113516a01db5c982634b2e11d106
R2_BUCKET_NAME=social-scheduler
R2_PUBLIC_DOMAIN=https://pub-777c4c5194974623a5a94121ae458c7e.r2.dev
```

### Step 4: Redeploy

After adding variables:
1. Go to: **Deployments** tab
2. Click: **"..."** on latest deployment
3. Click: **"Redeploy"**
4. Wait 2-3 minutes
5. Site should work! ✅

---

## 🎯 Priority: Add Clerk Keys First

**Minimum to make site work**:
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. `CLERK_SECRET_KEY`

Add these two and redeploy - your site will load!

---

## 📋 All Environment Variables

Here's the complete list for copy-paste convenience:

### Required (Clerk)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3VpZGluZy1tdXN0YW5nLTIxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=[your_clerk_secret_key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Optional (Add as needed)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

R2_ACCOUNT_ID=32d604c14bfbcc0ba0d35077d054d2a0
R2_ACCESS_KEY_ID=510c7f9b61244ea517eca701b837e33e
R2_SECRET_ACCESS_KEY=6ed483c5fb48d0f304d115cbdc45269ba3ad113516a01db5c982634b2e11d106
R2_BUCKET_NAME=social-scheduler
R2_PUBLIC_DOMAIN=https://pub-777c4c5194974623a5a94121ae458c7e.r2.dev

QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

---

## 🚀 Quick Action Plan

1. **Add Clerk keys** to Vercel (2 minutes)
2. **Redeploy** (2 minutes)
3. **Test site** - Should load! ✅
4. **Add other vars** as needed
5. **Setup Facebook OAuth** with HTTPS URL

---

**I've also pushed a middleware fix** that will handle missing Clerk config more gracefully.

**Next step**: Add Clerk environment variables in Vercel dashboard, then redeploy! 🎯