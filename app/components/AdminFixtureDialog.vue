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
        class="relative w-full max-w-lg max-h-[90dvh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl"
      >
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 shrink-0">
          <h2 :id="titleId" class="text-lg font-extrabold text-white">
            Manage Results
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

        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
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
          </div>

          <div :class="scoreResultClass">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-semibold text-slate-200">Match result</p>
            </div>
            <div class="flex items-center justify-center gap-3">
              <input
                v-model.number="actualHomeScore"
                type="number"
                min="0"
                placeholder="0"
                class="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-base sm:text-lg text-white focus:outline-none"
              />
              <span class="text-slate-600 font-bold">-</span>
              <input
                v-model.number="actualAwayScore"
                type="number"
                min="0"
                placeholder="0"
                class="w-12 h-12 sm:w-14 sm:h-14 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-base sm:text-lg text-white focus:outline-none"
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
        </div>

        <div class="shrink-0 flex items-center justify-end gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-900/95">
          <button
            type="button"
            class="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            :disabled="saving"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitDisabled"
            @click="submit"
          >
            {{ saving ? 'Saving…' : hasExistingResult ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { AdminFixtureListItem, AdminFixtureQuestion } from '~/types/AdminDashboardFixture'
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
  fixture: AdminFixtureListItem | null
  existingResult: { home_score: number; away_score: number } | null
}>()

const titleId = 'admin-fixture-dialog-title'

const adminDashboardStore = useAdminDashboardStore()
const requestFetch = useRequestFetch()

const questions = ref<AdminFixtureQuestion[]>([])
const answers = ref<Record<string, string | boolean>>({})
const actualHomeScore = ref<number | null>(null)
const actualAwayScore = ref<number | null>(null)
const hasExistingResult = ref(false)

type FormSnapshot = {
  actualHomeScore: number | null
  actualAwayScore: number | null
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
    isScoreMissing(actualHomeScore.value, actualAwayScore.value),
)

const scoreResultClass = computed(() => [
  'bg-slate-950/50 border rounded-2xl p-4 space-y-3',
  scoreHasError.value ? 'border-rose-500' : 'border-slate-800',
])

function resetForm() {
  questions.value = []
  answers.value = {}
  actualHomeScore.value = null
  actualAwayScore.value = null
  hasExistingResult.value = false
  savedFormSnapshot.value = null
  formMessage.value = ''
  showValidationErrors.value = false
}

function captureFormSnapshot() {
  savedFormSnapshot.value = {
    actualHomeScore: actualHomeScore.value,
    actualAwayScore: actualAwayScore.value,
    answers: Object.fromEntries(
      questions.value.map((q) => [q.id, stringifyAnswer(answers.value[q.id])]),
    ),
  }
}

const hasFormChanges = computed(() => {
  const snapshot = savedFormSnapshot.value
  if (!snapshot) return true

  if (actualHomeScore.value !== snapshot.actualHomeScore) return true
  if (actualAwayScore.value !== snapshot.actualAwayScore) return true

  return questions.value.some(
    (q) => stringifyAnswer(answers.value[q.id]) !== snapshot.answers[q.id],
  )
})

const isSubmitDisabled = computed(
  () => saving.value || (hasExistingResult.value && !hasFormChanges.value),
)

function applyExistingResult(result: { home_score: number; away_score: number } | null) {
  if (!result) {
    actualHomeScore.value = null
    actualAwayScore.value = null
    hasExistingResult.value = false
    return
  }

  hasExistingResult.value = true
  actualHomeScore.value = result.home_score
  actualAwayScore.value = result.away_score
}

function applyExistingAnswers(savedQuestions: AdminFixtureQuestion[]) {
  const nextAnswers: Record<string, string | boolean> = {}

  for (const question of savedQuestions) {
    nextAnswers[question.id] = parseAnswerValue(
      question.question_template.answer_type,
      question.correct_answer ?? '',
    )
  }

  answers.value = nextAnswers
}

function loadDialogData() {
  if (!props.fixture) return

  formMessage.value = ''
  questions.value = adminDashboardStore.getQuestionsForFixture(props.fixture.id)
  applyExistingAnswers(questions.value)
  applyExistingResult(props.existingResult ?? null)

  if (hasExistingResult.value) {
    captureFormSnapshot()
  } else {
    savedFormSnapshot.value = null
  }
}

async function submit() {
  if (!props.fixture) return

  const validationError = validatePredictionForm(
    actualHomeScore.value,
    actualAwayScore.value,
    questions.value,
    answers.value,
  )

  if (validationError) {
    showValidationErrors.value = true
    formMessage.value = validationError.replace('predicted', 'actual')
    formMessageType.value = 'error'
    return
  }

  showValidationErrors.value = false

  const homeScore = actualHomeScore.value as number
  const awayScore = actualAwayScore.value as number
  const answerPayload = questions.value.map((q) => ({
    question_template_id: q.question_template.id,
    correct_answer: stringifyAnswer(answers.value[q.id]),
  }))

  saving.value = true
  formMessage.value = ''

  try {
    await requestFetch(apiRoutes.adminFixtureResult(props.fixture.id), {
      method: 'POST',
      body: { home_score: homeScore, away_score: awayScore },
    })

    if (answerPayload.length) {
      await requestFetch(apiRoutes.adminFixtureAnswers(props.fixture.id), {
        method: 'POST',
        body: { answers: answerPayload },
      })
    }

    await $fetch(apiRoutes.adminFixtureCalculate(props.fixture.id), {
        method: "POST",
    });

    adminDashboardStore.setResultForFixture(
      props.fixture.id,
      homeScore,
      awayScore,
      answerPayload,
    )
    captureFormSnapshot()
    hasExistingResult.value = true
    formMessage.value = 'Results saved successfully!'
    formMessageType.value = 'success'

    setTimeout(() => {
      close()
    }, 800)
  } catch (err) {
    formMessage.value =
      err instanceof Error ? err.message : 'Failed to save results.'
    formMessageType.value = 'error'
  } finally {
    saving.value = false
  }
}

watch(
  () => [open.value, props.fixture?.id, props.existingResult] as const,
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
