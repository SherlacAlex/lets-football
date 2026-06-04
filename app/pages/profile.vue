<template>
  <div class="space-y-8">
    <AppProfileHeader />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const user = useSupabaseUser()

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
