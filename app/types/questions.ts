export type QuestionAnswerType = 'TEAM' | 'BOOLEAN' | 'NUMBER' | string

export interface QuestionTemplate {
  id: string
  code: string
  question: string
  answer_type: QuestionAnswerType
}

export interface FixtureQuestion {
  id: string
  points: number
  display_order: number
  question_template: QuestionTemplate
}

export interface FixtureQuestionsResponse {
  fixtureId: string
  questions: FixtureQuestion[] | null
}
