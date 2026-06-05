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
  home_team: { name: string; fifa_code: string }
  away_team: { name: string; fifa_code: string }
  total_points: number
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
    question_template: { code: string; question: string }
  }>
  actual_result: {
    home_score: number
    away_score: number
  } | null
}
