<template>
  <div
    :class="[
      align === 'home'
        ? 'flex-1 flex flex-col items-center sm:flex-row sm:items-center sm:space-x-3 text-center sm:text-left min-w-0'
        : 'flex-1 flex flex-col items-center sm:flex-row-reverse sm:items-center sm:space-x-reverse sm:space-x-3 text-center sm:text-right min-w-0',
    ]"
  >
    <div class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
      <img
        v-if="team.flag_url"
        :src="team.flag_url"
        :alt="team.name"
        class="w-full h-full object-contain rounded"
      />
      <span
        v-else
        class="text-xs font-bold text-slate-500 bg-slate-950 border border-slate-800 rounded px-2 py-1"
      >
        {{ team.fifa_code }}
      </span>
    </div>
    <span class="font-bold text-slate-200 mt-2 sm:mt-0 text-sm sm:text-base truncate">
      {{ team.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '~/types/fixtures'

defineProps<{
  team: Team
  align: 'home' | 'away'
}>()
</script>
