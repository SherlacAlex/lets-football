import type { FixtureQuestion } from '~/types/questions'

export type AnswerValue = string | boolean | null | undefined

export function stringifyAnswer(value: AnswerValue): string {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value).trim()
}

export function isQuestionUnanswered(
  question: FixtureQuestion,
  value: AnswerValue,
): boolean {
  const type = question.question_template.answer_type

  if (type === 'TEAM') {
    return value == null
  }

  if (type === 'BOOLEAN') {
    return typeof value !== 'boolean'
  }

  if (type === 'NUMBER') {
    if (value == null || value === '') return true
    return String(value).trim() === ''
  }

  if (value == null) return true
  if (typeof value === 'boolean') return false
  if (value === '') return true
  return String(value).trim() === ''
}

export function isScoreMissing(
  predictedHomeScore: number | null,
  predictedAwayScore: number | null,
): boolean {
  if (predictedHomeScore == null || predictedAwayScore == null) return true
  return Number.isNaN(predictedHomeScore) || Number.isNaN(predictedAwayScore)
}

export function validatePredictionForm(
  predictedHomeScore: number | null,
  predictedAwayScore: number | null,
  questions: FixtureQuestion[],
  answers: Record<string, AnswerValue>,
): string | null {
  if (isScoreMissing(predictedHomeScore, predictedAwayScore)) {
    return 'Please enter your predicted score for both teams.'
  }

  if (questions.length === 0) {
    return null
  }

  const unansweredCount = questions.filter((q) =>
    isQuestionUnanswered(q, answers[q.id]),
  ).length

  if (unansweredCount > 0) {
    return `Please answer all ${questions.length} questions before saving.`
  }

  return null
}
