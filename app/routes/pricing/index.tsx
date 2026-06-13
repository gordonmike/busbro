import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  const user = c.var.user

  const isPro = user?.is_pro || false

  const polarCheckoutUrl = user && c.env.NEXT_PUBLIC_POLAR_CHECKOUT_LINK
    ? `${c.env.NEXT_PUBLIC_POLAR_CHECKOUT_LINK}?metadata[user_id]=${user.id}&customer_email=${encodeURIComponent(user.email)}`
    : '/login?error=You must log in to upgrade'
    
  const paddleCheckoutUrl = user
    ? `/api/checkout/paddle`
    : '/login?error=You must log in to upgrade'

  return c.render(
    <div class="flex-1 w-full max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 class="text-5xl font-extrabold tracking-tight mb-6">Simple, transparent pricing</h1>
      <p class="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
        Join our community of makers. Upgrade to Pro for exclusive insights, unlimited ideas, and verified feedback.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Tier */}
        <div class="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-left backdrop-blur-md">
          <h3 class="text-2xl font-bold mb-2">Hobby</h3>
          <p class="text-gray-400 mb-6">Perfect for just getting started.</p>
          <div class="text-4xl font-bold mb-8">$0<span class="text-lg text-gray-500 font-normal">/mo</span></div>
          
          <ul class="space-y-4 mb-8 text-gray-300">
            <li class="flex items-center gap-3"><span class="text-green-500">✓</span> Read all ideas</li>
            <li class="flex items-center gap-3"><span class="text-green-500">✓</span> Post 1 idea per month</li>
            <li class="flex items-center gap-3"><span class="text-green-500">✓</span> Standard community support</li>
          </ul>

          <a href="/posts" class="block w-full py-4 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-all">
            Get Started
          </a>
        </div>

        {/* Pro Tier */}
        <div class="rounded-3xl border border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent p-8 text-left relative shadow-[0_0_50px_rgba(168,85,247,0.15)]">
          <div class="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </div>
          <h3 class="text-2xl font-bold mb-2 text-white">Pro Plan</h3>
          <p class="text-purple-200/70 mb-6">For serious makers and founders.</p>
          <div class="text-4xl font-bold mb-8 text-white">$10<span class="text-lg text-purple-200/50 font-normal">/mo</span></div>
          
          <ul class="space-y-4 mb-8 text-gray-200">
            <li class="flex items-center gap-3"><span class="text-purple-400">✓</span> Everything in Hobby</li>
            <li class="flex items-center gap-3"><span class="text-purple-400">✓</span> Post unlimited ideas</li>
            <li class="flex items-center gap-3"><span class="text-purple-400">✓</span> Verified "Pro" badge on posts</li>
            <li class="flex items-center gap-3"><span class="text-purple-400">✓</span> Access to premium insights</li>
          </ul>

          {isPro ? (
            <button disabled class="w-full py-4 rounded-xl bg-white/10 text-white text-center font-bold cursor-not-allowed">
              You are already a Pro
            </button>
          ) : (
            <div class="space-y-3">
              <a 
                href={polarCheckoutUrl}
                class="block w-full py-4 rounded-xl bg-white text-black text-center font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Upgrade to Pro (Polar)
              </a>
              <a 
                href={paddleCheckoutUrl}
                class="block w-full py-4 rounded-xl border border-white/20 bg-black/20 text-white text-center font-bold hover:bg-white/10 transition-colors"
              >
                Upgrade to Pro (Paddle)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
