import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const method = getMethod(event)

  if (method === 'GET') {
    // Fetch predictions from Supabase database
    const { data, error } = await client
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      // Return a simulated or fallback database list if table does not exist
      return {
        success: false,
        error: error.message,
        fallback: true,
        data: []
      }
    }

    return {
      success: true,
      data
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { matchId, homeScore, awayScore } = body

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Missing required prediction details',
      })
    }

    const { data, error } = await client
      .from('predictions')
      .upsert({
        user_id: user.id,
        match_id: matchId,
        home_score: homeScore,
        away_score: awayScore,
        updated_at: new Date()
      }, { onConflict: 'user_id,match_id' })

    if (error) {
      return {
        success: false,
        error: error.message,
        fallback: true
      }
    }

    return {
      success: true,
      data
    }
  }
})
