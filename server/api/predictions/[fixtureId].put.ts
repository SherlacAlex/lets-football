import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const predictionId = getRouterParam(event, "fixtureId");

    if (!predictionId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Prediction ID is required",
        });
    }

    const body = await readBody(event);

    const { predictedHomeScore, predictedAwayScore, answers } = body;

    //
    // Verify ownership
    //
    const { data: prediction, error: predictionError } = await client
        .from("predictions")
        .select("id, fixture_id")
        .eq("id", predictionId)
        .eq("user_id", user.sub)
        .single();

    if (predictionError || !prediction) {
        throw createError({
            statusCode: 404,
            statusMessage: "Prediction not found",
        });
    }

    //
    // Update score prediction
    //
    const { error: updateError } = await client
        .from("predictions")
        .update({
            predicted_home_score: predictedHomeScore,
            predicted_away_score: predictedAwayScore,
            submitted_at: new Date().toISOString(),
        })
        .eq("id", predictionId);

    if (updateError) {
        throw createError({
            statusCode: 500,
            statusMessage: updateError.message,
        });
    }

    //
    // Remove old answers
    //
    const { error: deleteError } = await client
        .from("prediction_answers")
        .delete()
        .eq("prediction_id", predictionId);

    if (deleteError) {
        throw createError({
            statusCode: 500,
            statusMessage: deleteError.message,
        });
    }

    //
    // Insert new answers
    //
    const predictionAnswers = answers.map(
        (item: { fixtureQuestionId: string; answer: string }) => ({
            prediction_id: predictionId,
            fixture_question_id: item.fixtureQuestionId,
            answer: item.answer,
        }),
    );

    const { error: insertError } = await client
        .from("prediction_answers")
        .insert(predictionAnswers);

    if (insertError) {
        throw createError({
            statusCode: 500,
            statusMessage: insertError.message,
        });
    }

    return {
        success: true,
        fixtureId: prediction.fixture_id,
        prediction: {
            id: predictionId,
            predictedHomeScore,
            predictedAwayScore,
            answers: answers.map(
                (item: { fixtureQuestionId: string; answer: string }) => ({
                    fixtureQuestionId: item.fixtureQuestionId,
                    answer: item.answer,
                }),
            ),
        },
    };
});
