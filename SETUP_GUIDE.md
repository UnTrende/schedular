# Setup Guide - Social Scheduler

## ✅ Part 1: Project Setup & Foundation (COMPLETED)

### What We've Built

1. **Next.js 14 Project Structure**
   - App Router architecture
   - TypeScript configuration
   - Tailwind CSS with custom theme
   - ESLint setup

2. **Dependencies Installed**
   - `@clerk/nextjs` - Authentication
   - `@supabase/supabase-js` - Database client
   - `@upstash/qstash` - Job scheduling
   - `@uppy/core`, `@uppy/dashboard`, `@uppy/aws-s3-multipart` - File uploads
   - `dayjs` - Date manipulation
   - `zod` - Schema validation
   - `clsx`, `tailwind-merge` - Utility classes

3. **Core Files Created**
   - `/src/app/layout.tsx` - Root layout with font setup
   - `/src/app/globals.css` - Global styles with custom components
   - `/src/app/page.tsx` - Homepage
   - `/src/types/index.ts` - TypeScript type definitions
   - `/src/lib/constants.ts` - Platform configs and limits
   - `/src/lib/utils.ts` - Utility functions
   - `/src/hooks/use-toast.ts` - Toast notification hook
   - `/src/components/loading-spinner.tsx` - Loading component
   - `/src/middleware.ts` - Middleware placeholder

4. **Configuration Files**
   - `tailwind.config.ts` - Custom theme with dark mode
   - `tsconfig.json` - TypeScript settings
   - `next.config.js` - Next.js configuration
   - `.env.local.example` - Environment variables template
   - `.gitignore` - Git exclusions
   - `README.md` - Project documentation

### Project Structure

```
social-scheduler/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── loading-spinner.tsx # Loading component
│   ├── lib/
│   │   ├── constants.ts        # App constants
│   │   └── utils.ts            # Utility functions
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── hooks/
│   │   └── use-toast.ts        # Toast hook
│   └── middleware.ts           # Next.js middleware
├── public/
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.json
├── .env.local.example
├── .gitignore
└── README.md
```

### Running the Project

```bash
# Development
cd social-scheduler
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

The app is now running at **http://localhost:3000** ✨

### Next Steps (Part 2)

In the next part, we'll integrate Clerk authentication:
- Setup Clerk provider
- Create authentication middleware
- Add protected routes
- Configure sign-in/sign-up redirects

---

## Environment Variables Needed

Before proceeding to Part 2, you'll need to create accounts and get API keys for:

1. **Clerk** (https://clerk.com/dashboard)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

2. **Supabase** (https://supabase.com/dashboard)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Upstash QStash** (https://console.upstash.com/qstash)
   - `QSTASH_TOKEN`
   - `QSTASH_CURRENT_SIGNING_KEY`
   - `QSTASH_NEXT_SIGNING_KEY`

4. **Cloudflare R2** (https://dash.cloudflare.com/r2)
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_DOMAIN`

5. **Fly.io** (https://fly.io/dashboard)
   - `NEXT_PUBLIC_WORKER_URL`

Copy `.env.local.example` to `.env.local` and fill in these values as we progress through each part.
