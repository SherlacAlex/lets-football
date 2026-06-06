import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const targetUserId = getRouterParam(event, 'userId')
    const fixtureId = getRouterParam(event, 'fixtureId')

    // Verify fixture is completed
    const { data: fixture, error: fixtureError } = await supabase
        .from('fixtures')
        .select(`
      status,
      home_team:teams!fixtures_home_team_id_fkey (id, name, fifa_code, flag_url),
      away_team:teams!fixtures_away_team_id_fkey (id, name, fifa_code, flag_url)
    `)
        .eq('id', fixtureId)
        .single()
    if (fixtureError || fixture.status !== 'completed') {
        throw createError({ statusCode: 404, message: 'Prediction not available for this fixture' })
    }

    // Get score prediction
    const { data: scorePred } = await supabase
        .from('score_prediction')
        .select('home_score, away_score, points_earned')
        .eq('user_id', targetUserId)
        .eq('fixture_id', fixtureId)
        .single()

    // Get answers to questions
    const { data: answers } = await supabase
        .from('prediction_answer')
        .select(`
      answer_value,
      points_earned,
      question_template:question_template_id (code, question, answer_type)
    `)
        .eq('user_id', targetUserId)
        .eq('fixture_id', fixtureId)

    // Get actual result
    const { data: actualResult } = await supabase
        .from('fixture_results')
        .select('home_score, away_score')
        .eq('fixture_id', fixtureId)
        .single()

    return {
        score_prediction: scorePred || null,
        answers: answers || [],
        actual_result: actualResult || null,
        home_team: fixture.home_team,
        away_team: fixture.away_team,
    }
})