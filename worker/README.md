# Social Scheduler Worker Service

This is the publishing worker service that handles posting to social media platforms.

## 🚀 Quick Start (Local Development)

### Install Dependencies

```bash
cd worker
npm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### Run Locally

```bash
npm start
# Server runs on http://localhost:8080
```

### Test Endpoint

```bash
curl http://localhost:8080/health
```

---

## 📦 Deploy to Fly.io

### Step 1: Install Fly.io CLI

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Step 2: Login to Fly.io

```bash
fly auth login
```

### Step 3: Launch App

```bash
cd worker
fly launch
```

Follow prompts:
- Choose app name: `social-scheduler-worker-[your-name]`
- Choose region: Closest to you
- Would you like to set up Postgres? **No**
- Would you like to deploy? **Yes**

### Step 4: Set Environment Variables

```bash
fly secrets set WEBHOOK_SECRET=your_secure_secret
```

### Step 5: Deploy

```bash
fly deploy
```

### Step 6: Get Worker URL

```bash
fly status
# Copy the hostname, e.g., social-scheduler-worker.fly.dev
```

### Step 7: Update Main App

Add to your main app's `.env.local`:

```env
NEXT_PUBLIC_WORKER_URL=https://social-scheduler-worker-yourname.fly.dev
```

---

## 🧪 Testing

### Test Health Endpoint

```bash
curl https://your-app.fly.dev/health
```

### Test Publishing (Local)

```bash
curl -X POST http://localhost:8080/publish \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "twitter",
    "content": "Hello from Social Scheduler!",
    "accessToken": "your_test_token",
    "username": "testuser"
  }'
```

---

## 📊 Monitoring

### View Logs

```bash
fly logs
```

### Check Status

```bash
fly status
```

### Scale

```bash
# Scale up
fly scale vm shared-cpu-1x

# Scale memory
fly scale memory 512
```

---

## 💰 Pricing

Fly.io pricing:
- **Free**: $5/month credit
- **Shared CPU**: ~$2/month
- **256MB RAM**: Included

With $5 credit:
- ~200,000 API calls/month
- More than enough for most users

---

## 🔒 Security

### Environment Variables

Never commit:
- API tokens
- Secrets
- Credentials

Use `fly secrets set` for production.

### HTTPS

Fly.io provides:
- Free SSL certificates
- Automatic HTTPS
- DDoS protection

---

## 📝 API Documentation

### POST /publish

Publishes a post to a social media platform.

**Request**:
```json
{
  "platform": "twitter",
  "content": "Post content here",
  "mediaUrls": ["https://example.com/image.jpg"],
  "accessToken": "user_access_token",
  "username": "username"
}
```

**Response** (Success):
```json
{
  "success": true,
  "platform": "twitter",
  "postId": "1234567890",
  "url": "https://twitter.com/i/web/status/1234567890"
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🔄 Updating

### Deploy New Version

```bash
cd worker
fly deploy
```

### Rollback

```bash
fly releases
fly rollback [version]
```

---

## 🐛 Troubleshooting

### "App not found"

```bash
fly apps list
fly open
```

### Logs show errors

```bash
fly logs --app social-scheduler-worker
```

### Can't connect

Check:
1. App is deployed: `fly status`
2. URL is correct in `.env.local`
3. Worker is running: `fly logs`

---

## ✅ Deployment Checklist

- [ ] Fly.io CLI installed
- [ ] Logged in to Fly.io
- [ ] App launched
- [ ] Secrets configured
- [ ] Deployed successfully
- [ ] Health check passing
- [ ] Worker URL added to main app
- [ ] Main app redeployed
- [ ] Test publishing works

---

**Status**: Worker service ready for production! 🚀
