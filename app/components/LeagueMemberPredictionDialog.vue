<template>
  <Teleport to="body">
    <div
      v-if="open && fixtureId"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-prediction-title"
    >
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close" />

      <div
        class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <h2 id="member-prediction-title" class="text-lg font-extrabold text-white">
            Match prediction
          </h2>
          <button
            type="button"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
            @click="close"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-5">
          <div
            v-if="detailError"
            class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm"
          >
            Could not load prediction. {{ detailError }}
          </div>

          <div v-else-if="detailPending" class="py-8 text-center text-slate-500 text-sm">
            Loading…
          </div>

          <template v-else-if="detail">
            <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-3">
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Actual result</p>
              <p class="text-2xl font-bold text-white text-center tabular-nums">
                <template v-if="detail.actual_result">
                  {{ detail.actual_result.home_score }} – {{ detail.actual_result.away_score }}
                </template>
                <template v-else>—</template>
              </p>
            </div>

            <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold text-slate-200">Score prediction</p>
                <span
                  v-if="detail.score_prediction"
                  class="text-xs font-bold text-emerald-400"
                >
                  {{ detail.score_prediction.points_earned }} pts
                </span>
              </div>
              <p class="text-2xl font-bold text-white text-center tabular-nums">
                <template v-if="detail.score_prediction">
                  {{ detail.score_prediction.home_score }} – {{ detail.score_prediction.away_score }}
                </template>
                <template v-else>
                  <span class="text-slate-500 text-base font-normal">No prediction</span>
                </template>
              </p>
            </div>

            <div v-if="detail.answers.length" class="space-y-3">
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bonus answers</p>
              <div
                v-for="(answer, index) in detail.answers"
                :key="index"
                class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4"
              >
                <div class="flex items-center justify-between gap-2 mb-2">
                  <p class="text-sm text-slate-200">{{ answer.question_template.question }}</p>
                  <span class="text-xs font-bold text-emerald-400 shrink-0">
                    {{ answer.points_earned }} pts
                  </span>
                </div>
                <p class="text-sm font-semibold text-white">{{ answer.answer_value }}</p>
              </div>
            </div>
          </template>
        </div>

        <div class="shrink-0 px-6 py-4 border-t border-slate-800 bg-slate-900/95">
          <button
            type="button"
            class="w-full px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { MemberFixturePredictionDetail } from '~/types/groups'
import { apiRoutes } from '~/utils/api'
import { fetchErrorMessage } from '~/utils/groups'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  groupId: string
  userId: string
  fixtureId: string | null
}>()

const requestFetch = useRequestFetch()

const detail = ref<MemberFixturePredictionDetail | null>(null)
const detailPending = ref(false)
const detailError = ref('')

async function loadDetail() {
  if (!props.fixtureId) {
    return
  }

  detailPending.value = true
  detailError.value = ''
  detail.value = null

  try {
    detail.value = await requestFetch<MemberFixturePredictionDetail>(
      apiRoutes.memberFixturePrediction(props.groupId, props.userId, props.fixtureId),
    )
  } catch (error) {
    detailError.value = fetchErrorMessage(error)
  } finally {
    detailPending.value = false
  }
}

watch(
  () => [open.value, props.fixtureId] as const,
  ([isOpen, fixtureId]) => {
    if (isOpen && fixtureId) {
      loadDetail()
    } else if (!isOpen) {
      detail.value = null
      detailError.value = ''
    }
  },
)

function close() {
  open.value = false
}
</script>
