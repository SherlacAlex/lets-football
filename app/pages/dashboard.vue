<template>
  <div class="space-y-8">
    <div>
      <div
        class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-md mb-6"
      >
        <div class="absolute -right-10 -top-10 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div class="absolute -left-16 -bottom-16 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0">
            <h2 class="text-xl sm:text-2xl font-extrabold text-white">World Cup Predictions</h2>
            <p class="text-slate-400 text-sm mt-1.5 max-w-xl">
              View fixtures and answer match questions. See
              <NuxtLink to="/rules" class="text-emerald-400 hover:text-emerald-300">rules</NuxtLink>
              for scoring.
            </p>
            <p class="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5 text-emerald-500/80 shrink-0" />
              Predictions lock at kick-off (IST)
            </p>
          </div>

          <UserTotalPointsStat
            :points="userTotalPoints"
            :pending="fixturesPending"
            class="shrink-0"
          />
        </div>
      </div>

      <div
        v-if="fixturesError"
        class="p-4 mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
        <span>Could not load fixtures. {{ fixturesError.message }}</span>
      </div>

      <div v-if="fixturesPending" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppCard v-for="n in 4" :key="n" class="animate-pulse !hover:border-slate-800">
          <div class="h-4 bg-slate-800 rounded w-1/3 mb-6" />
          <div class="h-16 bg-slate-800/60 rounded-2xl" />
        </AppCard>
      </div>

      <div
        v-else-if="!dashboardItems.length"
        class="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl"
      >
        <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p class="text-slate-400 text-sm">No fixtures scheduled yet. Check back soon.</p>
      </div>

      <div
        v-if="!fixturesPending && dashboardItems.length"
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div
          v-for="item in dashboardItems"
          :id="fixtureCardElementId(item.fixture.id)"
          :key="item.fixture.id"
          class="scroll-mt-24"
        >
          <FixturePredictionCard
            :fixture="item.fixture"
            :prediction="item.prediction"
            :answers="item.answers"
            @open-predictions="openPredictions(item)"
          />
        </div>
      </div>
    </div>

    <FixturePredictionsDialog
      v-model:open="isPredictionsOpen"
      :fixture="selectedFixture"
      :existing-prediction="selectedPrediction"
    />
  </div>
</template>

<script setup lang="ts">
import type { DashboardFixture } from '~/types/DashboardFixture'
import type { FixtureListItem } from '~/types/fixtures'
import type { Prediction } from '~/types/predictions'
import { useFixturesData } from '~/composables/useFixturesData'
import {
  findFirstScheduledFixture,
  fixtureCardElementId,
  scrollToFixtureCard,
} from '~/utils/dashboard'

definePageMeta({
  layout: 'auth',
})

const user = useSupabaseUser()
const dashboardStore = useDashboardStore()

const {
  pending: fixturesPending,
  error: fixturesError,
} = await useFixturesData()

const dashboardItems = computed((): DashboardFixture[] => dashboardStore.items.value)
const userTotalPoints = computed(() => dashboardStore.userTotalPoints.value)

const isPredictionsOpen = ref(false)
const selectedFixture = ref<FixtureListItem | null>(null)
const selectedPrediction = ref<Prediction | null>(null)

function openPredictions(item: DashboardFixture) {
  selectedFixture.value = item.fixture
  selectedPrediction.value = item.prediction
  isPredictionsOpen.value = true
}

function scrollToFirstScheduledMatch(smooth = false) {
  const first = findFirstScheduledFixture(dashboardItems.value)
  if (!first) {
    return
  }
  nextTick(() => {
    scrollToFixtureCard(first.fixture.id, smooth)
  })
}

watch(
  () => fixturesPending.value,
  (pending, wasPending) => {
    if (wasPending && !pending && dashboardItems.value.length) {
      scrollToFirstScheduledMatch()
    }
  },
)

watch(isPredictionsOpen, (open, wasOpen) => {
  if (wasOpen && !open) {
    scrollToFirstScheduledMatch(true)
  }
})

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
    return
  }
  if (!fixturesPending.value && dashboardItems.value.length) {
    scrollToFirstScheduledMatch()
  }
})
</script>
