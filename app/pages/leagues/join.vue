<template>
  <div class="space-y-6 max-w-md mx-auto py-8">
    <div
      v-if="joinError"
      class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2"
    >
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
      <span>{{ joinError }}</span>
    </div>

    <div
      v-else
      class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center backdrop-blur-md"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-emerald-400 mx-auto mb-4 animate-spin"
      />
      <p class="text-white font-semibold">{{ statusMessage }}</p>
      <p v-if="inviteCode" class="text-xs text-slate-500 mt-2 tracking-widest uppercase">
        Code {{ inviteCode }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiRoutes } from '~/utils/api'
import { fetchErrorMessage } from '~/utils/groups'

definePageMeta({
  layout: 'auth',
})

useAppSeo({
  title: 'Join League',
  description: 'Join a FIFA World Cup 2026 prediction league with an invite link.',
  noIndex: true,
})

const route = useRoute()
const user = useSupabaseUser()
const requestFetch = useRequestFetch()

const inviteCode = computed(() =>
  String(route.query.code ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ''),
)

const joinError = ref('')
const statusMessage = ref('Joining league…')
const hasAttemptedJoin = ref(false)

async function attemptJoin() {
  if (hasAttemptedJoin.value) {
    return
  }

  if (!inviteCode.value) {
    joinError.value = 'Invalid invite link. Ask your friend for a new one.'
    return
  }

  if (!user.value) {
    statusMessage.value = 'Sign in to join this league…'
    await navigateTo({
      path: '/login',
      query: { redirect: route.fullPath },
    })
    return
  }

  hasAttemptedJoin.value = true
  statusMessage.value = 'Adding you to the league…'

  try {
    const result = await requestFetch<{ group_id: string }>(apiRoutes.joinGroup, {
      method: 'POST',
      body: { invite_code: inviteCode.value },
    })

    await navigateTo(`/leagues/${result.group_id}`)
  } catch (error) {
    hasAttemptedJoin.value = false
    joinError.value = fetchErrorMessage(error)
    statusMessage.value = 'Could not join league'
  }
}

watch(
  () => [user.value, inviteCode.value] as const,
  () => {
    if (inviteCode.value) {
      attemptJoin()
    }
  },
  { immediate: true },
)
</script>
