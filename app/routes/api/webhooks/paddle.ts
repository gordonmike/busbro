import { createRoute } from 'honox/factory'
import { createClient } from '@supabase/supabase-js'

async function verifyPaddleSignature(signatureHeader: string, payload: string, secret: string) {
  const parts = signatureHeader.split(';');
  let ts = '';
  let h1 = '';
  for (const part of parts) {
    if (part.startsWith('ts=')) ts = part.substring(3);
    if (part.startsWith('h1=')) h1 = part.substring(3);
  }

  if (!ts || !h1) return false;

  const signedPayload = `${ts}:${payload}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signedPayload)
  );

  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return h1 === signatureHex;
}

export const POST = createRoute(async (c) => {
  const payload = await c.req.text()
  const signature = c.req.header('Paddle-Signature')

  if (!signature || !c.env.PADDLE_WEBHOOK_SECRET) {
    console.error("Missing signature or webhook secret")
    return c.text("Unauthorized", 401)
  }

  const isValid = await verifyPaddleSignature(signature, payload, c.env.PADDLE_WEBHOOK_SECRET)
  
  if (!isValid) {
    console.error("Paddle webhook signature verification failed")
    return c.text("Invalid signature", 400)
  }

  let event;
  try {
    event = JSON.parse(payload)
  } catch (e) {
    return c.text("Invalid JSON", 400)
  }

  try {
    // Listen for successful transactions or subscriptions
    if (event.event_type === 'transaction.completed' || event.event_type === 'subscription.created' || event.event_type === 'subscription.updated') {
      const data = event.data
      const customData = data.custom_data
      const userId = customData?.user_id

      if (!userId) {
        console.error("No user_id found in custom_data")
        return c.text("No user_id", 200)
      }

      // If it's a transaction, we assume they paid successfully
      // If it's a subscription, we check if it's active
      const isPro = event.event_type === 'transaction.completed' ? true : data.status === 'active'

      const supabase = createClient(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build'
      )

      const { error } = await supabase
        .from('profiles')
        .update({ is_pro: isPro, paddle_subscription_id: data.subscription_id || data.id })
        .eq('id', userId)

      if (error) {
        console.error("Error updating profile in Supabase:", error)
      } else {
        console.log(`Successfully updated user ${userId} to is_pro: ${isPro} via Paddle`)
      }
    }
  } catch (e) {
    console.error("Error processing Paddle webhook:", e)
  }

  return c.text("OK", 200)
})
