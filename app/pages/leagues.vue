<template>
    <div class="space-y-8">
        <div
            class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div class="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Leagues</h1>
                    <p class="text-slate-400 text-sm mt-2 max-w-xl">
                        Create a private league or join friends with an invite code.
                    </p>
                </div>
                <div class="flex flex-wrap gap-3 shrink-0">
                    <button type="button"
                        class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold rounded-xl active:scale-95 transition-all duration-200"
                        @click="isCreateOpen = true">
                        Create league
                    </button>
                    <button type="button"
                        class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold rounded-xl active:scale-95 transition-all duration-200"
                        @click="isJoinOpen = true">
                        Join league
                    </button>
                </div>
            </div>
        </div>

        <div v-if="leaguesError"
            class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
            <span>Could not load leagues. {{ leaguesError.message }}</span>
        </div>

        <div v-if="leaguesPending" class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 animate-pulse">
            <div class="h-4 bg-slate-800 rounded w-1/4 mb-6" />
            <div class="space-y-3">
                <div v-for="n in 3" :key="n" class="h-12 bg-slate-800/60 rounded-xl" />
            </div>
        </div>

        <div v-else-if="!leagues.length"
            class="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
            <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p class="text-slate-400 text-sm">You are not in any leagues yet.</p>
            <p class="text-slate-500 text-xs mt-2">Create one or join with an invite code above.</p>
        </div>

        <div v-else class="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead>
                        <tr class="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                            <th class="px-6 py-4 font-semibold">League</th>
                            <th class="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="league in leagues" :key="league.groupId"
                            class="border-b border-slate-800/80 last:border-0 hover:bg-slate-800/20 transition-colors">
                            <td class="px-6 py-4">
                                <p class="font-semibold text-white">{{ league.name }}</p>
                                <p class="text-xs text-slate-500 mt-0.5">
                                    <span v-if="league.role === 'admin'" class="text-emerald-400">Admin</span>
                                    <span v-else class="capitalize">{{ league.role }}</span>
                                </p>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <NuxtLink :to="`/leagues/${league.groupId}`"
                                    class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors">
                                    <UIcon name="i-heroicons-table-cells" class="w-4 h-4" />
                                    View table
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <LeagueCreateDialog v-model:open="isCreateOpen" @created="refreshLeagues" />
        <LeagueJoinDialog v-model:open="isJoinOpen" @joined="refreshLeagues" />
    </div>
</template>

<script setup lang="ts">
import type { UserLeague } from '~/types/groups'
import { apiRoutes } from '~/utils/api'
import { normalizeUserLeagues } from '~/utils/groups'

definePageMeta({
    layout: 'auth',
})

const user = useSupabaseUser()
const requestFetch = useRequestFetch()

const isCreateOpen = ref(false)
const isJoinOpen = ref(false)

const {
    data: leaguesResponse,
    pending: leaguesPending,
    error: leaguesError,
    refresh: refreshLeagues,
} = await useFetch(apiRoutes.groups, {
    key: 'user-leagues',
    $fetch: requestFetch as typeof $fetch,
    transform: (data) => normalizeUserLeagues(data as { success: boolean; data: UserLeague[] } | null),
})

const leagues = computed((): UserLeague[] => leaguesResponse.value ?? [])

onMounted(() => {
    if (!user.value) {
        navigateTo('/login')
    }
})
</script>
