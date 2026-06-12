import { createRoute } from 'honox/factory'
import { Webhook } from 'svix'
import { createClient } from '@supabase/supabase-js'

export const POST = createRoute(async (c) => {
  const payload = await c.req.text()
  
  const headerPayload = {
    "svix-id": c.req.header("webhook-id") || c.req.header("svix-id"),
    "svix-timestamp": c.req.header("webhook-timestamp") || c.req.header("svix-timestamp"),
    "svix-signature": c.req.header("webhook-signature") || c.req.header("svix-signature"),
  }

  let event;
  try {
    const wh = new Webhook(c.env.POLAR_WEBHOOK_SECRET)
    // @ts-ignore - header values might be undefined, but verify handles it or throws
    event = wh.verify(payload, headerPayload) as any
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message)
    return c.text("Invalid signature", 400)
  }

  try {
    if (event.type === 'subscription.created' || event.type === 'subscription.updated' || event.type === 'subscription.canceled') {
      const subscription = event.data
      const userId = subscription.metadata?.user_id

      if (!userId) {
        console.error("No user_id found in subscription metadata")
        return c.text("No user_id", 200)
      }

      const isPro = subscription.status === 'active'

      const supabase = createClient(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build'
      )

      const { error } = await supabase
        .from('profiles')
        .update({ is_pro: isPro, polar_subscription_id: subscription.id })
        .eq('id', userId)

      if (error) {
        console.error("Error updating profile in Supabase:", error)
      } else {
        console.log(`Successfully updated user ${userId} to is_pro: ${isPro}`)
      }
    }
  } catch (e) {
    console.error("Error processing webhook:", e)
  }

  return c.text("OK", 200)
})
