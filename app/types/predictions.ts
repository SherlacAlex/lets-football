export interface PredictionAnswer {
  fixtureQuestionId: string
  answer: string
}

export interface SavePredictionRequest {
  fixtureId: string
  predictedHomeScore: number
  predictedAwayScore: number
  answers: PredictionAnswer[]
}

export interface Prediction {
  id: string
  predictedHomeScore: number | null
  predictedAwayScore: number | null
  answers: PredictionAnswer[]
}

export interface PredictionMutationResponse {
  success: boolean
  fixtureId: string
  prediction: Prediction
}

export interface SavePredictionResponse extends PredictionMutationResponse {}

export interface UpdatePredictionRequest {
  predictedHomeScore: number
  predictedAwayScore: number
  answers: PredictionAnswer[]
}

export interface UpdatePredictionResponse extends PredictionMutationResponse {}
