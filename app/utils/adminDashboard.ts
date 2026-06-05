import type { AdminDashboardFixture, AdminFixtureQuestion } from '~/types/AdminDashboardFixture'
import type { FixtureListItem, Team } from '~/types/fixtures'
import type { FixtureQuestion } from '~/types/questions'

type RawTeam = {
  id: string
  name: string
  short_name?: string
  fifa_code?: string
  flag_url?: string | null
}

type RawAdminFixtureQuestion = {
  id?: string
  question_template_id?: string
  code?: string
  question?: string
  answer_type?: FixtureQuestion['question_template']['answer_type']
  points_value: number
  correct_answer?: string | null
  display_order: number
  question_template?: {
    id: string
    code: string
    question: string
    answer_type: FixtureQuestion['question_template']['answer_type']
  }
}

type RawAdminFixtureRow = {
  id: string
  group_name?: string | null
  match_date: string
  venue?: string | null
  status?: FixtureListItem['status']
  home_score?: number | null
  away_score?: number | null
  home_team: RawTeam
  away_team: RawTeam
  actual_result?: { home_score: number; away_score: number } | null
  can_edit_result?: boolean
  questions?: RawAdminFixtureQuestion[]
}

function normalizeTeam(team: RawTeam): Team {
  return {
    id: team.id,
    name: team.name,
    short_name: team.short_name ?? team.name,
    fifa_code: team.fifa_code ?? '',
    flag_url: team.flag_url ?? null,
  }
}

function normalizeQuestions(questions: RawAdminFixtureQuestion[] = []): AdminFixtureQuestion[] {
  return [...questions]
    .sort((a, b) => a.display_order - b.display_order)
    .map((question) => {
      const template = question.question_template
      const templateId =
        template?.id ?? question.id ?? question.question_template_id ?? ''

      return {
        id: templateId,
        points: question.points_value,
        display_order: question.display_order,
        correct_answer: question.correct_answer ?? null,
        question_template: {
          id: templateId,
          code: template?.code ?? question.code ?? '',
          question: template?.question ?? question.question ?? '',
          answer_type:
            template?.answer_type ?? question.answer_type ?? 'BOOLEAN',
        },
      }
    })
    .filter((question) => question.id)
}

export function normalizeAdminFixturesResponse(
  rows: RawAdminFixtureRow[],
): AdminDashboardFixture[] {
  return rows.map((row) => {
    const status = row.status ?? 'scheduled'
    const actualResult =
      row.actual_result ??
      (status === 'completed' &&
      row.home_score != null &&
      row.away_score != null
        ? { home_score: row.home_score, away_score: row.away_score }
        : null)
    const fixture = {
      id: row.id,
      group_name: row.group_name ?? null,
      match_date: row.match_date,
      venue: row.venue ?? null,
      status,
      home_score: actualResult?.home_score ?? row.home_score ?? null,
      away_score: actualResult?.away_score ?? row.away_score ?? null,
      home_team: normalizeTeam(row.home_team),
      away_team: normalizeTeam(row.away_team),
      can_edit_result: row.can_edit_result ?? true,
    }

    return {
      fixture,
      actual_result: actualResult,
      questions: normalizeQuestions(row.questions),
    }
  })
}

export {
  fixtureCardElementId,
  scrollToFixtureCard,
} from '~/utils/dashboard'

export function findFirstScheduledAdminFixture(
  items: AdminDashboardFixture[],
): AdminDashboardFixture | undefined {
  return items.find((item) => item.fixture.status === 'scheduled')
}
