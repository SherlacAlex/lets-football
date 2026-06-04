import type { Fixture } from './fixtures'
import type { Prediction } from './predictions'
import type { FixtureQuestion } from './questions'

export interface DashboardFixture {
  fixture: Fixture
  prediction: Prediction | null
  questions: FixtureQuestion[]
}
