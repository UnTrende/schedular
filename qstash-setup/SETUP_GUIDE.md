# Upstash QStash Setup Guide

## Overview

Upstash QStash is a serverless messaging service that handles scheduling posts for future publishing. It's the perfect solution for our zero-budget architecture.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Upstash Account

1. **Go to**: https://console.upstash.com/
2. **Click**: "Sign Up" or "Login with GitHub" (recommended)
3. **Verify** your email if needed

### Step 2: Access QStash

1. In Upstash console, click **"QStash"** in the sidebar
2. You'll see the QStash dashboard

### Step 3: Get API Keys

You'll see three important values:

1. **QStash Token**
   ```
   eyJxxx...xxxxx
   ```
   - Used for publishing messages
   - Copy this value

2. **Current Signing Key**
   ```
   sig_xxx...xxx
   ```
   - Used to verify webhooks
   - Copy this value

3. **Next Signing Key**
   ```
   sig_yyy...yyy
   ```
   - Backup key for rotation
   - Copy this value

### Step 4: Add to Environment Variables

Open `.env.local` and add:

```env
# Upstash QStash
QSTASH_TOKEN=eyJxxx...xxxxx
QSTASH_CURRENT_SIGNING_KEY=sig_xxx...xxx
QSTASH_NEXT_SIGNING_KEY=sig_yyy...yyy
```

### Step 5: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 6: Test

1. Go to **Create Post**
2. Fill in post details
3. Schedule for 1 minute from now
4. Click "Schedule Post"
5. Wait 1 minute
6. Check **Scheduled Posts** - status should change to "Published"

---

## 🎯 What QStash Does

### The Flow

```
1. User creates a post for future
   ↓
2. Post saved to database
   ↓
3. QStash scheduled with delay
   ↓
4. Time passes...
   ↓
5. QStash calls your webhook at scheduled time
   ↓
6. Webhook publishes post to social platform
   ↓
7. Post status updated to "Published"
```

### Benefits

- ✅ **Reliable**: Won't miss scheduled posts
- ✅ **Serverless**: No background workers needed
- ✅ **Retries**: Automatic retry on failure
- ✅ **Free**: 10k messages/month free tier
- ✅ **Easy**: Simple API

---

## 📊 Free Tier Limits

```
✓ 10,000 messages per month
✓ Unlimited delays
✓ Automatic retries
✓ 7-day message retention
✓ Webhook signing
```

**Our Usage**:
- 1 message per scheduled post
- 10k messages = 10k scheduled posts/month
- More than enough for most users!

---

## 🔒 Security Features

### Webhook Signature Verification

QStash signs all webhook calls:
1. Sends signature in headers
2. You verify it matches
3. Reject if signature invalid

**Already implemented** in our code:
```typescript
const signature = request.headers.get('upstash-signature')
verifyQStashSignature(signature, body)
```

### HTTPS Required

- Production webhooks must use HTTPS
- Local development can use HTTP
- We'll handle this in deployment

---

## 🧪 Testing QStash

### Test 1: Quick Schedule (1 Minute)

1. Create a post
2. Schedule for 1 minute from now
3. Click "Schedule Post"
4. Wait 1 minute
5. Refresh Scheduled Posts
6. Status should be "Published"

### Test 2: Future Schedule (1 Hour)

1. Create a post
2. Schedule for 1 hour from now
3. Post shows as "Pending"
4. Come back in 1 hour
5. Post should be "Published"

### Test 3: Check Logs

In terminal, you should see:
```
Publishing post abc123 to twitter...
Post published successfully
```

---

## 📝 How It Works

### When You Schedule a Post

```typescript
// 1. Post created in database
const post = await createPost({...})

// 2. Calculate delay
const delay = scheduledAt - now // in seconds

// 3. Send to QStash
await qstash.publishJSON({
  url: 'https://yourapp.com/api/webhooks/publish-post',
  body: { postId: post.id },
  delay: delay,
  retries: 3,
})
```

### When It's Time to Publish

```typescript
// QStash calls your webhook
POST /api/webhooks/publish-post
{
  "postId": "abc123"
}

// Your webhook:
1. Verifies signature
2. Gets post from database
3. Publishes to social platform
4. Updates post status
5. Returns success
```

---

## 🐛 Troubleshooting

### "Missing QSTASH_TOKEN" Error

**Problem**: Environment variable not set

