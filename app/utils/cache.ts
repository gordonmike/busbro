import { Redis } from '@upstash/redis/cloudflare'
import type { Env } from 'hono'

// Helper to create an Upstash Redis client using Cloudflare Env bindings
export const createRedisClient = (env: Env['Bindings']) => {
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
}
