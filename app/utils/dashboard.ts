import type { DashboardFixture } from '~/types/DashboardFixture'
import type { FixtureListItem, Team } from '~/types/fixtures'
import type { FixtureQuestion } from '~/types/questions'
import type { Prediction, PredictionAnswer } from '~/types/predictions'

type RawTeam = {
  id: string
  name: string
  short_name?: string
  fifa_code?: string
  flag_url?: string | null
}

type RawFixtureQuestion = {
  question_template_id: string
  code: string
  question: string
  answer_type: FixtureQuestion['question_template']['answer_type']
  points_value: number
  display_order: number
}

type RawPrediction = {
  home_score: number
  away_score: number
  points_earned?: number
}

type RawPredictionAnswer = {
  question_template_id: string
  answer_value: string
  points_earned?: number
}

type RawFixtureRow = {
  id: string
  group_name?: string | null
  match_date: string
  venue?: string | null
  status?: FixtureListItem['status']
  home_score?: number | null
  away_score?: number | null
  home_team: RawTeam
  away_team: RawTeam
  user_prediction: RawPrediction | null
  user_answers?: RawPredictionAnswer[]
  can_predict: boolean
  questions?: RawFixtureQuestion[]
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

function normalizeQuestions(questions: RawFixtureQuestion[] = []): FixtureQuestion[] {
  return [...questions]
    .sort((a, b) => a.display_order - b.display_order)
    .map((question) => ({
      id: question.question_template_id,
      points: question.points_value,
      display_order: question.display_order,
      question_template: {
        id: question.question_template_id,
        code: question.code,
        question: question.question,
        answer_type: question.answer_type,
      },
    }))
}

export type FixturesApiData = {
  items: DashboardFixture[]
  userTotalPoints: number
}

function normalizeFixtureRows(rows: RawFixtureRow[]): DashboardFixture[] {
  return rows.map((row) => {
    const fixture: FixtureListItem = {
      id: row.id,
      group_name: row.group_name ?? null,
      match_date: row.match_date,
      venue: row.venue ?? null,
      status: row.status ?? 'scheduled',
      home_score: row.home_score ?? null,
      away_score: row.away_score ?? null,
      home_team: normalizeTeam(row.home_team),
      away_team: normalizeTeam(row.away_team),
      user_prediction: row.user_prediction,
      can_predict: row.can_predict,
    }

    const questions = normalizeQuestions(row.questions)

    return {
      fixture,
      prediction: row.user_prediction,
      questions,
      answers: row.user_answers ?? [],
    }
  })
}

/** @deprecated Use parseFixturesApiResponse */
export function normalizeFixturesResponse(rows: RawFixtureRow[]): DashboardFixture[] {
  return normalizeFixtureRows(rows)
}

export function parseFixturesApiResponse(data: unknown): FixturesApiData {
  if (Array.isArray(data)) {
    return {
      items: normalizeFixtureRows(data),
      userTotalPoints: 0,
    }
  }

  const payload = data as {
    fixtures?: RawFixtureRow[]
    user_total_points?: number
  }

  return {
    items: normalizeFixtureRows(payload.fixtures ?? []),
    userTotalPoints: payload.user_total_points ?? 0,
  }
}

export function findFirstScheduledFixture(
  items: DashboardFixture[],
): DashboardFixture | undefined {
  return items.find((item) => item.fixture.status === 'scheduled')
}

export function fixtureCardElementId(fixtureId: string): string {
  return `fixture-card-${fixtureId}`
}

export function scrollToFixtureCard(fixtureId: string, smooth = false): void {
  if (!import.meta.client) {
    return
  }
  const el = document.getElementById(fixtureCardElementId(fixtureId))
  el?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'instant',
    block: 'start',
  })
}
