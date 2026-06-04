<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center gap-4">
      <NuxtLink
        to="/leagues"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to leagues
      </NuxtLink>
    </div>

    <div class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
      <div class="absolute -right-16 -top-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
            League table
          </h1>
          <p class="text-slate-400 text-sm mt-2">
            Standings will appear here soon.
          </p>
        </div>
        <div class="text-left sm:text-right">
          <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Invite code</p>
          <p class="text-lg font-black tracking-[0.15em] text-emerald-400 mt-1">
            ————
          </p>
        </div>
      </div>
    </div>

    <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <th class="px-6 py-4 font-semibold w-16">#</th>
              <th class="px-6 py-4 font-semibold">Player</th>
              <th class="px-6 py-4 font-semibold text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="px-6 py-12 text-center text-slate-500 text-sm">
                League standings are not available yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const user = useSupabaseUser()

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
