<template>
  <div
    class="group bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md transition-all duration-300"
    :class="$attrs.class"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
</script>
