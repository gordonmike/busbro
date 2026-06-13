import { createRoute } from 'honox/factory'
import { Paddle } from '@paddle/paddle-node-sdk'
import { createClient } from '@supabase/supabase-js'

export const POST = createRoute(async (c) => {
  const signature = c.req.header('paddle-signature') || ''
  const body = await c.req.text()
  
  if (!signature) {
    return c.text('Missing signature', 400)
  }

  // Initialize Paddle SDK
  const paddle = new Paddle('dummy_key_not_needed_for_webhooks')

  let eventData;
  try {
    eventData = paddle.webhooks.unmarshal(body, c.env.PADDLE_WEBHOOK_SECRET, signature)
  } catch (e: any) {
    console.error('Paddle webhook verification failed:', e.message)
    return c.text('Invalid signature', 400)
  }

  try {
    if (
      eventData.eventType === 'subscription.created' ||
      eventData.eventType === 'subscription.updated' ||
      eventData.eventType === 'subscription.canceled'
    ) {
      const subscription = eventData.data as any
      // In Paddle, metadata is passed as customData
      const userId = subscription.customData?.user_id

      if (!userId) {
        console.error('No user_id found in Paddle subscription customData')
        return c.text('No user_id', 200)
      }

      const isPro = subscription.status === 'active' || subscription.status === 'trialing'

      const supabase = createClient(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build'
      )

      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_pro: isPro, 
          paddle_subscription_id: subscription.id 
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating profile in Supabase:', error)
      } else {
        console.log(`Successfully updated user ${userId} via Paddle to is_pro: ${isPro}`)
      }
    }
  } catch (e) {
    console.error('Error processing Paddle webhook:', e)
  }

  return c.text('OK', 200)
})
