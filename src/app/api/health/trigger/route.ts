import { NextResponse } from 'next/server'

export async function GET() {
  const projectId = process.env.TRIGGER_PROJECT_ID
  const apiKey = process.env.TRIGGER_API_KEY || process.env.TRIGGER_SECRET_KEY
  const provider = process.env.SCHEDULER_PROVIDER

  return NextResponse.json({
    provider,
    trigger: {
      projectId: projectId || null,
      apiKeyPreview: apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : null,
      keySource: process.env.TRIGGER_API_KEY ? 'TRIGGER_API_KEY' : (process.env.TRIGGER_SECRET_KEY ? 'TRIGGER_SECRET_KEY' : null),
    },
  })
}
