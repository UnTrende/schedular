import { TriggerClient } from "@trigger.dev/sdk"

const projectId = process.env.TRIGGER_PROJECT_ID
const apiKey = process.env.TRIGGER_API_KEY || process.env.TRIGGER_SECRET_KEY

if (!apiKey) {
  throw new Error("Missing Trigger.dev API key. Set TRIGGER_API_KEY or TRIGGER_SECRET_KEY in env.")
}

export const client = new TriggerClient({
  id: projectId!,
  apiKey,
  baseUrl: process.env.TRIGGER_API_BASE_URL || "https://api.trigger.dev",
})
