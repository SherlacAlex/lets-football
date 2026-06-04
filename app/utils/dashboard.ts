import type { DashboardFixture } from '~/types/DashboardFixture'
import type { Fixture, Team } from '~/types/fixtures'
import type { FixtureQuestion, QuestionTemplate } from '~/types/questions'

type RawTeam = {
  id: string
  name: string
  short_name?: string
  fifa_code?: string
  flag_url?: string | null
}

type RawFixture = {
  id: string
  group_name?: string | null
  match_date: string
  venue?: string | null
  status?: Fixture['status']
  home_score?: number | null
  away_score?: number | null
  home_team: RawTeam
  away_team: RawTeam
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

type RawQuestionTemplate = QuestionTemplate | QuestionTemplate[] | null

type RawFixtureQuestion = {
  id: string
  points: number
  display_order: number
  question_template: RawQuestionTemplate
}

function normalizeQuestionTemplate(raw: RawQuestionTemplate): QuestionTemplate | null {
  if (Array.isArray(raw)) {
    return raw[0] ?? null
  }
  return raw ?? null
}

function normalizeFixtureQuestion(raw: RawFixtureQuestion): FixtureQuestion | null {
  const question_template = normalizeQuestionTemplate(raw.question_template)
  if (!question_template) {
    return null
  }

  return {
    id: raw.id,
    points: raw.points,
    display_order: raw.display_order,
    question_template,
  }
}

export function normalizeFixture(raw: RawFixture): Fixture {
  return {
    id: raw.id,
    group_name: raw.group_name ?? null,
    match_date: raw.match_date,
    venue: raw.venue ?? null,
    status: raw.status ?? 'scheduled',
    home_score: raw.home_score ?? null,
    away_score: raw.away_score ?? null,
    home_team: normalizeTeam(raw.home_team),
    away_team: normalizeTeam(raw.away_team),
  }
}

export function normalizeDashboardItem(item: {
  fixture: RawFixture
  prediction: DashboardFixture['prediction']
  questions?: RawFixtureQuestion[]
}): DashboardFixture {
  const questions = (item.questions ?? [])
    .map(normalizeFixtureQuestion)
    .filter((q): q is FixtureQuestion => q !== null)

  return {
    fixture: normalizeFixture(item.fixture),
    prediction: item.prediction,
    questions,
  }
}

export function normalizeDashboard(
  items: Array<{
    fixture: RawFixture
    prediction: DashboardFixture['prediction']
    questions?: RawFixtureQuestion[]
  }>,
): DashboardFixture[] {
  return items.map(normalizeDashboardItem)
}
