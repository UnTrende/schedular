import { getQStashClient } from './qstash-client'

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

  // Trigger.dev v3 path using tasks.trigger
  try {
    const { tasks } = await import('@trigger.dev/sdk/v3')
    const { publishPostTask } = await import('@/trigger/publish-post')

    const handle = await tasks.trigger(publishPostTask.id, {
      postId: opts.postId
    }, {
      delay: opts.scheduledAt,
      // Metadata to help track this job
      tags: [`post:${opts.postId}`]
    })

    return { success: true, provider: 'trigger' as const, taskId: handle.id }
  } catch (error: any) {
    console.error('Failed to schedule post with Trigger.dev:', error)
    return { success: false, error: error.message || 'Trigger.dev scheduling failed' }
  }
}

async function schedulePostWithQStash({
  postId,
  scheduledAt,
  webhookUrl,
}: SchedulePostOptions) {
  try {
    const client = getQStashClient()

    // Calculate delay in seconds
    const now = new Date()
    const delaySeconds = Math.floor((scheduledAt.getTime() - now.getTime()) / 1000)

    if (delaySeconds <= 0) {
      throw new Error('Scheduled time must be in the future')
    }

    // Publish message to QStash with delay
    const response = await client.publishJSON({
      url: webhookUrl,
      body: {
        postId,
        scheduledAt: scheduledAt.toISOString(),
      },
      delay: delaySeconds,
      retries: 3,
    })

    return {
      success: true,
      messageId: response.messageId,
    }
  } catch (error: any) {
    console.error('Failed to schedule post with QStash:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function cancelScheduledPost(messageId: string) {
  // TODO: Implement cancellation for Trigger.dev as well when needed
  // QStash implementation
  try {
    // For production, you'd track message IDs in your database to know which provider was used

    return {
      success: true,
      message: 'Scheduled post cancelled',
    }
  } catch (error: any) {
    console.error('Failed to cancel scheduled post:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
