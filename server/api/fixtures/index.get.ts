import { serverSupabaseClient } from '#supabase/server'
import type { Fixture } from '~/types/fixtures'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('fixtures')
    .select(
      `
      id,
      group_name,
      match_date,
      venue,
      status,
      home_score,
      away_score,

      home_team:home_team_id (
        id,
        name,
        short_name,
        fifa_code,
        flag_url
      ),

      away_team:away_team_id (
        id,
        name,
        short_name,
        fifa_code,
        flag_url
      )
    `,
    )
    .order('match_date', {
      ascending: true,
    })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return (data ?? []) as Fixture[]
})
