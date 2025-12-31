# Social Scheduler

A zero-budget social media scheduling application built with Next.js 14, designed to run entirely on free-tier services.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Authentication**: Clerk (10k MAU free tier)
- **Database**: Supabase (500MB DB, 1GB storage free tier)
- **File Storage**: Cloudflare R2 (10GB storage + 1M operations/month free)
- **Job Scheduling**: Upstash QStash (10k messages/month free)
- **Worker Service**: Fly.io ($5/mo credit for 200k API calls)
- **Deployment**: Vercel (100GB bandwidth/month free)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Accounts created on the following services (all free tier):
  - [Vercel](https://vercel.com/signup)
  - [Supabase](https://supabase.com/dashboard)
  - [Clerk](https://clerk.com/dashboard)
  - [Upstash QStash](https://console.upstash.com/qstash)
  - [Cloudflare R2](https://dash.cloudflare.com/r2)
  - [Fly.io](https://fly.io/dashboard)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in the required API keys in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
social-scheduler/
├── src/
│   ├── app/              # Next.js 14 App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   ├── types/           # TypeScript type definitions
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── ...config files
```

## 🔧 Configuration

### Database Setup (Supabase)

1. Go to your Supabase project SQL Editor
2. Run the schema from `Social_Scheduler_Tech_Spec.md`
3. Enable Row Level Security (RLS)
4. Copy your project URL and anon key to `.env.local`

### Authentication (Clerk)

1. Create a new Clerk application
2. Enable email/password and social login providers
3. Copy your publishable and secret keys to `.env.local`

### File Storage (Cloudflare R2)

1. Create an R2 bucket named `social-scheduler`
2. Generate API tokens
3. Setup public access for the bucket
4. Add credentials to `.env.local`

## 🚦 Development Roadmap

- [x] Part 1: Project Setup & Foundation
- [ ] Part 2: Authentication Setup
- [ ] Part 3: Database Setup
- [ ] Part 4: Core Layout & Components
- [ ] Part 5: Authentication Pages
- [ ] Part 6: Dashboard & Post Creation
- [ ] Part 7: File Upload & R2 Integration
- [ ] Part 8: Social Connections Management
- [ ] Part 9: Post Scheduling System
- [ ] Part 10: Fly.io Worker & Publishing

## 📝 License

MIT

## ⚠️ Important Notes

- **Token Security**: All social media tokens are encrypted in the browser before storage
- **Free Tier Monitoring**: Monitor your usage across all platforms to stay within limits
- **Cost Kill Switches**: Implement alerts when approaching free tier limits

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
