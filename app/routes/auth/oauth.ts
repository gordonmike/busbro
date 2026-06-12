import { createRoute } from 'honox/factory'
import { createClient } from '@supabase/supabase-js'

import { setCookie, getCookie, deleteCookie } from 'hono/cookie'

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody()
  const provider = body.provider as any

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: {
      flowType: 'pkce',
      storage: {
        getItem: (key) => getCookie(c, key) || null,
        setItem: (key, value) => setCookie(c, key, value, { path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }),
        removeItem: (key) => deleteCookie(c, key, { path: '/' })
      }
    }
  })

  // get the base URL for the callback
  const url = new URL(c.req.url)
  const redirectTo = `${url.protocol}//${url.host}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    }
  })

  if (data?.url) {
    return c.redirect(data.url)
  }

  return c.redirect('/login?error=OAuthFailed')
})
