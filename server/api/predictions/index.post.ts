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

    const body = await readBody(event);

    const { fixtureId, predictedHomeScore, predictedAwayScore, answers } = body;
    if (!fixtureId) {
        throw createError({
            statusCode: 400,
            statusMessage: "fixtureId is required",
        });
    }

    if (predictedHomeScore === undefined || predictedAwayScore === undefined) {
        throw createError({
            statusCode: 400,
            statusMessage: "Score prediction is required",
        });
    }

    if (!Array.isArray(answers)) {
        throw createError({
            statusCode: 400,
            statusMessage: "answers must be an array",
        });
    }

    // Validate fixture
    const { data: fixture, error: fixtureError } = await client
        .from("fixtures")
        .select("status, match_date")
        .eq("id", fixtureId)
        .single();

    if (fixtureError || !fixture) {
        throw createError({
            statusCode: 404,
            statusMessage: "Fixture not found",
        });
    }

    // Only allow predictions for scheduled fixtures
    if (fixture.status !== "scheduled") {
        throw createError({
            statusCode: 400,
            statusMessage: "Predictions are closed for this fixture",
        });
    }

    // Prevent predictions after kickoff
    const now = new Date();
    const kickoffTime = new Date(fixture.match_date);

    if (now >= kickoffTime) {
        throw createError({
            statusCode: 400,
            statusMessage: "Predictions can only be submitted before kickoff",
        });
    }

    // Optional: prevent duplicate predictions
    const { data: existingPrediction } = await client
        .from("predictions")
        .select("id")
        .eq("user_id", user.sub)
        .eq("fixture_id", fixtureId)
        .maybeSingle();

    if (existingPrediction) {
        throw createError({
            statusCode: 400,
            statusMessage:
                "You have already submitted a prediction for this fixture",
        });
    }

    // Create prediction
    const { data: prediction, error: predictionError } = await client
        .from("predictions")
        .insert({
            user_id: user.sub,
            fixture_id: fixtureId,
            predicted_home_score: predictedHomeScore,
            predicted_away_score: predictedAwayScore,
        })
        .select("id")
        .single();

    if (predictionError) {
        throw createError({
            statusCode: 500,
            statusMessage: predictionError.message,
        });
    }

    // Create question answers
    const predictionAnswers = answers.map(
        (item: { fixtureQuestionId: string; answer: string }) => ({
            prediction_id: prediction.id,
            fixture_question_id: item.fixtureQuestionId,
            answer: item.answer,
        }),
    );

    if (predictionAnswers.length > 0) {
        const { error: answersError } = await client
            .from("prediction_answers")
            .insert(predictionAnswers);

        if (answersError) {
            throw createError({
                statusCode: 500,
                statusMessage: answersError.message,
            });
        }
    }

    return {
        success: true,
        fixtureId,
        prediction: {
            id: prediction.id,
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
