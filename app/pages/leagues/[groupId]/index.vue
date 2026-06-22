<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center gap-4">
      <NuxtLink to="/leagues"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to leagues
      </NuxtLink>
    </div>

    <div v-if="groupError"
      class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
      <span>Could not load league. {{ groupError.message }}</span>
    </div>

    <div v-if="groupPending" class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 animate-pulse">
      <div class="h-8 bg-slate-800 rounded w-1/3 mb-4" />
      <div class="space-y-3">
        <div v-for="n in 6" :key="n" class="h-10 bg-slate-800/60 rounded-xl" />
      </div>
    </div>

    <template v-else-if="groupDetail">
      <div
        class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div class="absolute -right-16 -top-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
              {{ groupDetail.group.name }}
            </h1>
            <p class="text-slate-500 text-sm mt-1.5">
              {{ pointsCalculationLabel }}
            </p>
            <p class="text-slate-400 text-sm mt-2">
              {{ groupDetail.ranking.length }}
              {{ groupDetail.ranking.length === 1 ? 'member' : 'members' }}
            </p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Invite code</p>
            <div class="flex items-center gap-1.5 mt-1 justify-start sm:justify-end">
              <p class="text-lg font-black tracking-[0.15em] text-emerald-400">
                {{ groupDetail.invite_code }}
              </p>
              <button type="button"
                class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors shrink-0"
                :aria-label="copiedInviteCode ? 'Copied' : 'Copy invite code'" @click="copyInviteCode">
                <UIcon
                  :name="copiedInviteCode ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard-document'"
                  class="w-5 h-5" />
              </button>
              <button type="button"
                class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors shrink-0"
                :aria-label="sharedInvite ? 'Invite shared' : 'Share invite link'" @click="shareInvite">
                <UIcon :name="sharedInvite ? 'i-heroicons-check' : 'i-heroicons-share'" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="inviteActionMessage" class="text-xs mt-1.5"
              :class="inviteActionError ? 'text-rose-400' : 'text-emerald-400'">
              {{ inviteActionMessage }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left table-fixed sm:table-auto">
            <thead>
              <tr class="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th class="px-3 sm:px-6 py-3 sm:py-4 font-semibold w-10 sm:w-14">#</th>
                <th class="px-3 sm:px-6 py-3 sm:py-4 font-semibold min-w-0">Player</th>
                <th class="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-right w-12 sm:w-16 shrink-0">
                  Pts
                </th>
                <th class="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-right w-[9.25rem] sm:w-44 shrink-0">
                  Predictions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!groupDetail.ranking.length">
                <td colspan="4" class="px-6 py-12 text-center text-slate-500 text-sm">
                  No members found.
                </td>
              </tr>
              <tr v-for="member in groupDetail.ranking" :key="member.id" :class="[
                'border-b border-slate-800/80 last:border-0 transition-colors',
                isCurrentUser(member.id)
                  ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                  : 'hover:bg-slate-800/20',
              ]">
                <td class="px-3 sm:px-6 py-3 sm:py-4 font-bold text-slate-400 tabular-nums">
                  {{ member.rank }}
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 min-w-0">
                  <span :class="[
                    'font-semibold',
                    isCurrentUser(member.id) ? 'text-emerald-400' : 'text-white',
                  ]">
                    {{ member.display_name || member.username }}
                    <span v-if="isCurrentUser(member.id)" class="text-xs font-normal text-slate-500">
                      (you)
                    </span>
                  </span>
                </td>
                <td
                  class="px-3 sm:px-6 py-3 sm:py-4 text-right font-bold text-indigo-400 tabular-nums w-12 sm:w-16 shrink-0">
                  {{ member.total_points }}
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 text-right w-[9.25rem] sm:w-44 shrink-0">
                  <NuxtLink :to="memberPredictionsPath(member.user_id)"
                    class="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-colors whitespace-nowrap"
                    @click.stop>
                    <UIcon name="i-heroicons-eye" class="w-4 h-4 shrink-0" />
                    View Predictions
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { GroupDetailResponse } from '~/types/groups'
import { apiRoutes } from '~/utils/api'
import { normalizeGroupDetail } from '~/utils/groups'
import { copyText, shareLeagueInvite } from '~/utils/leagueInvite'

definePageMeta({
  layout: 'auth',
})

const user = useSupabaseUser()
const requestFetch = useRequestFetch()
const route = useRoute()

const groupId = computed(() => String(route.params.groupId ?? ''))

const {
  data: groupResponse,
  pending: groupPending,
  error: groupError,
} = await useFetch(
  () => apiRoutes.groupDetail(groupId.value),
  {
    key: () => `group-detail-${groupId.value}`,
    $fetch: requestFetch as typeof $fetch,
    watch: [groupId],
    transform: (data) => normalizeGroupDetail(data as GroupDetailResponse | null),
  },
)

const groupDetail = computed(() => groupResponse.value)

const pointsCalculationLabel = computed(() => {
  const group = groupDetail.value?.group
  if (!group) {
    return ''
  }

  if (group.from_start) {
    return 'Points are calculated from the beginning of the tournament'
  }

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(group.created_at))

  return `Points are calculated from ${formattedDate}`
})

useAppSeo({
  title: computed(() => groupDetail.value?.group.name ?? 'League'),
  description: computed(
    () =>
      `FIFA World Cup 2026 prediction league standings for ${groupDetail.value?.group.name ?? 'your league'}.`,
  ),
  noIndex: true,
})

const copiedInviteCode = ref(false)
const sharedInvite = ref(false)
const inviteActionMessage = ref('')
const inviteActionError = ref(false)

let inviteActionResetTimer: ReturnType<typeof setTimeout> | undefined

function resetInviteActionFeedback() {
  clearTimeout(inviteActionResetTimer)
  inviteActionResetTimer = setTimeout(() => {
    copiedInviteCode.value = false
    sharedInvite.value = false
    inviteActionMessage.value = ''
    inviteActionError.value = false
  }, 2500)
}

async function copyInviteCode() {
  const code = groupDetail.value?.invite_code
  if (!code) {
    return
  }

  try {
    await copyText(code)
    copiedInviteCode.value = true
    sharedInvite.value = false
    inviteActionError.value = false
    inviteActionMessage.value = 'Invite code copied'
    resetInviteActionFeedback()
  } catch {
    inviteActionError.value = true
    inviteActionMessage.value = 'Could not copy invite code'
    resetInviteActionFeedback()
  }
}

async function shareInvite() {
  const detail = groupDetail.value
  if (!detail) {
    return
  }

  try {
    const result = await shareLeagueInvite(detail.group.name, detail.invite_code)
    sharedInvite.value = true
    copiedInviteCode.value = false
    inviteActionError.value = false
    inviteActionMessage.value =
      result === 'shared' ? 'Invite shared' : 'Invite link copied to clipboard'
    resetInviteActionFeedback()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return
    }
    inviteActionError.value = true
    inviteActionMessage.value = 'Could not share invite'
    resetInviteActionFeedback()
  }
}

function isCurrentUser(memberUserId: string): boolean {
  const currentId = user.value?.id ?? user.value?.sub
  return Boolean(currentId && currentId === memberUserId)
}

function memberPredictionsPath(userId: string) {
  return `/leagues/${groupId.value}/members/${userId}`
}

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
