import { createRoute } from 'honox/factory'
import { createClient } from '@supabase/supabase-js'

export default createRoute(async (c) => {
  // Cache the page in the user's browser for 15 seconds to make navigating back/forth instant.
  // We use "private" so Cloudflare's Edge doesn't cache your logged-in navbar for other people!
  c.header('Cache-Control', 'private, max-age=15, stale-while-revalidate=60')

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)

  // Fetch posts ordered by newest first
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return c.render(
    <div class="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight mb-2">Business Ideas</h1>
          <p class="text-gray-400">Discover and validate the next big thing.</p>
        </div>
        <a 
          href="/posts/new" 
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105"
        >
          Share an Idea
        </a>
      </div>

      {error && (
        <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-8">
          Error loading posts: {error.message}
        </div>
      )}

      {(!posts || posts.length === 0) && !error ? (
        <div class="text-center py-32 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
          <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border border-white/10 shadow-inner">
            🌱
          </div>
          <h2 class="text-3xl font-bold mb-4">No ideas shared yet</h2>
          <p class="text-gray-400 mb-8 max-w-md mx-auto text-lg">Be the first to share your million dollar business idea with the community.</p>
          <a 
            href="/posts/new" 
            class="px-8 py-4 bg-white text-black font-bold text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all inline-block"
          >
            Create the first post
          </a>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <div key={post.id} class="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-6 hover:bg-white/[0.04] transition-all cursor-pointer group hover:-translate-y-1.5 shadow-xl backdrop-blur-md relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 group-hover:text-white">
                ↗
              </div>
              <h3 class="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors pr-6">{post.title}</h3>
              <p class="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-4">
                {post.content}
              </p>
              
              <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between pt-4 border-t border-white/5 bg-[#0a0a0a]/95">
                <div class="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <button class="flex items-center gap-1.5 group-hover:text-pink-400 transition-colors hover:scale-110">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    {post.likes || 0}
                  </button>
                  <button class="flex items-center gap-1.5 group-hover:text-blue-400 transition-colors hover:scale-110">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    {post.comments || 0}
                  </button>
                </div>
                <span class="text-xs text-gray-600 font-mono">
                  {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
