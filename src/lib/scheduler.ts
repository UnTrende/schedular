import { schedulePostWithQStash } from './schedule-post'

export interface SchedulePostOptions {
  postId: string
  scheduledAt: Date
  webhookUrl: string
}

export type SchedulerProvider = 'qstash' | 'trigger'

function getProvider(): SchedulerProvider {
  const p = (process.env.SCHEDULER_PROVIDER || 'qstash').toLowerCase()
  return (p === 'trigger' ? 'trigger' : 'qstash') as SchedulerProvider
}

export async function schedulePost(opts: SchedulePostOptions) {
  const provider = getProvider()

  if (provider === 'qstash') {
    return schedulePostWithQStash(opts)
  }

  // Trigger.dev path using SDK client if configured
  try {
    const { client } = await import('./trigger')
    await client.sendEvent({
      name: 'publish_post',
      payload: { postId: opts.postId },
      deliverAt: opts.scheduledAt,
    })
    return { success: true, provider: 'trigger' as const }
  } catch (sdkErr: any) {
    // Fallback to HTTP Events API if SDK is not configured in this environment
    const apiKey = process.env.TRIGGER_API_KEY
    const triggerEndpoint = process.env.TRIGGER_API_URL || 'https://api.trigger.dev/v3/events'

    if (!apiKey) {
      return { success: false, error: 'Trigger.dev not configured: missing TRIGGER_API_KEY' }
    }

    try {
      const res = await fetch(triggerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: 'publish_post',
          deliverAt: opts.scheduledAt.toISOString(),
          payload: { postId: opts.postId },
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Trigger.dev API error: ${res.status} ${text}`)
      }

      return { success: true, provider: 'trigger' as const }
    } catch (error: any) {
      console.error('Failed to schedule post with Trigger.dev:', error)
      return { success: false, error: error.message || 'Trigger.dev scheduling failed' }
    }
  }
}
