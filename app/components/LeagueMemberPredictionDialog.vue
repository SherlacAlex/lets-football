<template>
  <Teleport to="body">
    <div v-if="open && fixtureId" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog" aria-modal="true" aria-labelledby="member-prediction-title">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close" />

      <div
        class="relative w-full max-w-lg max-h-[90dvh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 shrink-0">
          <h2 id="member-prediction-title" class="text-lg font-extrabold text-white">
            Match prediction
          </h2>
          <button type="button"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close" @click="close">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div v-if="detailError"
            class="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm">
            Could not load prediction. {{ detailError }}
          </div>

          <div v-else-if="detailPending" class="py-8 text-center text-slate-500 text-sm">
            Loading…
          </div>

          <template v-else-if="detail">
            <div :class="matchResultCardClass(detail)">
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Match result
                </p>
                <span
                  v-if="detail.score_prediction"
                  class="text-xs font-bold shrink-0"
                  :class="isScoreCorrect(detail) ? 'text-emerald-400' : 'text-slate-500'"
                >
                  {{ detail.score_prediction.points_earned }}
                  {{ detail.score_prediction.points_earned === 1 ? 'pt' : 'pts' }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-2 sm:gap-4">
                <FixtureTeamDisplay :team="toTeam(detail.home_team)" align="home" />

                <div class="flex flex-col items-center gap-2 shrink-0 min-w-[5.5rem]">
                  <div class="text-center">
                    <p class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                      Final
                    </p>
                    <p class="text-xl sm:text-2xl font-bold text-white tabular-nums leading-none">
                      <template v-if="detail.actual_result">
                        {{ detail.actual_result.home_score }} – {{ detail.actual_result.away_score }}
                      </template>
                      <template v-else>—</template>
                    </p>
                  </div>

                  <div
                    v-if="detail.score_prediction"
                    class="w-full text-center rounded-xl px-3 py-2 border"
                    :class="predictionScoreClass(detail)"
                  >
                    <p class="text-[10px] uppercase tracking-wider font-semibold mb-1">
                      Predicted
                    </p>
                    <p class="text-lg sm:text-xl font-bold tabular-nums leading-none">
                      {{ detail.score_prediction.home_score }} – {{ detail.score_prediction.away_score }}
                    </p>
                  </div>
                  <p v-else class="text-xs text-slate-500 text-center">
                    Not predicted
                  </p>
                </div>

                <FixtureTeamDisplay :team="toTeam(detail.away_team)" align="away" />
              </div>
            </div>

            <div v-if="detail.answers.length" class="space-y-3">
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bonus answers</p>
              <div
                v-for="{ answer, team } in enrichedAnswers"
                :key="answer.question_template.code + answer.answer_value"
                :class="answerCardClass(answer)"
              >
                <div class="flex items-center justify-between gap-2 mb-2">
                  <p class="text-sm text-slate-200">{{ answer.question_template.question }}</p>
                  <span
                    class="text-xs font-bold shrink-0"
                    :class="isAnswerCorrect(answer) ? 'text-emerald-400' : 'text-slate-500'"
                  >
                    {{ answer.points_earned }} pts
                  </span>
                </div>
                <p
                  v-if="isEmptyAnswer(answer)"
                  class="text-sm font-semibold text-slate-500"
                >
                  NONE
                </p>
                <div
                  v-else-if="team"
                  class="flex items-center gap-2.5"
                  :class="isAnswerCorrect(answer) ? 'text-emerald-400' : 'text-white'"
                >
                  <div class="w-8 h-8 shrink-0 flex items-center justify-center">
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
                  <span class="text-sm font-semibold">{{ team.name }}</span>
                </div>
                <p
                  v-else
                  class="text-sm font-semibold"
                  :class="isAnswerCorrect(answer) ? 'text-emerald-400' : 'text-white'"
                >
                  {{ formatAnswerDisplay(answer) }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <div class="shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-900/95">
          <button type="button"
            class="w-full px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            @click="close">
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { MemberFixturePredictionDetail } from '~/types/groups'
import type { Team } from '~/types/fixtures'
import { apiRoutes } from '~/utils/api'
import { fetchErrorMessage } from '~/utils/groups'
import { formatPredictionAnswerDisplay } from '~/utils/predictions'

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

const enrichedAnswers = computed(() => {
  if (!detail.value) {
    return []
  }

  return detail.value.answers.map((answer) => ({
    answer,
    team: resolveAnswerTeam(answer, detail.value!),
  }))
})

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

type PredictionAnswer = MemberFixturePredictionDetail['answers'][number]

function isScoreCorrect(data: MemberFixturePredictionDetail) {
  return (data.score_prediction?.points_earned ?? 0) > 0
}

function isAnswerCorrect(answer: PredictionAnswer) {
  return answer.points_earned > 0
}

function isEmptyAnswer(answer: PredictionAnswer) {
  return !answer.answer_value?.trim()
}

function matchResultCardClass(data: MemberFixturePredictionDetail) {
  const base = 'rounded-2xl p-4 space-y-3'
  return isScoreCorrect(data)
    ? `${base} bg-emerald-500/5 border border-emerald-500/40`
    : `${base} bg-slate-950/50 border border-slate-800`
}

function predictionScoreClass(data: MemberFixturePredictionDetail) {
  return isScoreCorrect(data)
    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
    : 'bg-slate-950/80 border-slate-800 text-slate-300'
}

function answerCardClass(answer: PredictionAnswer) {
  const base = 'rounded-2xl p-4'
  return isAnswerCorrect(answer)
    ? `${base} bg-emerald-500/5 border border-emerald-500/40`
    : `${base} bg-slate-950/50 border border-slate-800`
}

type FixtureTeam = MemberFixturePredictionDetail['home_team']

function toTeam(team: FixtureTeam): Team {
  return {
    id: team.id,
    name: team.name,
    short_name: team.name,
    fifa_code: team.fifa_code,
    flag_url: team.flag_url,
  }
}

function resolveAnswerTeam(
  answer: PredictionAnswer,
  data: MemberFixturePredictionDetail,
): Team | null {
  if (!answer.answer_value?.trim()) {
    return null
  }

  if (answer.question_template.answer_type !== 'TEAM') {
    return null
  }

  if (answer.answer_value === data.home_team.id) {
    return toTeam(data.home_team)
  }

  if (answer.answer_value === data.away_team.id) {
    return toTeam(data.away_team)
  }

  return null
}

function formatAnswerDisplay(answer: PredictionAnswer) {
  return formatPredictionAnswerDisplay(
    answer.answer_value,
    answer.question_template.answer_type,
    detail.value?.home_team,
    detail.value?.away_team,
  )
}

function close() {
  open.value = false
}
</script>
