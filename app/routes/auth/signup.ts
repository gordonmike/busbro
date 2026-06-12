import { createRoute } from 'honox/factory'
import { createClient } from '@supabase/supabase-js'
import { setCookie } from 'hono/cookie'

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody()
  const email = body.email as string
  const password = body.password as string

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  })

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.session) {
    return c.redirect('/login?error=' + encodeURIComponent(error?.message || 'Signup failed. Check your email or try logging in.'))
  }

  setCookie(c, 'sb-access-token', data.session.access_token, { path: '/', secure: true, httpOnly: true, sameSite: 'Lax' })
  setCookie(c, 'sb-refresh-token', data.session.refresh_token, { path: '/', secure: true, httpOnly: true, sameSite: 'Lax' })

  return c.redirect('/')
})
