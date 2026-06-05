import type { Fixture } from './fixtures'
import type { FixtureQuestion } from './questions'

export interface AdminFixtureQuestion extends FixtureQuestion {
  correct_answer: string | null
}

export interface AdminFixtureListItem extends Fixture {
  can_edit_result: boolean
}

export interface AdminDashboardFixture {
  fixture: AdminFixtureListItem
  actual_result: { home_score: number; away_score: number } | null
  questions: AdminFixtureQuestion[]
}
