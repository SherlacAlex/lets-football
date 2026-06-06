<template>
  <AppCard>
    <div class="flex justify-between items-center text-xs text-slate-500 mb-4 gap-2 flex-wrap">
      <span>
        {{ formatMatchDate(fixture.match_date) }}
        <template v-if="fixture.group_name"> &bull; {{ fixture.group_name }}</template>
      </span>
      <div class="flex items-center gap-2">
        <span
          v-if="prediction"
          class="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
        >
          Predicted
        </span>
        <span
          class="px-2 py-0.5 rounded-full border text-xs font-medium capitalize"
          :class="statusBadgeClass(fixture.status)"
        >
          {{ statusLabel(fixture.status) }}
        </span>
        <span
          v-if="fixture.venue"
          class="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 max-w-[8rem] truncate"
        >
          {{ fixture.venue }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between gap-2 sm:gap-4 py-2">
      <FixtureTeamDisplay :team="fixture.home_team" align="home" />

      <FixtureScoreDisplay
        :home-score="fixture.home_score"
        :away-score="fixture.away_score"
      />

      <FixtureTeamDisplay :team="fixture.away_team" align="away" />
    </div>

    <div
      v-if="prediction"
      class="mt-4 text-center text-xs text-slate-500"
    >
      Your pick:
      <span class="text-slate-300 font-semibold tabular-nums">
        {{ prediction.home_score }} – {{ prediction.away_score }}
      </span>
    </div>

    <div class="mt-6 flex items-end justify-between gap-3">
      <div v-if="showPointsEarned" class="text-left min-w-0">
        <p class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          Points earned
        </p>
        <p class="text-lg font-bold text-emerald-400 tabular-nums leading-tight">
          {{ totalPointsEarned }}
          <span class="text-xs font-semibold">{{ totalPointsEarned === 1 ? 'pt' : 'pts' }}</span>
        </p>
      </div>

      <button
        type="button"
        class="relative shrink-0 overflow-hidden px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-[11px] sm:text-xs font-bold rounded-xl active:scale-95 transition-all duration-200"
        :class="{ 'ml-auto': !showPointsEarned }"
        @click="emit('open-predictions')"
      >
        {{ prediction ? 'View predictions' : 'Predictions' }}
      </button>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { FixtureListItem } from '~/types/fixtures'
import type { Prediction, PredictionAnswer } from '~/types/predictions'
import { formatMatchDate, statusBadgeClass, statusLabel } from '~/utils/fixtures'
import { getFixturePointsEarned } from '~/utils/predictions'

const props = defineProps<{
  fixture: FixtureListItem
  prediction: Prediction | null
  answers?: PredictionAnswer[]
}>()

const emit = defineEmits<{
  'open-predictions': []
}>()

const showPointsEarned = computed(() => props.fixture.status === 'completed')

const totalPointsEarned = computed(() =>
  getFixturePointsEarned(props.prediction, props.answers ?? []),
)
</script>
