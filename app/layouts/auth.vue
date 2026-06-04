<template>
  <div class="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
    <!-- Sidebar Navigation -->
    <nav
      class="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300">
      <div class="flex flex-col">
        <!-- Logo -->
        <div class="h-20 flex items-center justify-center md:justify-start px-6 border-b border-slate-800">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div
              class="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-slate-950" />
            </div>
            <span
              class="hidden md:block text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              LET'S FOOTBALL
            </span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div class="p-4 space-y-2">
          <NuxtLink to="/welcome"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-emerald-400 text-slate-400"
            active-class="bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500">
            <UIcon name="i-heroicons-home" class="w-6 h-6" />
            <span class="hidden md:inline text-sm">Landing Page</span>
          </NuxtLink>

          <NuxtLink to="/dashboard"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-emerald-400 text-slate-400"
            active-class="bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500">
            <UIcon name="i-heroicons-academic-cap" class="w-6 h-6" />
            <span class="hidden md:inline text-sm">Dashboard</span>
          </NuxtLink>

          <NuxtLink to="/profile"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-emerald-400 text-slate-400"
            active-class="bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />
            <span class="hidden md:inline text-sm">Profile</span>
          </NuxtLink>

          <NuxtLink to="/leagues"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-emerald-400 text-slate-400"
            active-class="bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500">
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6" />
            <span class="hidden md:inline text-sm">Leagues</span>
          </NuxtLink>

          <NuxtLink to="/rules"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-emerald-400 text-slate-400"
            active-class="bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500">
            <UIcon name="i-heroicons-shield-check" class="w-6 h-6" />
            <span class="hidden md:inline text-sm">Rules</span>
          </NuxtLink>
        </div>
      </div>

      <!-- User Profile & Sign Out at the Bottom -->
      <div class="p-4 border-t border-slate-800">
        <div class="flex flex-col space-y-4">
          <!-- User info -->
          <div class="flex items-center space-x-3 px-2">
            <UAvatar :alt="user?.email" size="sm" class="border border-emerald-500/30" />
            <div class="hidden md:block overflow-hidden">
              <p class="text-xs text-slate-500 truncate">{{ user?.email }}</p>
            </div>
          </div>

          <!-- Sign Out Button -->
          <button @click="signOut"
            class="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200">
            <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-6 h-6" />
            <span class="hidden md:inline text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col overflow-y-auto bg-slate-950">
      <!-- Top header bar for mobile search or notification dashboard info -->
      <div
        class="h-20 border-b border-slate-900 px-8 flex items-center justify-between bg-slate-950/40 backdrop-blur-sm">
        <div class="flex items-center gap-8">
          <nav class="flex items-center gap-1">
            <NuxtLink to="/dashboard"
              class="px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white transition-colors"
              active-class="!text-emerald-400 bg-emerald-500/10">
              Predictions
            </NuxtLink>
            <NuxtLink to="/profile"
              class="px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white transition-colors"
              active-class="!text-emerald-400 bg-emerald-500/10">
              Profile
            </NuxtLink>
          </nav>
          <div class="hidden sm:flex items-center space-x-3">
            <span class="text-sm font-semibold tracking-wider text-emerald-400 uppercase">World Cup Predictions</span>
            <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400">Live</span>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="relative p-2 text-slate-400 hover:text-white transition-colors">
            <UIcon name="i-heroicons-bell" class="w-6 h-6" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>
      </div>

      <div class="p-8 max-w-7xl w-full mx-auto flex-1">
        <slot />
      </div>
    </main>
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
