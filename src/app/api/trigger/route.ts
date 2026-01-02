import { createAppRoute } from "trigger.dev/nextjs"
import { client } from "@/lib/trigger"
import "@/jobs/publishPost"

export const { GET, POST, dynamic } = createAppRoute(client)
