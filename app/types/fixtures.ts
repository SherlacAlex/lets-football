export type FixtureStatus = 'scheduled' | 'live' | 'completed' | 'cancelled'

export interface Team {
  id: string
  name: string
  short_name: string
  fifa_code: string
  flag_url: string | null
}

export interface Fixture {
  id: string
  group_name: string | null
  match_date: string
  venue: string | null
  status: FixtureStatus
  home_score: number | null
  away_score: number | null
  home_team: Team
  away_team: Team
}

export interface UserScorePrediction {
  home_score: number
  away_score: number
}

export interface FixtureListItem extends Fixture {
  user_prediction: UserScorePrediction | null
  can_predict: boolean
}
