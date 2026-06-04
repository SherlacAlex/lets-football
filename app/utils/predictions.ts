import type { FixtureQuestion } from '~/types/questions'

export type AnswerValue = string | boolean | null | undefined

export function stringifyAnswer(value: AnswerValue): string {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value).trim()
}

export function validatePredictionForm(
  predictedHomeScore: number | null,
  predictedAwayScore: number | null,
  questions: FixtureQuestion[],
  answers: Record<string, AnswerValue>,
): string | null {
  if (predictedHomeScore == null || predictedAwayScore == null) {
    return 'Please enter your predicted score for both teams.'
  }

  if (questions.length === 0) {
    return null
  }

  const unansweredCount = questions.filter((q) => {
    const value = answers[q.id]
    if (value == null) return true
    if (typeof value === 'boolean') return false
    if (value === '') return true
    return String(value).trim() === ''
  }).length

  if (unansweredCount > 0) {
    return `Please answer all ${questions.length} questions before saving.`
  }

  return null
}