**Solution**:
1. Check `.env.local` has `QSTASH_TOKEN=...`
2. No quotes around the value
3. Restart dev server
4. Try again

### Post Created but Not Scheduled

**Problem**: QStash credentials not working

**Solution**:
1. Verify token is correct
2. Check for typos
3. Get fresh token from console
4. Update `.env.local`
5. Restart server

### Webhook Not Being Called

**Problem**: Webhook URL not accessible

**Solution**:

For local development:
1. Use ngrok or similar tunnel:
   ```bash
   ngrok http 3000
   ```
2. Update webhook URL in code temporarily
3. For production, use your actual domain

**Better**: Just deploy to Vercel (Part 10), webhooks work automatically

### "Invalid signature" Error

**Problem**: Signature verification failing

**Solution**:
1. Check `QSTASH_CURRENT_SIGNING_KEY` is correct
2. Check `QSTASH_NEXT_SIGNING_KEY` is correct
3. Don't modify webhook body
4. Use raw body for verification

---

## 🔄 Message Lifecycle

### States

1. **Scheduled**: Message queued with delay
2. **Pending**: Delay elapsed, about to send
3. **Delivered**: Successfully sent to webhook
4. **Failed**: All retries exhausted

### Retries

Default behavior:
- Retry 3 times on failure
- Exponential backoff
- 1 min, 5 min, 15 min delays

You can configure:
```typescript
await qstash.publishJSON({
  // ...
  retries: 5, // Custom retry count
})
```

---

## 📈 Monitoring

### In QStash Console

1. Go to **Messages** tab
2. See all scheduled messages
3. View status of each
4. Check delivery logs
5. See error messages

### In Your App

Check post status:
- **Pending**: Scheduled, waiting
- **Published**: Successfully posted
- **Failed**: Error occurred

---

## 💰 Cost Optimization

### Free Tier Strategy

```
10,000 messages/month = 330 posts/day
```

To stay in free tier:
- ✅ Monitor usage in console
- ✅ Set up alerts at 80% usage
- ✅ Archive old messages

### If You Exceed

Pricing is very affordable:
- $1 per 100,000 messages
- That's $0.00001 per message
- Even 100k messages = only $1

---

## 🚀 Production Considerations

### 1. Webhook URL

Development:
```
http://localhost:3000/api/webhooks/publish-post
```

Production:
```
https://yourdomain.com/api/webhooks/publish-post
```

### 2. HTTPS Required

- Vercel automatically provides HTTPS
- Other hosts: Configure SSL certificate
- No HTTP in production

### 3. Signature Verification

Current implementation is basic. For production:

```typescript
import { Receiver } from '@upstash/qstash'

const receiver = new Receiver({
  currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
})

const isValid = await receiver.verify({
  signature,
  body,
  url,
})
```

### 4. Error Handling

Already implemented:
- ✅ Retries on failure
- ✅ Status updates
- ✅ Error messages saved

---

## 📋 Setup Checklist

- [ ] Created Upstash account
- [ ] Accessed QStash dashboard
- [ ] Copied QStash Token
- [ ] Copied Current Signing Key
- [ ] Copied Next Signing Key
- [ ] Added to `.env.local`
- [ ] Restarted dev server
- [ ] Tested scheduling a post
- [ ] Post published successfully

---

## ✅ What Works Now

With QStash configured:

1. ✅ Schedule posts for any future time
2. ✅ Automatic publishing at scheduled time
3. ✅ Retry on failure
4. ✅ Status tracking
5. ✅ Error handling
6. ✅ Up to 10k posts/month free

---

## 🎯 Without QStash

The app still works without QStash:
- Posts are created
- Shown in Scheduled Posts
- Status stays "Pending"
- Manual publishing would be needed

**With QStash**:
- Everything automatic
- Scheduled publishing works
- Production-ready

---

## 📚 Additional Resources

- **QStash Docs**: https://docs.upstash.com/qstash
- **Console**: https://console.upstash.com/qstash
- **Pricing**: https://upstash.com/pricing
- **API Reference**: https://docs.upstash.com/qstash/api/messages

---

## 🎉 You're Ready!

Once you:
1. Add credentials to `.env.local`
2. Restart server
3. Test a scheduled post

Your post scheduling system is **fully operational**! 🚀

---

**Next**: Part 10 (Final) - Implement actual publishing to social platforms with Fly.io worker.
