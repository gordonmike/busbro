import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import { createClient } from '@supabase/supabase-js'

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'sb-access-token')
  const refreshToken = getCookie(c, 'sb-refresh-token')

  if (!token || !refreshToken) {
    c.set('user', null)
    return await next()
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const { data: { user } } = await supabase.auth.getUser(token)

  if (user) {
    // Optionally fetch profile for is_pro status
    const { data: profile } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single()
    c.set('user', { id: user.id, email: user.email!, is_pro: profile?.is_pro || false })
  } else {
    c.set('user', null)
  }

  await next()
})

export default [authMiddleware]
