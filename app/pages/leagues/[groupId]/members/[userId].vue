<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center gap-4">
      <NuxtLink
        :to="`/leagues/${groupId}`"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to league table
      </NuxtLink>
    </div>

    <div
      v-if="predictionsError"
      class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2"
    >
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
      <span>Could not load predictions. {{ predictionsError.message }}</span>
    </div>

    <div
      v-if="predictionsPending"
      class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 animate-pulse"
    >
      <div class="h-8 bg-slate-800 rounded w-1/3 mb-4" />
      <div class="space-y-3">
        <div v-for="n in 5" :key="n" class="h-12 bg-slate-800/60 rounded-xl" />
      </div>
    </div>

    <template v-else>
      <div class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <h1 class="text-2xl font-extrabold text-white">Completed match points</h1>
        <p class="text-slate-400 text-sm mt-2">
          Tap a match to view the full prediction and result.
        </p>
      </div>

      <div
        v-if="!fixturePoints.length"
        class="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl"
      >
        <p class="text-slate-400 text-sm">No completed fixture points yet.</p>
      </div>

      <div v-else class="space-y-3">
        <button
          v-for="fixture in fixturePoints"
          :key="fixture.fixture_id"
          type="button"
          class="w-full text-left bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 transition-colors"
          @click="openFixture(fixture.fixture_id)"
        >
          <p class="text-xs text-slate-500 mb-2">{{ formatMatchDate(fixture.match_date) }}</p>
          <div class="flex items-center justify-between gap-4">
            <span class="font-semibold text-white">
              {{ fixture.home_team.fifa_code }} vs {{ fixture.away_team.fifa_code }}
            </span>
            <span class="text-sm font-bold text-emerald-400 tabular-nums">
              {{ fixture.total_points }} pts
            </span>
          </div>
        </button>
      </div>
    </template>

    <LeagueMemberPredictionDialog
      v-model:open="isPredictionOpen"
      :group-id="groupId"
      :user-id="userId"
      :fixture-id="selectedFixtureId"
    />
  </div>
</template>

<script setup lang="ts">
import type { MemberFixturePoints } from '~/types/groups'
import { apiRoutes } from '~/utils/api'
import { formatMatchDate } from '~/utils/fixtures'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const user = useSupabaseUser()
const requestFetch = useRequestFetch()

const groupId = computed(() => String(route.params.groupId ?? ''))
const userId = computed(() => String(route.params.userId ?? ''))

const isPredictionOpen = ref(false)
const selectedFixtureId = ref<string | null>(null)

const {
  data: predictionsResponse,
  pending: predictionsPending,
  error: predictionsError,
} = await useFetch(
  () => apiRoutes.memberPredictions(groupId.value, userId.value),
  {
    key: () => `member-predictions-${groupId.value}-${userId.value}`,
    $fetch: requestFetch as typeof $fetch,
    watch: [groupId, userId],
  },
)

const fixturePoints = computed(
  (): MemberFixturePoints[] => predictionsResponse.value ?? [],
)

function openFixture(fixtureId: string) {
  selectedFixtureId.value = fixtureId
  isPredictionOpen.value = true
}

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
