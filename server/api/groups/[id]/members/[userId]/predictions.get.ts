import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const groupId = getRouterParam(event, 'id')
    const targetUserId = getRouterParam(event, 'userId')

    const { data: membership } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .eq('user_id', user.sub)
        .single()

    if (!membership) {
        throw createError({ statusCode: 403, message: 'Not a member of this group' })
    }

    const { data: fixtures, error: fixturesError } = await supabase
        .from('fixtures')
        .select(`
      id,
      match_date,
      status,
      home_score,
      away_score,
      group_name,
      venue,
      home_team:teams!fixtures_home_team_id_fkey (name, fifa_code, flag_url),
      away_team:teams!fixtures_away_team_id_fkey (name, fifa_code, flag_url)
    `)
        .order('match_date', { ascending: true })

    if (fixturesError) {
        throw createError({ statusCode: 500, message: fixturesError.message })
    }

    if (!fixtures?.length) {
        return []
    }

    const fixtureIds = fixtures.map((fixture) => fixture.id)

    const { data: scorePredictions, error: scoreError } = await supabase
        .from('score_prediction')
        .select('fixture_id, points_earned')
        .eq('user_id', targetUserId)
        .in('fixture_id', fixtureIds)

    if (scoreError) {
        throw createError({ statusCode: 500, message: scoreError.message })
    }

    const { data: predictionAnswers, error: answersError } = await supabase
        .from('prediction_answer')
        .select('fixture_id, points_earned')
        .eq('user_id', targetUserId)
        .in('fixture_id', fixtureIds)

    if (answersError) {
        throw createError({ statusCode: 500, message: answersError.message })
    }

    const scorePointsByFixture = new Map<string, number>()
    const hasPredictedByFixture = new Set<string>()
    scorePredictions?.forEach((prediction) => {
        hasPredictedByFixture.add(prediction.fixture_id)
        scorePointsByFixture.set(
            prediction.fixture_id,
            prediction.points_earned ?? 0,
        )
    })

    const answerPointsByFixture = new Map<string, number>()
    predictionAnswers?.forEach((answer) => {
        hasPredictedByFixture.add(answer.fixture_id)
        const current = answerPointsByFixture.get(answer.fixture_id) ?? 0
        answerPointsByFixture.set(
            answer.fixture_id,
            current + (answer.points_earned ?? 0),
        )
    })

    return fixtures.map((fixture) => {
        const hasPredicted = hasPredictedByFixture.has(fixture.id)
        const isCompleted = fixture.status === 'completed'
        const scorePoints = scorePointsByFixture.get(fixture.id) ?? 0
        const answerPoints = answerPointsByFixture.get(fixture.id) ?? 0
        const totalPoints =
            hasPredicted && isCompleted ? scorePoints + answerPoints : 0

        return {
            fixture_id: fixture.id,
            match_date: fixture.match_date,
            status: fixture.status,
            home_score: fixture.home_score,
            away_score: fixture.away_score,
            group_name: fixture.group_name,
            venue: fixture.venue,
            home_team: fixture.home_team,
            away_team: fixture.away_team,
            total_points: totalPoints,
            has_predicted: hasPredicted,
        }
    })
})
