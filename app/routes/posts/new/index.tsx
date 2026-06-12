import type { FC } from 'hono/jsx'
import { createRoute } from 'honox/factory'
import { useRequestContext } from 'hono/jsx-renderer'
import { createClient } from '@supabase/supabase-js'

import { getCookie } from 'hono/cookie'

export const POST = createRoute(async (c) => {
  const user = c.var.user

  if (!user) {
    return c.redirect('/login?error=Unauthorized')
  }

  const body = await c.req.parseBody()
  const title = body.title as string
  const content = body.content as string

  const token = getCookie(c, 'sb-access-token')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const { error } = await supabase
    .from('posts')
    .insert([
      { 
        title, 
        content,
        user_id: user.id
      }
    ])

  if (error) {
    console.error(error)
    return c.redirect('/posts/new?error=' + encodeURIComponent(error.message))
  }

  return c.redirect('/posts')
})

export default createRoute((c) => {
  const errorMessage = c.req.query('error')
  const user = c.var.user

  // Require authentication to view form (though they could technically view it and fail on submit, it's better to hide it)
  if (!user) {
    // In HonoX, throwing a Response redirects. Alternatively, we could just return a message
    return c.render(
      <div class="flex-1 w-full max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 class="text-3xl font-bold mb-4">Please log in</h1>
        <a href="/login" class="text-purple-400 hover:underline">Go to login</a>
      </div>
    )
  }

  return c.render(
    <div class="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
      <div class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight mb-2">Share an Idea</h1>
        <p class="text-gray-400">What's the next big thing you're working on?</p>
      </div>

      {errorMessage && (
        <div class="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {errorMessage}
        </div>
      )}

      <form method="POST" class="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        <div class="mb-6">
          <label htmlFor="title" class="block text-sm font-medium text-gray-300 mb-2">Idea Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required 
            placeholder="e.g., SaaS for AI Agents"
            class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
        </div>

        <div class="mb-8">
          <label htmlFor="content" class="block text-sm font-medium text-gray-300 mb-2">Detailed Pitch</label>
          <textarea 
            id="content" 
            name="content" 
            required 
            rows="6"
            placeholder="Explain the problem you're solving, your target audience, and your unique solution..."
            class="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-y"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-4">
          <a href="/posts" class="px-6 py-3 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </a>
          <button 
            type="submit"
            class="px-8 py-3 bg-white text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all"
          >
            Publish Idea
          </button>
        </div>
      </form>
    </div>
  )
})
