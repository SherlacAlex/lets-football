import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

type PredictionRow = {
    id: string;
    predicted_home_score: number | null;
    predicted_away_score: number | null;
};

type PredictionAnswerRow = {
    fixture_question_id: string;
    answer: string;
};

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const fixtureId = getRouterParam(event, "fixtureId");

    if (!fixtureId) {
        throw createError({
            statusCode: 400,
            statusMessage: "fixtureId is required",
        });
    }

    const { data: prediction, error: predictionError } = await client
        .from("predictions")
        .select("id, predicted_home_score, predicted_away_score")
        .eq("fixture_id", fixtureId)
        .eq("user_id", user.sub)
        .maybeSingle();

    if (predictionError) {
        throw createError({
            statusCode: 500,
            statusMessage: predictionError.message,
        });
    }

    if (!prediction) {
        return null;
    }

    const saved = prediction as PredictionRow;

    const { data: answers, error: answersError } = await client
        .from("prediction_answers")
        .select("fixture_question_id, answer")
        .eq("prediction_id", saved.id);

    if (answersError) {
        throw createError({
            statusCode: 500,
            statusMessage: answersError.message,
        });
    }

    return {
        fixtureId,
        predictedHomeScore: saved.predicted_home_score,
        predictedAwayScore: saved.predicted_away_score,
        answers: ((answers ?? []) as PredictionAnswerRow[]).map((a) => ({
            fixtureQuestionId: a.fixture_question_id,
            answer: a.answer,
        })),
    };
});
