<template>
  <div
    class="min-h-[100dvh] flex flex-col bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-black"
  >
    <header
      class="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center gap-3">
        <NuxtLink to="/welcome" class="flex items-center gap-2 sm:gap-3 group min-w-0">
          <div
            class="bg-white p-1 sm:p-1.5 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0"
          >
            <img
              src="/world-cup.svg"
              alt=""
              class="h-5 w-5 sm:h-6 sm:w-6 object-contain object-top"
            />
          </div>
          <span
            class="text-base sm:text-xl lg:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent truncate"
          >
            LET'S FOOTBALL
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-6 lg:gap-8">
          <NuxtLink
            to="/welcome"
            class="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-200"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-200"
          >
            Predictions
          </NuxtLink>
          <NuxtLink
            to="/leagues"
            class="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-200"
          >
            Leagues
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-4 shrink-0">
          <template v-if="user">
            <NuxtLink
              to="/dashboard"
              class="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <UAvatar :alt="user.email" size="sm" class="border border-emerald-500/30" />
              <span class="max-w-[8rem] truncate">{{ user.email?.split('@')[0] }}</span>
            </NuxtLink>
            <button
              type="button"
              class="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-rose-400 transition-colors px-3 py-2 rounded-lg hover:bg-rose-500/5"
              @click="signOut"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="hidden sm:inline text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="hidden sm:inline relative group overflow-hidden px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all duration-200"
            >
              Start Predicting
            </NuxtLink>
          </template>

          <button
            type="button"
            class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            :aria-expanded="isMenuOpen"
            aria-label="Open menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <UIcon :name="isMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav
        v-if="isMenuOpen"
        class="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-1"
      >
        <NuxtLink
          to="/welcome"
          class="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"
          @click="isMenuOpen = false"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/dashboard"
          class="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"
          @click="isMenuOpen = false"
        >
          Predictions
        </NuxtLink>
        <NuxtLink
          to="/leagues"
          class="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"
          @click="isMenuOpen = false"
        >
          Leagues
        </NuxtLink>
        <template v-if="user">
          <NuxtLink
            to="/profile"
            class="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"
            @click="isMenuOpen = false"
          >
            Profile
          </NuxtLink>
          <button
            type="button"
            class="px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 text-left"
            @click="signOut"
          >
            Sign Out
          </button>
        </template>
        <template v-else>
          <NuxtLink
            to="/login"
            class="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800"
            @click="isMenuOpen = false"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/10"
            @click="isMenuOpen = false"
          >
            Start Predicting
          </NuxtLink>
        </template>
      </nav>
    </header>

    <main class="flex-1 flex flex-col min-w-0 overflow-x-hidden">
      <slot />
    </main>

    <footer class="border-t border-slate-900 bg-slate-950/60 py-6 sm:py-8 px-4 sm:px-6 text-center text-sm text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 Let's Football. All rights reserved.</p>
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
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
const isMenuOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  isMenuOpen.value = false
})

const signOut = async () => {
  isMenuOpen.value = false
  await client.auth.signOut()
  navigateTo('/welcome')
}
</script>
