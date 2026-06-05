<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-center gap-4">
      <NuxtLink
        to="/leagues"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to leagues
      </NuxtLink>
    </div>

    <div
      v-if="groupError"
      class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2"
    >
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
      <span>Could not load league. {{ groupError.message }}</span>
    </div>

    <div
      v-if="groupPending"
      class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 animate-pulse"
    >
      <div class="h-8 bg-slate-800 rounded w-1/3 mb-4" />
      <div class="space-y-3">
        <div v-for="n in 6" :key="n" class="h-10 bg-slate-800/60 rounded-xl" />
      </div>
    </div>

    <template v-else-if="groupDetail">
      <div class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div class="absolute -right-16 -top-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl" />
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
              {{ groupDetail.group.name }}
            </h1>
            <p class="text-slate-400 text-sm mt-2">
              {{ groupDetail.ranking.length }}
              {{ groupDetail.ranking.length === 1 ? 'member' : 'members' }}
            </p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Invite code</p>
            <p class="text-lg font-black tracking-[0.15em] text-emerald-400 mt-1">
              {{ groupDetail.invite_code }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th class="px-6 py-4 font-semibold w-16">#</th>
                <th class="px-6 py-4 font-semibold">Player</th>
                <th class="px-6 py-4 font-semibold text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!groupDetail.ranking.length">
                <td colspan="3" class="px-6 py-12 text-center text-slate-500 text-sm">
                  No members found.
                </td>
              </tr>
              <tr
                v-for="member in groupDetail.ranking"
                :key="member.id"
                :class="[
                  'border-b border-slate-800/80 last:border-0 transition-colors cursor-pointer',
                  isCurrentUser(member.id)
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                    : 'hover:bg-slate-800/20',
                ]"
                @click="openMember(member.id)"
              >
                <td class="px-6 py-4 font-bold text-slate-400 tabular-nums">
                  {{ member.rank }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'font-semibold',
                      isCurrentUser(member.id) ? 'text-emerald-400' : 'text-white',
                    ]"
                  >
                    {{ member.display_name || member.username }}
                    <span v-if="isCurrentUser(member.id)" class="text-xs font-normal text-slate-500">
                      (you)
                    </span>
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-bold text-indigo-400 tabular-nums">
                  {{ member.total_points }}
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

function isCurrentUser(memberUserId: string): boolean {
  const currentId = user.value?.id ?? user.value?.sub
  return Boolean(currentId && currentId === memberUserId)
}

function openMember(userId: string) {
  navigateTo(`/leagues/${groupId.value}/members/${userId}`)
}

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})
</script>
