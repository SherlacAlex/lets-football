<template>
  <div
    class="flex items-center gap-3 sm:gap-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-950/40 to-slate-950/60 px-4 py-3 sm:px-5 sm:py-4"
    :class="fullWidth ? 'w-full' : 'w-full sm:w-auto'"
  >
    <div
      class="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/25"
    >
      <UIcon name="i-heroicons-trophy" class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
    </div>
    <div class="min-w-0">
      <p class="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
        Total points
      </p>
      <p
        class="text-2xl sm:text-3xl font-extrabold tabular-nums leading-none mt-0.5"
        :class="pending ? 'text-slate-600' : 'text-white'"
      >
        <template v-if="pending">
          <span class="inline-block w-10 h-7 sm:h-8 bg-slate-800/80 rounded animate-pulse" />
        </template>
        <template v-else>{{ points }}</template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  points: number
  pending?: boolean
  fullWidth?: boolean
}>()
</script>
