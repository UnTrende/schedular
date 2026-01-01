# Adding Environment Variables to Vercel - Step by Step Guide

## 🎯 Your Mission
Add environment variables to make your deployed app work properly.

---

## 📍 Step 1: Open Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Login if needed
3. You should see your project listed (probably called "schedular" or "social-scheduler")
4. **Click on your project name**

---

## 📍 Step 2: Navigate to Environment Variables

Once inside your project:

1. Look at the top navigation tabs: Overview, Deployments, Analytics, **Settings**, etc.
2. **Click on "Settings"** tab
3. On the left sidebar, you'll see options like General, Domains, **Environment Variables**, etc.
4. **Click on "Environment Variables"**

---

## 📍 Step 3: Add Variables One by One

You'll see a page with an "Add New" button or similar. For EACH variable below:

### How to Add Each Variable:

1. Click **"Add New"** or **"Add"** button
2. A form will appear with fields:
   - **Key/Name**: Enter the variable name (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
   - **Value**: Enter the actual value (see below for values)
   - **Environments**: Check all three boxes: ✅ Production ✅ Preview ✅ Development
3. Click **"Save"** or **"Add"**
4. Repeat for each variable

---

## 🔑 Variables to Add

### GROUP 1: Clerk Authentication (6 variables) ⚠️ CRITICAL

**Variable 1:**
```
Key:   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_Z3VpZGluZy1tdXN0YW5nLTIxLmNsZXJrLmFjY291bnRzLmRldiQ
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Key:   CLERK_SECRET_KEY
Value: [YOU NEED TO PROVIDE THIS - starts with sk_test_...]
Environments: ✅ Production ✅ Preview ✅ Development
```
⚠️ **IMPORTANT**: You need to get this from your Clerk dashboard at https://dashboard.clerk.com

**Variable 3:**
```
Key:   NEXT_PUBLIC_CLERK_SIGN_IN_URL
Value: /sign-in
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 4:**
```
Key:   NEXT_PUBLIC_CLERK_SIGN_UP_URL
Value: /sign-up
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 5:**
```
Key:   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
Value: /dashboard
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 6:**
```
Key:   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
Value: /dashboard
Environments: ✅ Production ✅ Preview ✅ Development
```

---

### GROUP 2: Supabase Database (3 variables) ⚠️ REQUIRED

**Variable 7:**
```
Key:   NEXT_PUBLIC_SUPABASE_URL
Value: [YOU NEED TO PROVIDE THIS - looks like https://xxxxx.supabase.co]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 8:**
```
Key:   NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [YOU NEED TO PROVIDE THIS - long JWT token starting with eyJhbG...]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 9:**
```
Key:   SUPABASE_SERVICE_ROLE_KEY
Value: [YOU NEED TO PROVIDE THIS - long JWT token starting with eyJhbG...]
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **Get these from**: https://supabase.com/dashboard → Your Project → Settings → API

---

### GROUP 3: Cloudflare R2 Storage (5 variables) - Optional but recommended

**Variable 10:**
```
Key:   R2_ACCOUNT_ID
Value: 32d604c14bfbcc0ba0d35077d054d2a0
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 11:**
```
Key:   R2_ACCESS_KEY_ID
Value: 510c7f9b61244ea517eca701b837e33e
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 12:**
```
Key:   R2_SECRET_ACCESS_KEY
Value: 6ed483c5fb48d0f304d115cbdc45269ba3ad113516a01db5c982634b2e11d106
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 13:**
```
Key:   R2_BUCKET_NAME
Value: social-scheduler
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 14:**
```
Key:   R2_PUBLIC_DOMAIN
Value: https://pub-777c4c5194974623a5a94121ae458c7e.r2.dev
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 📍 Step 4: Redeploy Your App

After adding all variables:

1. Click on **"Deployments"** tab (top navigation)
2. Find your latest deployment (the one at the top)
3. Click the **three dots "..."** button on the right side
4. Click **"Redeploy"**
5. Wait 2-3 minutes for the deployment to complete
6. You'll see "Ready" when it's done

---

## ✅ Step 5: Test Your Site

1. Go to your live URL (something like `https://schedular-xyz.vercel.app`)
2. Try to sign in
3. Everything should work now! 🎉

---

## ⚠️ Missing Values Checklist

Before you start, make sure you have these ready:

- [ ] **CLERK_SECRET_KEY** - Get from https://dashboard.clerk.com → Your App → API Keys
- [ ] **NEXT_PUBLIC_SUPABASE_URL** - Get from Supabase dashboard
- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Get from Supabase dashboard
- [ ] **SUPABASE_SERVICE_ROLE_KEY** - Get from Supabase dashboard

---

## 🆘 Need Help Getting These Values?

### For Clerk Secret Key:
1. Go to https://dashboard.clerk.com
2. Select your app
3. Go to "API Keys" in sidebar
4. Copy the "Secret Key" (starts with `sk_test_`)

### For Supabase Values:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL (for `NEXT_PUBLIC_SUPABASE_URL`)
   - anon/public key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - service_role key (for `SUPABASE_SERVICE_ROLE_KEY`) - Click "Reveal" first

---

## 🎯 Priority Order

If you want to add them gradually:

**Phase 1 (Add these first to make site load):**
- All 6 Clerk variables

**Phase 2 (Add these to make database work):**
- All 3 Supabase variables

**Phase 3 (Add these for file uploads):**
- All 5 R2 variables

---

**After adding variables and redeploying, your app should work perfectly!** 🚀
