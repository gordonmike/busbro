import type { FC } from 'hono/jsx'

export default function Home() {
  return (
    <div class="flex-1 overflow-hidden relative">
      {/* Background Ambient Gradients */}
      <div class="absolute top-0 -left-1/4 w-[150%] h-[500px] bg-gradient-to-b from-purple-600/20 via-blue-600/10 to-transparent blur-[120px] -z-10 pointer-events-none" />
      <div class="absolute bottom-0 -right-1/4 w-[150%] h-[500px] bg-gradient-to-t from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <main class="max-w-7xl mx-auto px-6 pt-24 pb-24 text-center flex flex-col items-center relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-fade-in">
          <span class="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          Now live with Supabase & HonoX
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl leading-[1.1]">
          Discover your next <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            million dollar idea
          </span>
        </h1>
        
        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
          Join a community of makers and entrepreneurs. Share your business concepts, get immediate feedback, and unlock premium insights with our Pro subscription.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <a href="/posts" class="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Start Exploring
          </a>
          <button class="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
            Share an Idea
          </button>
        </div>

        {/* Dashboard Preview Mockup (Glassmorphism) */}
        <div class="mt-24 w-full max-w-5xl relative group perspective-1000">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-3xl"></div>
          
          <div class="relative rounded-2xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-2 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-700 hover:-translate-y-2">
            {/* Mac-like Window Header */}
            <div class="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
              <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            
            {/* Mockup Content */}
            <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { title: 'SaaS for AI Agents', icon: '🤖', likes: 248, comments: 42 },
                { title: 'Local Gym CRM', icon: '🏋️‍♂️', likes: 184, comments: 28 },
                { title: 'Creator Analytics', icon: '📊', likes: 356, comments: 89 }
              ].map((item, i) => (
                <div key={i} class="rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.06] transition-colors cursor-pointer group/card relative overflow-hidden">
                  <div class="absolute top-0 right-0 p-4 opacity-0 group-hover/card:opacity-100 transition-opacity text-gray-500 hover:text-white">
                    ↗
                  </div>
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-5 border border-white/10 text-2xl">
                    {item.icon}
                  </div>
                  <h3 class="text-xl font-semibold mb-2 text-gray-100">{item.title}</h3>
                  <p class="text-gray-400 text-sm mb-6 leading-relaxed">
                    A recurring revenue model focusing on solving B2B retention through automated engagement workflows.
                  </p>
                  <div class="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span class="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      {item.likes}
                    </span>
                    <span class="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      {item.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
