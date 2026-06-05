import type { FixtureQuestion } from '~/types/questions'
import type { QuestionAnswerType } from '~/types/questions'
import type { Prediction, PredictionAnswer } from '~/types/predictions'

export type AnswerValue = string | boolean | null | undefined

export function stringifyAnswer(value: AnswerValue): string {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value).trim()
}

export function parseAnswerValue(
  answerType: QuestionAnswerType,
  answerValue: string,
): string | boolean {
  if (!answerValue.trim()) {
    return ''
  }

  if (answerType === 'BOOLEAN') {
    if (answerValue === 'true') return true
    if (answerValue === 'false') return false
    return ''
  }

  return answerValue
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

export function getFixturePointsEarned(
  prediction: Prediction | null,
  answers: PredictionAnswer[] = [],
): number {
  const scorePoints = prediction?.points_earned ?? 0
  const answerPoints = answers.reduce(
    (sum, answer) => sum + (answer.points_earned ?? 0),
    0,
  )
  return scorePoints + answerPoints
}

type AnswerTeam = { id: string; name: string }

export function formatPredictionAnswerDisplay(
  answerValue: string,
  answerType: QuestionAnswerType,
  homeTeam?: AnswerTeam | null,
  awayTeam?: AnswerTeam | null,
): string {
  if (answerType === 'BOOLEAN') {
    if (answerValue === 'true') return 'Yes'
    if (answerValue === 'false') return 'No'
    return answerValue
  }

  if (answerType === 'TEAM') {
    const team = [homeTeam, awayTeam].find((t) => t?.id === answerValue)
    return team?.name ?? answerValue
  }

  return answerValue
}
