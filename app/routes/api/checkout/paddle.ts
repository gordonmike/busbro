import { createRoute } from 'honox/factory'
import { Paddle, Environment } from '@paddle/paddle-node-sdk'
import { getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

export const GET = createRoute(async (c) => {
  // 1. Get logged-in user from Supabase cookies
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  })
  
  const accessToken = getCookie(c, 'sb-access-token')
  const refreshToken = getCookie(c, 'sb-refresh-token')

  if (!accessToken || !refreshToken) {
    return c.redirect('/login?error=You must log in to upgrade')
  }

  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return c.redirect('/login?error=You must log in to upgrade')
  }

  // 2. Initialize Paddle SDK
  // We MUST use a real API Key here, not a Webhook Secret.
  const paddleApiKey = c.env.PADDLE_API_KEY
  if (!paddleApiKey) {
    return c.text('PADDLE_API_KEY environment variable is missing', 500)
  }

  const paddle = new Paddle(paddleApiKey, {
    environment: Environment.sandbox 
  })

  // 3. Create a dynamic transaction for this specific user
  try {
    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId: 'pri_01ktzbk6mx44yn8ad5tb8nrf1d', // Your specific Price ID
          quantity: 1
        }
      ],
      // THIS is where the magic happens! We securely inject your user_id into the transaction.
      // Paddle will store this permanently and send it back to your webhook when they pay.
      customData: {
        user_id: user.id
      }
    })

    // 4. Redirect the user to their unique, secure checkout URL!
    if (transaction.checkout && transaction.checkout.url) {
      return c.redirect(transaction.checkout.url)
    } else {
      throw new Error('No checkout URL returned from Paddle')
    }
  } catch (error) {
    console.error("Paddle Transaction Error:", error)
    return c.text('Error creating checkout session', 500)
  }
})
