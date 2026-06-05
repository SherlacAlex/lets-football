<template>
  <AppCard>
    <div class="flex justify-between items-center text-xs text-slate-500 mb-4 gap-2 flex-wrap">
      <span>
        {{ formatMatchDate(fixture.match_date) }}
        <template v-if="fixture.group_name"> &bull; {{ fixture.group_name }}</template>
      </span>
      <div class="flex items-center gap-2">
        <span
          v-if="actualResult"
          class="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
        >
          Result entered
        </span>
        <span
          class="px-2 py-0.5 rounded-full border text-xs font-medium capitalize"
          :class="statusBadgeClass(fixture.status)"
        >
          {{ statusLabel(fixture.status) }}
        </span>
        <span
          v-if="fixture.venue"
          class="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400"
        >
          {{ fixture.venue }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 py-2">
      <FixtureTeamDisplay :team="fixture.home_team" align="home" />

      <FixtureScoreDisplay
        :home-score="fixture.home_score"
        :away-score="fixture.away_score"
      />

      <FixtureTeamDisplay :team="fixture.away_team" align="away" />
    </div>

    <div
      v-if="actualResult"
      class="mt-4 text-center text-xs text-slate-500"
    >
      Final score:
      <span class="text-slate-300 font-semibold tabular-nums">
        {{ actualResult.home_score }} – {{ actualResult.away_score }}
      </span>
    </div>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl active:scale-95 transition-all duration-200"
        @click="emit('open-results')"
      >
        {{ actualResult ? 'Update results' : 'Enter results' }}
      </button>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { AdminFixtureListItem } from '~/types/AdminDashboardFixture'
import { formatMatchDate, statusBadgeClass, statusLabel } from '~/utils/fixtures'

defineProps<{
  fixture: AdminFixtureListItem
  actualResult: { home_score: number; away_score: number } | null
}>()

const emit = defineEmits<{
  'open-results': []
}>()
</script>
