import { createRoute } from 'honox/factory'
import { createClient } from '@supabase/supabase-js'
import { setCookie } from 'hono/cookie'

import { getCookie, deleteCookie } from 'hono/cookie'

export const GET = createRoute(async (c) => {
  const url = new URL(c.req.url)
  const code = url.searchParams.get('code')

  if (code) {
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
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      setCookie(c, 'sb-access-token', data.session.access_token, { path: '/', secure: true, httpOnly: true, sameSite: 'Lax' })
      setCookie(c, 'sb-refresh-token', data.session.refresh_token, { path: '/', secure: true, httpOnly: true, sameSite: 'Lax' })
    }
  }

  return c.redirect('/')
})
