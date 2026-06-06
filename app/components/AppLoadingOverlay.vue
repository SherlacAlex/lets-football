<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Loading"
      >
        <div
          class="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 px-8 py-7 shadow-2xl"
        >
          <div class="relative h-12 w-12">
            <div
              class="absolute inset-0 rounded-full border-2 border-slate-700"
              aria-hidden="true"
            />
            <div
              class="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-teal-400 animate-spin"
              aria-hidden="true"
            />
            <img
              src="/world-cup.svg"
              alt=""
              class="absolute inset-1.5 object-contain object-top"
              aria-hidden="true"
            />
          </div>
          <p class="text-sm font-semibold text-slate-200">Loading…</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { isLoading } = useApiLoading()
</script>
