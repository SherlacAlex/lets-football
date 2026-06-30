import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { isPredictionLocked } from '~/utils/fixtures'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const fixtureId = getRouterParam(event, 'id')  // UUID string
    const body = await readBody(event)

    // Validate fixture status
    const { data: fixture, error: fixtureError } = await supabase
        .from('fixtures')
        .select('status, match_date')
        .eq('id', fixtureId)
        .single()
    if (fixtureError || !fixture) throw createError({ statusCode: 404, message: 'Fixture not found' })
    if (fixture.status !== 'scheduled' || isPredictionLocked(fixture)) {
        throw createError({ statusCode: 400, message: 'Prediction closed' })
    }

    // Fetch current fixture questions
    const { data: fixtureQuestions, error: fqError } = await supabase
        .from("fixture_question")
        .select("question_template_id")
        .eq("fixture_id", fixtureId);

    if (fqError) {
        throw createError({
            statusCode: 500,
            message: fqError.message,
        });
    }

    const validQuestionIds = new Set(
        fixtureQuestions.map((q) => q.question_template_id)
    );

    // Ensure every submitted question still belongs to this fixture
    for (const ans of body.answers) {
        if (!validQuestionIds.has(ans.question_template_id)) {
            throw createError({
                statusCode: 409,
                message: "Prediction questions have changed. Please refresh the page.",
            });
        }
    }


    // Upsert score prediction
    const { error: scoreError } = await supabase
        .from('score_prediction')
        .upsert({
            user_id: user.sub,
            fixture_id: fixtureId,
            home_score: body.home_score,
            away_score: body.away_score,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, fixture_id' })

    if (scoreError) throw createError({ statusCode: 500, message: scoreError.message })

    // Upsert answers
    for (const ans of body.answers) {
        const { error: answerError } = await supabase
            .from('prediction_answer')
            .upsert({
                user_id: user.sub,
                fixture_id: fixtureId,
                question_template_id: ans.question_template_id,
                answer_value: ans.answer_value,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, fixture_id, question_template_id' })

        if (answerError) throw createError({ statusCode: 500, message: answerError.message })
    }

    return { success: true }
})