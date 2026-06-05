export interface PredictAnswerPayload {
  question_template_id: string
  answer_value: string
}

export interface PredictFixtureRequest {
  home_score: number
  away_score: number
  answers: PredictAnswerPayload[]
}

export interface PredictFixtureResponse {
  success: boolean
}

export interface Prediction {
  home_score: number
  away_score: number
  points_earned?: number
}

export interface PredictionAnswer {
  question_template_id: string
  answer_value: string
  points_earned?: number
}
