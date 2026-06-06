<template>
  <div class="space-y-8">
    <AppProfileHeader />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useAppSeo({
  title: 'Profile',
  noIndex: true,
})

const user = useSupabaseUser()

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
