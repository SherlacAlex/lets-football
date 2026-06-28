<template>
  <Teleport to="body">
    <div v-if="open && fixture" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog"
      aria-modal="true" :aria-labelledby="titleId">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close" />

      <div
        class="relative w-full max-w-lg max-h-[90dvh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 shrink-0">
          <h2 :id="titleId" class="text-lg font-extrabold text-white">
            Predictions
          </h2>
          <button type="button"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close" @click="close">
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>
        <div
          v-if="fixture.group_name === 'KO'"
          class="mx-4 mt-3 sm:mx-6 sm:mt-4 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-200/90 text-sm flex items-start gap-2 shrink-0">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <p>
            If a match goes to extra time, the score at the end of extra time is used as the final score.
            Penalty shootouts are not counted.
          </p>
        </div>
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div v-if="formMessage" :class="[
            formMessageType === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400',
            'p-3 rounded-2xl border text-sm',
          ]">
            {{ formMessage }}
          </div>

          <div :class="matchResultCardClass">
            <div class="flex items-center justify-between gap-2">
              <div class="min-w-0">
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Match result
                </p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ formatMatchDate(fixture.match_date) }}
                  <template v-if="fixture.group_name"> &bull; {{ fixture.group_name }}</template>
                </p>
              </div>
              <span v-if="canEditPredictions" class="text-xs font-bold text-emerald-400 shrink-0">
                Up to 5 pts
              </span>
              <span v-else-if="existingPrediction && scorePointsEarned != null" class="text-xs font-bold shrink-0"
                :class="isScoreCorrect ? 'text-emerald-400' : 'text-slate-500'">
                {{ scorePointsEarned }} {{ scorePointsEarned === 1 ? 'pt' : 'pts' }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-2 sm:gap-4">
              <FixtureTeamDisplay :team="fixture.home_team" align="home" />

              <div class="flex flex-col items-center gap-2 shrink-0 min-w-[5.5rem]">
                <div v-if="hasFinalScore" class="text-center">
                  <p class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                    Final
                  </p>
                  <p class="text-xl sm:text-2xl font-bold text-white tabular-nums leading-none">
                    {{ fixture.home_score }} – {{ fixture.away_score }}
                  </p>
                </div>

                <div v-if="canEditPredictions" class="w-full text-center rounded-xl px-3 py-2 border"
                  :class="predictionInputClass">
                  <p class="text-[10px] uppercase tracking-wider font-semibold mb-2 text-slate-400">
                    Predicted
                  </p>
                  <div class="flex items-center justify-center gap-2">
                    <input v-model.number="predictedHomeScore" type="number" min="0" placeholder="0"
                      class="w-11 h-11 sm:w-12 sm:h-12 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-base text-white focus:outline-none" />
                    <span class="text-slate-600 font-bold">-</span>
                    <input v-model.number="predictedAwayScore" type="number" min="0" placeholder="0"
                      class="w-11 h-11 sm:w-12 sm:h-12 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-base text-white focus:outline-none" />
                  </div>
                </div>

                <div v-else-if="existingPrediction" class="w-full text-center rounded-xl px-3 py-2 border"
                  :class="predictionScoreClass">
                  <p class="text-[10px] uppercase tracking-wider font-semibold mb-1">
                    Predicted
                  </p>
                  <p class="text-lg sm:text-xl font-bold tabular-nums leading-none">
                    {{ existingPrediction.home_score }} – {{ existingPrediction.away_score }}
                  </p>
                </div>

                <p v-else class="text-xs text-slate-500 text-center">
                  Not predicted
                </p>
              </div>

              <FixtureTeamDisplay :team="fixture.away_team" align="away" />
            </div>
          </div>

          <div v-if="!questions.length" class="text-center py-6 text-slate-400 text-sm">
            No bonus questions for this match.
          </div>

          <ol v-else class="space-y-3 list-none p-0 m-0">
            <li v-for="(question, index) in questions" :key="question.id" :class="questionCardClass(question)">
              <div class="flex items-start gap-3">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400">
                  {{ index + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      class="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {{ question.points }} {{ question.points === 1 ? 'pt' : 'pts' }}
                    </span>
                    <span v-if="!canEditPredictions && isQuestionCorrect(question)"
                      class="inline-flex px-2 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      +{{ getQuestionPointsEarned(question) }} earned
                    </span>
                  </div>
                  <p class="text-sm text-slate-200 leading-relaxed">
                    {{ question.question_template.question }}
                  </p>
                  <FixtureQuestionAnswer v-model="answers[question.id]" :question="question" :fixture="fixture"
                    :disabled="!canEditPredictions" :is-correct="!canEditPredictions && isQuestionCorrect(question)"
                    :has-error="questionHasError(question.id)" />
                </div>
              </div>
            </li>
          </ol>
        </div>

        <div
          class="shrink-0 flex items-center justify-end gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-900/95">
          <button type="button"
            class="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            :disabled="saving" @click="close">
            {{ canEditPredictions ? 'Cancel' : 'Close' }}
          </button>
          <button v-if="canEditPredictions" type="button"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitDisabled" @click="submit">
            {{ saving ? 'Saving…' : hasExistingPrediction ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { FixtureListItem } from '~/types/fixtures'
import type { FixtureQuestion } from '~/types/questions'
import type { Prediction, PredictFixtureRequest, PredictionAnswer } from '~/types/predictions'
import { apiRoutes } from '~/utils/api'
import { formatMatchDate, isPredictionLocked } from '~/utils/fixtures'
import {
  isQuestionUnanswered,
  isScoreMissing,
  parseAnswerValue,
  stringifyAnswer,
  validatePredictionForm,
} from '~/utils/predictions'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  fixture: FixtureListItem | null
  existingPrediction: Prediction | null
}>()

const titleId = 'fixture-predictions-dialog-title'

const dashboardStore = useDashboardStore()
const requestFetch = useRequestFetch()

const questions = ref<FixtureQuestion[]>([])
const answers = ref<Record<string, string | boolean>>({})
const savedUserAnswers = ref<PredictionAnswer[]>([])
const predictedHomeScore = ref<number | null>(null)
const predictedAwayScore = ref<number | null>(null)
const hasExistingPrediction = ref(false)

type FormSnapshot = {
  predictedHomeScore: number | null
  predictedAwayScore: number | null
  answers: Record<string, string>
}

const savedFormSnapshot = ref<FormSnapshot | null>(null)
const saving = ref(false)
const formMessage = ref('')
const formMessageType = ref<'success' | 'error'>('success')
const showValidationErrors = ref(false)

function questionHasError(questionId: string) {
  if (!showValidationErrors.value) return false
  const question = questions.value.find((q) => q.id === questionId)
  if (!question) return false
  return isQuestionUnanswered(question, answers.value[questionId])
}

const scoreHasError = computed(
  () =>
    showValidationErrors.value &&
    isScoreMissing(predictedHomeScore.value, predictedAwayScore.value),
)

const canEditPredictions = computed(() => {
  if (!props.fixture?.can_predict) return false
  return !isPredictionLocked(props.fixture)
})

const hasFinalScore = computed(
  () =>
    props.fixture?.status === 'completed' &&
    props.fixture.home_score != null &&
    props.fixture.away_score != null,
)

const scorePointsEarned = computed(
  () => props.existingPrediction?.points_earned ?? null,
)

const isScoreCorrect = computed(
  () => scorePointsEarned.value != null && scorePointsEarned.value > 0,
)

const matchResultCardClass = computed(() => {
  const base = 'rounded-2xl p-4 space-y-3 border'
  if (canEditPredictions.value) {
    return `${base} bg-slate-950/50 ${scoreHasError.value ? 'border-rose-500' : 'border-slate-800'}`
  }
  return isScoreCorrect.value
    ? `${base} bg-emerald-500/5 border-emerald-500/40`
    : `${base} bg-slate-950/50 border-slate-800`
})

const predictionScoreClass = computed(() =>
  isScoreCorrect.value
    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
    : 'bg-slate-950/80 border-slate-800 text-slate-300',
)

const predictionInputClass = computed(() =>
  scoreHasError.value
    ? 'bg-slate-950/80 border-rose-500'
    : 'bg-slate-950/80 border-slate-800',
)

function getQuestionPointsEarned(question: FixtureQuestion): number | null {
  const saved = savedUserAnswers.value.find(
    (answer) => answer.question_template_id === question.question_template.id,
  )
  return saved?.points_earned ?? null
}

function isQuestionCorrect(question: FixtureQuestion): boolean {
  const points = getQuestionPointsEarned(question)
  return points != null && points > 0
}

function questionCardClass(question: FixtureQuestion) {
  const base = 'rounded-2xl p-4'
  if (!canEditPredictions.value && isQuestionCorrect(question)) {
    return `${base} bg-emerald-500/5 border border-emerald-500/40`
  }
  return `${base} bg-slate-950/50 border border-slate-800`
}

function resetForm() {
  questions.value = []
  answers.value = {}
  savedUserAnswers.value = []
  predictedHomeScore.value = null
  predictedAwayScore.value = null
  hasExistingPrediction.value = false
  savedFormSnapshot.value = null
  formMessage.value = ''
  showValidationErrors.value = false
}

function captureFormSnapshot() {
  savedFormSnapshot.value = {
    predictedHomeScore: predictedHomeScore.value,
    predictedAwayScore: predictedAwayScore.value,
    answers: Object.fromEntries(
      questions.value.map((q) => [q.id, stringifyAnswer(answers.value[q.id])]),
    ),
  }
}

const hasFormChanges = computed(() => {
  const snapshot = savedFormSnapshot.value
  if (!snapshot) return true

  if (predictedHomeScore.value !== snapshot.predictedHomeScore) return true
  if (predictedAwayScore.value !== snapshot.predictedAwayScore) return true

  return questions.value.some(
    (q) => stringifyAnswer(answers.value[q.id]) !== snapshot.answers[q.id],
  )
})

const isSubmitDisabled = computed(
  () => saving.value || (hasExistingPrediction.value && !hasFormChanges.value),
)

function applyExistingPrediction(prediction: Prediction | null) {
  if (!prediction) {
    predictedHomeScore.value = null
    predictedAwayScore.value = null
    hasExistingPrediction.value = false
    return
  }

  hasExistingPrediction.value = true
  predictedHomeScore.value = prediction.home_score
  predictedAwayScore.value = prediction.away_score
}

function applyExistingAnswers(savedAnswers: { question_template_id: string; answer_value: string }[]) {
  const answerByTemplateId = new Map(
    savedAnswers.map((answer) => [answer.question_template_id, answer.answer_value]),
  )
  const nextAnswers: Record<string, string | boolean> = {}

  for (const question of questions.value) {
    const raw = answerByTemplateId.get(question.question_template.id) ?? ''
    nextAnswers[question.id] = parseAnswerValue(
      question.question_template.answer_type,
      raw,
    )
  }

  answers.value = nextAnswers
}

function loadDialogData() {
  if (!props.fixture) return

  formMessage.value = ''
  questions.value = dashboardStore.getQuestionsForFixture(props.fixture.id)
  savedUserAnswers.value = dashboardStore.getAnswersForFixture(props.fixture.id)
  applyExistingAnswers(savedUserAnswers.value)
  applyExistingPrediction(props.existingPrediction ?? null)

  if (hasExistingPrediction.value) {
    captureFormSnapshot()
  } else {
    savedFormSnapshot.value = null
  }
}

async function submit() {
  if (!props.fixture || !canEditPredictions.value) return

  const validationError = validatePredictionForm(
    predictedHomeScore.value,
    predictedAwayScore.value,
    questions.value,
    answers.value,
  )

  if (validationError) {
    showValidationErrors.value = true
    formMessage.value = validationError
    formMessageType.value = 'error'
    return
  }

  showValidationErrors.value = false

  const payload: PredictFixtureRequest = {
    home_score: predictedHomeScore.value as number,
    away_score: predictedAwayScore.value as number,
    answers: questions.value.map((q) => ({
      question_template_id: q.question_template.id,
      answer_value: stringifyAnswer(answers.value[q.id]),
    })),
  }

  saving.value = true
  formMessage.value = ''

  try {
    await requestFetch(apiRoutes.predictFixture(props.fixture.id), {
      method: 'POST',
      body: payload,
    })

    const prediction: Prediction = {
      home_score: payload.home_score,
      away_score: payload.away_score,
    }

    dashboardStore.setPredictionForFixture(props.fixture.id, prediction, payload.answers)
    captureFormSnapshot()
    hasExistingPrediction.value = true
    formMessage.value = 'Predictions saved successfully!'
    formMessageType.value = 'success'

    setTimeout(() => {
      close()
    }, 800)
  } catch (err: any) {
    formMessage.value = err.data?.message ? err.data.message : 'Failed to save predictions.'
    formMessageType.value = 'error'
  } finally {
    saving.value = false
  }
}

watch(
  () => [open.value, props.fixture?.id, props.existingPrediction] as const,
  ([isOpen, fixtureId]) => {
    if (isOpen && fixtureId) {
      loadDialogData()
    } else if (!isOpen) {
      resetForm()
    }
  },
)

function close() {
  open.value = false
}
</script>
