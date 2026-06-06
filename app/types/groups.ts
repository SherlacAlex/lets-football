import type { FixtureStatus } from './fixtures'

export type LeagueData = {
  id: string
  name: string
  invite_code: string
  created_at: string
  created_by: string
}

export type UserLeague = {
  id: string
  name: string
  invite_code: string
  created_at: string
  my_total_points: number
  my_rank: number | null
  member_count: number
}

export type CreatedGroup = LeagueData

export type LeagueRankingEntry = {
  id: string
  username: string
  display_name: string
  total_points: number
  rank: number
}

export type GroupDetailResponse = {
  group: LeagueData
  invite_code: string
  ranking: LeagueRankingEntry[]
}

export type JoinGroupResponse = {
  success: boolean
  group_id: string
}

export type MemberFixturePoints = {
  fixture_id: string
  match_date: string
  status: FixtureStatus
  home_score: number | null
  away_score: number | null
  group_name: string | null
  venue: string | null
  home_team: { name: string; fifa_code: string; flag_url?: string | null }
  away_team: { name: string; fifa_code: string; flag_url?: string | null }
  total_points: number
  has_predicted: boolean
}

export type MemberFixturePredictionDetail = {
  score_prediction: {
    home_score: number
    away_score: number
    points_earned: number
  } | null
  answers: Array<{
    answer_value: string
    points_earned: number
    question_template: {
      code: string
      question: string
      answer_type: string
    }
  }>
  actual_result: {
    home_score: number
    away_score: number
  } | null
  home_team: { id: string; name: string; fifa_code: string; flag_url: string | null }
  away_team: { id: string; name: string; fifa_code: string; flag_url: string | null }
}
