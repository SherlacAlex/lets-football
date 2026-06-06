<template>
  <div class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
    <div class="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

    <div class="absolute -left-12 -bottom-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

    <div class="flex flex-col gap-6 relative z-10">
      <div class="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-5">
        <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <UAvatar :alt="userEmail" size="xl" class="ring-4 ring-emerald-500/20 w-16 h-16 sm:w-20 sm:h-20" />
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {{ username || 'Football Fan' }}!
            </h1>
            <p class="text-sm text-slate-400 mt-1">{{ userEmail }}</p>
          </div>
        </div>

        <button
          type="button"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-slate-700 text-sm font-semibold transition-all duration-200 text-center shrink-0"
          @click="signOut"
        >
          Sign Out
        </button>
      </div>

      <UserTotalPointsStat
        :points="totalPoints"
        :pending="pointsPending"
        full-width
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFixturesData } from '~/composables/useFixturesData'

const user = useSupabaseUser()
const client = useSupabaseClient()
const dashboardStore = useDashboardStore()

const { pending: pointsPending } = await useFixturesData()

const userEmail = computed(() => user.value?.email || '')
const username = computed(() => user.value?.user_metadata?.username || user.value?.email?.split('@')[0])
const totalPoints = computed(() => dashboardStore.userTotalPoints.value)

const signOut = async () => {
  await client.auth.signOut()
  navigateTo('/welcome')
}
</script>
