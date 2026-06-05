import type { FixtureListItem } from './fixtures'
import type { Prediction, PredictionAnswer } from './predictions'
import type { FixtureQuestion } from './questions'

export interface DashboardFixture {
  fixture: FixtureListItem
  prediction: Prediction | null
  questions: FixtureQuestion[]
  answers: PredictionAnswer[]
}
