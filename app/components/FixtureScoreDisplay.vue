<template>
  <div class="flex items-center gap-1 sm:gap-2 shrink-0">
    <span
      class="w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-base sm:text-lg text-white tabular-nums"
    >
      {{ formatScore(homeScore) }}
    </span>
    <span class="text-slate-600 font-bold text-sm sm:text-base">-</span>
    <span
      class="w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-base sm:text-lg text-white tabular-nums"
    >
      {{ formatScore(awayScore) }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  homeScore: number | null
  awayScore: number | null
}>()

function formatScore(score: number | null): string {
  return score == null ? '–' : String(score)
}
</script>
