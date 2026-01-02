import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "social-scheduler",
  runtime: "node",
  logLevel: "log",
  // Set the maxDuration to 300 seconds (5 minutes)
  maxDuration: 300, 
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["src/trigger"],
});
