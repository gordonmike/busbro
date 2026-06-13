import type { FC } from 'hono/jsx'

export const Navbar: FC<{ user?: { email: string; is_pro?: boolean } }> = ({ user }) => {
  return (
    <nav class="w-full flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
      <a href="/" class="text-xl font-bold tracking-tighter flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <span class="text-white text-lg leading-none">B</span>
        </div>
        <span>Business<span class="text-purple-400">Ideas</span></span>
        {user?.is_pro && (
          <span class="ml-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-md shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            PRO
          </span>
        )}
      </a>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="/posts" class="hover:text-white transition-colors">Explore Posts</a>
        <a href="/pricing" class="hover:text-white transition-colors">Pricing & Premium</a>
        <div class="flex items-center gap-3 ml-4">
          {user ? (
            <form action="/auth/logout" method="POST">
              <button class="px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">Sign Out ({user.email})</button>
            </form>
          ) : (
            <a href="/login" class="px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">Sign In</a>
          )}
          <a href="/posts" class="px-5 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">Get Started</a>
        </div>
      </div>
    </nav>
  )
}
