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

  // Trigger.dev v4 path using tasks.trigger
  try {
    const { tasks } = await import('@trigger.dev/sdk')
    const { publishPostTask } = await import('@/trigger/publish-post')
    
    const handle = await tasks.trigger(publishPostTask.id, {
      postId: opts.postId
    }, {
      delay: opts.scheduledAt
    })
    
    return { success: true, provider: 'trigger' as const, taskId: handle.id }
  } catch (error: any) {
    console.error('Failed to schedule post with Trigger.dev:', error)
    return { success: false, error: error.message || 'Trigger.dev scheduling failed' }
  }
}
