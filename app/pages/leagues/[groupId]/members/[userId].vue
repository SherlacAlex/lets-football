<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center gap-4">
      <NuxtLink :to="`/leagues/${groupId}`"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to league table
      </NuxtLink>
    </div>

    <div v-if="predictionsError"
      class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
      <span>Could not load predictions. {{ predictionsError.message }}</span>
    </div>

    <div v-if="predictionsPending" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AppCard v-for="n in 4" :key="n" class="animate-pulse !hover:border-slate-800">
        <div class="h-4 bg-slate-800 rounded w-1/3 mb-6" />
        <div class="h-16 bg-slate-800/60 rounded-2xl" />
      </AppCard>
    </div>

    <template v-else>
      <div
        class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <h1 class="text-2xl font-extrabold text-white">Match predictions</h1>
        <p class="text-slate-400 text-sm mt-2">
          All fixtures for this member. Tap a completed match to view their full prediction.
        </p>
      </div>

      <div v-if="!fixturePoints.length"
        class="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
        <p class="text-slate-400 text-sm">No fixtures scheduled yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <component :is="canViewFixture(fixture) ? 'button' : 'div'" v-for="fixture in fixturePoints"
          :id="fixtureCardElementId(fixture.fixture_id)" :key="fixture.fixture_id"
          :type="canViewFixture(fixture) ? 'button' : undefined" class="w-full text-left scroll-mt-24"
          :class="canViewFixture(fixture) ? 'cursor-pointer' : 'cursor-default'"
          @click="canViewFixture(fixture) ? openFixture(fixture.fixture_id) : undefined">
          <AppCard :class="canViewFixture(fixture) ? '!hover:border-slate-700' : '!hover:border-slate-800'">
            <div class="flex justify-between items-center text-xs text-slate-500 mb-4 gap-2 flex-wrap">
              <span>
                {{ formatMatchDate(fixture.match_date) }}
                <template v-if="fixture.group_name"> &bull; {{ fixture.group_name }}</template>
              </span>
              <div class="flex items-center gap-2">
                <span v-if="(fixture.status === 'completed' || fixture.status === 'live') && fixture.has_predicted"
                  class="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Predicted
                </span>
                <span v-else-if="fixture.status === 'completed'"
                  class="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  Not predicted
                </span>
                <span class="px-2 py-0.5 rounded-full border text-xs font-medium capitalize"
                  :class="statusBadgeClass(fixture.status)">
                  {{ statusLabel(fixture.status) }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 py-2">
              <FixtureTeamDisplay :team="toTeam(fixture.home_team)" align="home" />
              <FixtureScoreDisplay :home-score="fixture.home_score" :away-score="fixture.away_score" />
              <FixtureTeamDisplay :team="toTeam(fixture.away_team)" align="away" />
            </div>

            <div class="mt-6 flex items-end justify-between gap-3">
              <div class="text-left min-w-0">
                <p class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Points earned
                </p>
                <p v-if="fixture.status === 'completed'" class="text-lg font-bold tabular-nums leading-tight"
                  :class="fixture.total_points > 0 ? 'text-emerald-400' : 'text-rose-400'">
                  {{ fixture.total_points }}
                  <span class="text-xs font-semibold">
                    {{ fixture.total_points === 1 ? 'pt' : 'pts' }}
                  </span>
                </p>
                <p v-else class="text-sm text-slate-500">—</p>
              </div>

              <span v-if="canViewFixture(fixture)" class="shrink-0 text-xs font-bold text-emerald-400">
                View prediction
              </span>
            </div>
          </AppCard>
        </component>
      </div>
    </template>

    <LeagueMemberPredictionDialog v-model:open="isPredictionOpen" :group-id="groupId" :user-id="userId"
      :fixture-id="selectedFixtureId" />
  </div>
</template>

<script setup lang="ts">
import type { MemberFixturePoints } from '~/types/groups'
import type { Team } from '~/types/fixtures'
import { apiRoutes } from '~/utils/api'
import { fixtureCardElementId, scrollToFixtureCard } from '~/utils/dashboard'
import { formatMatchDate, statusBadgeClass, statusLabel } from '~/utils/fixtures'

definePageMeta({
  layout: 'auth',
})

useAppSeo({
  title: 'Member Predictions',
  description: 'View a league member’s FIFA World Cup 2026 match predictions.',
  noIndex: true,
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
} = await useFetch<MemberFixturePoints[]>(
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

function toTeam(team: MemberFixturePoints['home_team']): Team {
  return {
    id: team.fifa_code,
    name: team.name,
    short_name: team.name,
    fifa_code: team.fifa_code,
    flag_url: team.flag_url ?? null,
  }
}

function canViewFixture(fixture: MemberFixturePoints) {
  return fixture.has_predicted && (fixture.status === 'completed' || fixture.status === 'live')
}

function openFixture(fixtureId: string) {
  selectedFixtureId.value = fixtureId
  isPredictionOpen.value = true
}

function scrollToFirstScheduledMatch(smooth = false) {
  const first = fixturePoints.value.find((fixture) => fixture.status === 'scheduled')
  if (!first) {
    return
  }
  nextTick(() => {
    scrollToFixtureCard(first.fixture_id, smooth)
  })
}

watch(
  () => predictionsPending.value,
  (pending, wasPending) => {
    if (wasPending && !pending && fixturePoints.value.length) {
      scrollToFirstScheduledMatch()
    }
  },
)

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
    return
  }
  if (!predictionsPending.value && fixturePoints.value.length) {
    scrollToFirstScheduledMatch()
  }
})
</script>
