import { createRoute } from 'honox/factory'
import { deleteCookie } from 'hono/cookie'

export const POST = createRoute(async (c) => {
  deleteCookie(c, 'sb-access-token', { path: '/' })
  deleteCookie(c, 'sb-refresh-token', { path: '/' })
  return c.redirect('/login')
})
