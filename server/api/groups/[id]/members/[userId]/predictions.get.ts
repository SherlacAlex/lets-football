import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const groupId = getRouterParam(event, 'id')
    const targetUserId = getRouterParam(event, 'userId')

    // Check requester is a member of the group
    const { data: membership } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .eq('user_id', user.sub)
        .single()

    if (!membership) throw createError({ statusCode: 403, message: 'Not a member of this group' })

    // Get completed fixtures with points earned by target user
    const { data: fixturesWithPoints, error } = await supabase
        .from('fixtures')
        .select(`
      id,
      match_date,
      home_team:teams!fixtures_home_team_id_fkey (name, fifa_code),
      away_team:teams!fixtures_away_team_id_fkey (name, fifa_code),
      score_prediction!inner(points_earned),
      prediction_answer!inner(points_earned)
    `)
        .eq('status', 'completed')
        .eq('score_prediction.user_id', targetUserId)
        .eq('prediction_answer.user_id', targetUserId)
        .order('match_date', { ascending: true })

    if (error) throw createError({ statusCode: 500, message: error.message })

    const result = fixturesWithPoints.map(f => {
        // Sum points from score_prediction (single) and prediction_answer (multiple)
        const scorePoints = f.score_prediction?.points_earned || 0
        const answerPoints = f.prediction_answer?.reduce((sum, a) => sum + (a.points_earned || 0), 0) || 0
        return {
            fixture_id: f.id,
            match_date: f.match_date,
            home_team: f.home_team,
            away_team: f.away_team,
            total_points: scorePoints + answerPoints
        }
    })

    return result
})