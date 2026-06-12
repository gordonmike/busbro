import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  const errorMessage = c.req.query('error')

  return c.render(
    <div class="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients (matching landing page aesthetic) */}
      <div class="absolute inset-0 pointer-events-none -z-10">
        <div class="absolute -top-1/4 -left-1/4 w-[150%] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-[100px] opacity-60"></div>
        <div class="absolute bottom-1/4 -right-1/4 w-[150%] h-[500px] bg-gradient-to-tl from-blue-500/20 to-teal-400/20 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div class="relative z-10 w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Welcome to Cluebus
          </h1>
          <p class="text-gray-400 mt-2 font-light">Sign in or create an account</p>
        </div>

        {errorMessage && (
          <div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form class="space-y-5" method="POST">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2 ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2 ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            />
          </div>

          <div class="flex flex-col space-y-3 pt-4">
            <button
              formaction="/auth/login"
              class="w-full py-3.5 px-4 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Sign In
            </button>
            <button
              formaction="/auth/signup"
              class="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all"
            >
              Create Account
            </button>
          </div>
        </form>

        <div class="mt-8 flex items-center justify-between">
          <span class="w-1/5 border-b border-gray-700 lg:w-1/4"></span>
          <p class="text-xs text-center text-gray-500 uppercase">or sign in with</p>
          <span class="w-1/5 border-b border-gray-700 lg:w-1/4"></span>
        </div>

        <form method="POST" action="/auth/oauth" class="mt-6 flex gap-4">
          <input type="hidden" name="provider" value="google" />
          <button class="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm font-medium">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </form>
      </div>
    </div>
  )
})
