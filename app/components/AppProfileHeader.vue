<template>
  <div class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
    <div class="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

    <div class="flex flex-col sm:flex-row items-center sm:justify-between gap-6 relative z-10">
      <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <UAvatar :alt="userEmail" size="xl" class="ring-4 ring-emerald-500/20 w-16 h-16 sm:w-20 sm:h-20" />
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {{ username || 'Football Fan' }}!
          </h1>
          <p class="text-sm text-slate-400 mt-1">{{ userEmail }}</p>
          <div class="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5 mr-1" /> Player Rank: Pro
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UIcon name="i-heroicons-bolt" class="w-3.5 h-3.5 mr-1" /> 150 Points
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 w-full sm:w-auto">
        <button
          type="button"
          class="px-5 py-3 rounded-2xl bg-slate-800/60 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-slate-700 text-sm font-semibold transition-all duration-200 text-center"
          @click="signOut"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

const userEmail = computed(() => user.value?.email || '')
const username = computed(() => user.value?.user_metadata?.username || user.value?.email?.split('@')[0])

const signOut = async () => {
  await client.auth.signOut()
  navigateTo('/welcome')
}
</script>
