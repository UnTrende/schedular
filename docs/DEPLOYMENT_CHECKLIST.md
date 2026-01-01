# 🚀 Deployment Checklist

Use this to deploy your app to production with working Facebook/Instagram OAuth.

## Phase 1: Deploy to Vercel ✈️

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `cd social-scheduler && vercel`
- [ ] Note your URL: `https://social-scheduler-xyz.vercel.app`
- [ ] Test that site loads

## Phase 2: Add Environment Variables to Vercel 🔐

Go to: https://vercel.com/dashboard → your project → Settings → Environment Variables

- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- [ ] CLERK_SECRET_KEY
- [ ] NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- [ ] NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
- [ ] NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
- [ ] NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] R2_ACCOUNT_ID
- [ ] R2_ACCESS_KEY_ID
- [ ] R2_SECRET_ACCESS_KEY
- [ ] R2_BUCKET_NAME
- [ ] R2_PUBLIC_DOMAIN

After adding, redeploy: `vercel --prod`

## Phase 3: Update Clerk Settings 🔒

Go to: https://dashboard.clerk.com → your app

- [ ] Update Home URL to Vercel domain
- [ ] Update Sign-in URL to Vercel domain
- [ ] Update Sign-up URL to Vercel domain
- [ ] Add Vercel URL to Allowed Origins

## Phase 4: Setup Facebook/Instagram OAuth 📱

Go to: https://developers.facebook.com/apps/

- [ ] Create new app (Business type)
- [ ] Add Facebook Login product
- [ ] Add Instagram product
- [ ] Set OAuth Redirect URI: `https://your-app.vercel.app/api/oauth/callback`
- [ ] Copy App ID
- [ ] Copy App Secret

## Phase 5: Add OAuth Credentials to Vercel 🔑

Back to Vercel Dashboard → Environment Variables

- [ ] FACEBOOK_APP_ID=[your app id]
- [ ] FACEBOOK_APP_SECRET=[your app secret]
- [ ] Redeploy: `vercel --prod`

## Phase 6: Test Everything 🧪

- [ ] Visit your live site
- [ ] Sign in works
- [ ] Go to Connections page
- [ ] Click "Connect" on Facebook
- [ ] OAuth flow completes
- [ ] Facebook shows as "Connected"
- [ ] Try Instagram connection
- [ ] Instagram shows as "Connected"

## Phase 7: Optional - Deploy Worker (Advanced) 🔧

- [ ] Install Fly CLI
- [ ] `cd worker`
- [ ] `fly launch`
- [ ] `fly deploy`
- [ ] Get worker URL from `fly status`
- [ ] Add NEXT_PUBLIC_WORKER_URL to Vercel
- [ ] Redeploy main app

## Phase 8: Optional - Setup QStash ⏰

- [ ] Create Upstash account
- [ ] Get QStash credentials
- [ ] Add to Vercel environment variables:
  - QSTASH_TOKEN
  - QSTASH_CURRENT_SIGNING_KEY
  - QSTASH_NEXT_SIGNING_KEY
- [ ] Redeploy

---

## ✅ Done!

Your app is now live with working Facebook/Instagram OAuth! 🎉

**Your Production URL**: https://________.vercel.app

**Test**: Create a post and schedule it!

---

See detailed guides:
- `DEPLOY_TO_VERCEL.md`
- `oauth-setup/FACEBOOK_INSTAGRAM_PRODUCTION_SETUP.md`
