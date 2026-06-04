<template>
  <div class="flex items-center space-x-2 shrink-0">
    <span
      class="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-lg text-white tabular-nums"
    >
      {{ formatScore(homeScore) }}
    </span>
    <span class="text-slate-600 font-bold">-</span>
    <span
      class="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-lg text-white tabular-nums"
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
