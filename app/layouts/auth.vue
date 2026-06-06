<template>
  <div class="flex h-[100dvh] bg-slate-950 text-white font-sans overflow-hidden">
    <!-- Desktop sidebar -->
    <nav
      class="hidden md:flex md:w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0"
    >
      <div class="flex flex-col min-h-0">
        <div class="h-16 lg:h-20 flex items-center px-4 lg:px-6 border-b border-slate-800 shrink-0">
          <NuxtLink to="/" class="flex items-center gap-3 group min-w-0">
            <div
              class="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0"
            >
              <UIcon name="i-heroicons-trophy" class="w-6 h-6 text-slate-950" />
            </div>
            <span
              class="text-base lg:text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent truncate"
            >
              LET'S FOOTBALL
            </span>
          </NuxtLink>
        </div>

        <div class="p-3 lg:p-4 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 hover:bg-slate-800 hover:text-emerald-400 text-slate-400"
            active-class="bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500"
          >
            <UIcon :name="item.icon" class="w-6 h-6 shrink-0" />
            <span class="text-sm">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>

      <div class="p-3 lg:p-4 border-t border-slate-800 shrink-0">
        <div class="flex items-center gap-3 px-2 mb-3 min-w-0">
          <UAvatar :alt="user?.email" size="sm" class="border border-emerald-500/30 shrink-0" />
          <p class="text-xs text-slate-500 truncate">{{ user?.email }}</p>
        </div>
        <button
          type="button"
          class="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 w-full rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
          @click="signOut"
        >
          <UIcon name="i-heroicons-arrow-left-on-rectangle" class="w-6 h-6 shrink-0" />
          <span class="text-sm">Sign Out</span>
        </button>
      </div>
    </nav>

    <!-- Main -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-14 md:h-16 lg:h-20 border-b border-slate-900 px-4 md:px-6 lg:px-8 flex items-center justify-between bg-slate-950/40 backdrop-blur-sm shrink-0 gap-3"
      >
        <div class="flex items-center gap-3 min-w-0 md:hidden">
          <div
            class="bg-gradient-to-tr from-emerald-500 to-teal-400 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20 shrink-0"
          >
            <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-slate-950" />
          </div>
          <span class="text-sm font-bold text-white truncate">Let's Football</span>
        </div>

        <nav class="hidden md:flex items-center gap-1 min-w-0 overflow-x-auto">
          <NuxtLink
            v-for="item in topNavItems"
            :key="item.to"
            :to="item.to"
            class="px-3 lg:px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
            active-class="!text-emerald-400 bg-emerald-500/10"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center gap-2 shrink-0">
          <span class="text-sm font-semibold tracking-wider text-emerald-400 uppercase whitespace-nowrap">
            World Cup Predictions
          </span>
          <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400">
            Live
          </span>
        </div>

        <button
          type="button"
          class="relative p-2 text-slate-400 hover:text-white transition-colors shrink-0"
          aria-label="Notifications"
        >
          <UIcon name="i-heroicons-bell" class="w-5 h-5 md:w-6 md:h-6" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </header>

      <div class="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6 lg:p-8 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:pb-6 lg:pb-8">
        <div class="max-w-7xl w-full mx-auto">
          <slot />
        </div>
      </div>
    </main>

    <!-- Mobile bottom navigation -->
    <nav
      class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Main navigation"
    >
      <div class="flex items-stretch justify-around px-1">
        <NuxtLink
          v-for="item in navItems"
          :key="`mobile-${item.to}`"
          :to="item.to"
          class="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 min-w-0 text-slate-500 transition-colors"
          active-class="!text-emerald-400"
        >
          <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] font-semibold truncate max-w-full leading-tight">{{ item.mobileLabel }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()
const { isAdmin, fetchAdminStatus } = useAdmin()

watch(user, () => fetchAdminStatus(), { immediate: true })

type NavItem = {
  to: string
  label: string
  mobileLabel: string
  icon: string
}

const navItems = computed((): NavItem[] => {
  const items: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', mobileLabel: 'Home', icon: 'i-heroicons-academic-cap' },
    { to: '/leagues', label: 'Leagues', mobileLabel: 'Leagues', icon: 'i-heroicons-chart-bar' },
    { to: '/rules', label: 'Rules', mobileLabel: 'Rules', icon: 'i-heroicons-shield-check' },
  ]

  if (isAdmin.value === true) {
    items.push({
      to: '/masterboard',
      label: 'Results',
      mobileLabel: 'Results',
      icon: 'i-heroicons-clipboard-document-check',
    })
  }

  items.push({
    to: '/profile',
    label: 'Profile',
    mobileLabel: 'Profile',
    icon: 'i-heroicons-user-circle',
  })

  return items
})

const topNavItems = computed(() =>
  navItems.value.map(({ to, label }) => ({ to, label })),
)

const signOut = async () => {
  await client.auth.signOut()
  navigateTo('/welcome')
}
</script>
