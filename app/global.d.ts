import {} from 'hono'

declare module 'hono' {
  interface Env {
    Variables: {
      user: { id: string; email: string; is_pro: boolean } | null
    }
    Bindings: {
      SUPABASE_URL: string
      SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY: string
      POLAR_WEBHOOK_SECRET: string
      NEXT_PUBLIC_POLAR_CHECKOUT_LINK: string
      PADDLE_CLIENT_TOKEN: string
      PADDLE_PRICE_ID: string
      PADDLE_WEBHOOK_SECRET: string
    }
  }
}
