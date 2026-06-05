<template>
  <Teleport to="body">
    <div
      v-if="open && fixture"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close" />

      <div
        class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl"
      >
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <h2 :id="titleId" class="text-lg font-extrabold text-white">
            Predictions
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

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div
            v-if="formMessage"
            :class="[
              formMessageType === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400',
              'p-3 rounded-2xl border text-sm',
            ]"
          >
            {{ formMessage }}
          </div>

          <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
            <p class="text-xs text-slate-500 mb-3">
              {{ formatMatchDate(fixture.match_date) }}
              <template v-if="fixture.group_name"> &bull; {{ fixture.group_name }}</template>
            </p>
            <div class="flex items-center justify-between gap-4">
              <FixtureTeamDisplay :team="fixture.home_team" align="home" />
              <FixtureScoreDisplay
                :home-score="fixture.home_score"
                :away-score="fixture.away_score"
              />
              <FixtureTeamDisplay :team="fixture.away_team" align="away" />
            </div>
            <p class="text-xs text-slate-500 mt-3 text-center">Actual match score</p>
          </div>

          <template v-if="canEditPredictions">
            <div :class="scorePredictionClass">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold text-slate-200">Your score prediction</p>
                <span class="text-xs font-bold text-emerald-400">2 pts</span>
              </div>
              <div class="flex items-center justify-center gap-3">
                <input
                  v-model.number="predictedHomeScore"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-14 h-14 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-lg text-white focus:outline-none"
                />
                <span class="text-slate-600 font-bold">-</span>
                <input
                  v-model.number="predictedAwayScore"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-14 h-14 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-lg text-white focus:outline-none"
                />
              </div>
            </div>

            <div v-if="!questions.length" class="text-center py-6 text-slate-400 text-sm">
              No bonus questions for this match.
            </div>

            <ol v-else class="space-y-3 list-none p-0 m-0">
              <li
                v-for="(question, index) in questions"
                :key="question.id"
                class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400"
                  >
                    {{ index + 1 }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        class="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        {{ question.points }} {{ question.points === 1 ? 'pt' : 'pts' }}
                      </span>
                    </div>
                    <p class="text-sm text-slate-200 leading-relaxed">
                      {{ question.question_template.question }}
                    </p>
                    <FixtureQuestionAnswer
                      v-model="answers[question.id]"
                      :question="question"
                      :fixture="fixture"
                      :has-error="questionHasError(question.id)"
                    />
                  </div>
                </div>
              </li>
            </ol>
          </template>

          <div
            v-else-if="existingPrediction"
            class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-center"
          >
            <p class="text-xs text-slate-500 mb-2">Your prediction</p>
            <p class="text-2xl font-bold text-white tabular-nums">
              {{ existingPrediction.home_score }} – {{ existingPrediction.away_score }}
            </p>
            <p class="text-xs text-slate-500 mt-2">Predictions are locked for this match.</p>
          </div>
        </div>

        <div class="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/95">
          <button
            type="button"
            class="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            :disabled="saving"
            @click="close"
          >
            {{ canEditPredictions ? 'Cancel' : 'Close' }}
          </button>
          <button
            v-if="canEditPredictions"
            type="button"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitDisabled"
            @click="submit"
          >
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
import type { Prediction, PredictFixtureRequest } from '~/types/predictions'
import { apiRoutes } from '~/utils/api'
import { formatMatchDate } from '~/utils/fixtures'
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

const scorePredictionClass = computed(() => [
  'bg-slate-950/50 border rounded-2xl p-4 space-y-3',
  scoreHasError.value ? 'border-rose-500' : 'border-slate-800',
])

const canEditPredictions = computed(() => props.fixture?.can_predict ?? false)

function resetForm() {
  questions.value = []
  answers.value = {}
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
  applyExistingAnswers(dashboardStore.getAnswersForFixture(props.fixture.id))
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
  } catch (err) {
    formMessage.value =
      err instanceof Error ? err.message : 'Failed to save predictions.'
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
