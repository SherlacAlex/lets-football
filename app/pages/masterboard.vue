<template>
  <div class="space-y-8">
    <div>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
        <div class="min-w-0">
          <h2 class="text-lg sm:text-xl font-extrabold text-white">World Cup Results</h2>
          <p class="text-slate-400 text-xs mt-1">
            Enter match results and correct answers for bonus questions.
          </p>
        </div>
        <div
          class="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 shrink-0 self-start"
        >
          <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-emerald-400 shrink-0" />
          <span class="leading-snug">Admin — results trigger point recalculation</span>
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
          <AdminFixtureCard
            :fixture="item.fixture"
            :actual-result="item.actual_result"
            @open-results="openResults(item)"
          />
        </div>
      </div>
    </div>

    <AdminFixtureDialog
      v-model:open="isResultsOpen"
      :fixture="selectedFixture"
      :existing-result="selectedResult"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminDashboardFixture } from '~/types/AdminDashboardFixture'
import type { AdminFixtureListItem } from '~/types/AdminDashboardFixture'
import { apiRoutes } from '~/utils/api'
import {
  findFirstScheduledAdminFixture,
  fixtureCardElementId,
  normalizeAdminFixturesResponse,
  scrollToFixtureCard,
} from '~/utils/adminDashboard'

definePageMeta({
  middleware: 'admin',
  layout: 'auth',
})

useAppSeo({
  title: 'Results Admin',
  noIndex: true,
})

const requestFetch = useRequestFetch()
const adminDashboardStore = useAdminDashboardStore()

const {
  data: fixturesResponse,
  pending: fixturesPending,
  error: fixturesError,
} = await useFetch(apiRoutes.adminFixtures, {
  key: 'admin-dashboard-fixtures',
  $fetch: requestFetch as typeof $fetch,
  transform: (data) =>
    normalizeAdminFixturesResponse(
      (data ?? []) as Parameters<typeof normalizeAdminFixturesResponse>[0],
    ),
})

watch(
  fixturesResponse,
  (items) => {
    if (items) {
      adminDashboardStore.setItems(items)
    }
  },
  { immediate: true },
)

const dashboardItems = computed((): AdminDashboardFixture[] => adminDashboardStore.items.value)

const isResultsOpen = ref(false)
const selectedFixture = ref<AdminFixtureListItem | null>(null)
const selectedResult = ref<{ home_score: number; away_score: number } | null>(null)

function openResults(item: AdminDashboardFixture) {
  selectedFixture.value = item.fixture
  selectedResult.value = item.actual_result
  isResultsOpen.value = true
}

function scrollToFirstScheduledMatch(smooth = false) {
  const first = findFirstScheduledAdminFixture(dashboardItems.value)
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

watch(isResultsOpen, (open, wasOpen) => {
  if (wasOpen && !open) {
    scrollToFirstScheduledMatch(true)
  }
})

onMounted(() => {
  if (!fixturesPending.value && dashboardItems.value.length) {
    scrollToFirstScheduledMatch()
  }
})
</script>
