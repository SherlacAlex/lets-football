<template>
  <div
    class="min-h-screen flex flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-black">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-6 py-4 transition-all duration-300">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/welcome" class="flex items-center space-x-3 group">
          <div
            class="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-slate-950" />
          </div>
          <span
            class="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
            LET'S FOOTBALL
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/welcome"
            class="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-200">
            Home
          </NuxtLink>
          <NuxtLink to="/dashboard"
            class="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-200">
            Predictions
          </NuxtLink>
          <NuxtLink to="/leagues"
            class="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-200">
            Leagues
          </NuxtLink>
        </nav>

        <!-- CTAs / Auth State -->
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <NuxtLink to="/dashboard"
              class="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              <UAvatar :alt="user.email" size="sm" class="border border-emerald-500/30" />
              <span class="hidden sm:inline">{{ user.email?.split('@')[0] }}</span>
            </NuxtLink>
            <button @click="signOut"
              class="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-rose-400 transition-colors px-3 py-2 rounded-lg hover:bg-rose-500/5">
              Sign Out
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login"
              class="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </NuxtLink>
            <NuxtLink to="/register"
              class="relative group overflow-hidden px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all duration-200">
              <span class="relative z-10">Start Predicting</span>
              <div
                class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              </div>
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 bg-slate-950/60 py-8 px-6 text-center text-sm text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 Let's Football. All rights reserved.</p>
        <div class="flex space-x-6">
          <a href="#" class="hover:text-emerald-400 transition-colors">Terms</a>
          <a href="#" class="hover:text-emerald-400 transition-colors">Privacy</a>
          <a href="#" class="hover:text-emerald-400 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

const signOut = async () => {
  await client.auth.signOut()
  navigateTo("/welcome")
}
</script>
