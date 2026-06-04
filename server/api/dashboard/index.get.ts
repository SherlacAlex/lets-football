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

    const userId = user.sub;

    //
    // Load fixtures
    //
    const { data: fixtures, error: fixturesError } = await client
        .from("fixtures")
        .select(
            `
            *,
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
        .order("match_date");

    if (fixturesError) {
        throw createError({
            statusCode: 500,
            statusMessage: fixturesError.message,
        });
    }

    //
    // Load user predictions + answers
    //
    const { data: predictions, error: predictionsError } = await client
        .from("predictions")
        .select(
            `
            id,
            fixture_id,
            predicted_home_score,
            predicted_away_score,
            prediction_answers (
                fixture_question_id,
                answer
            )
        `,
        )
        .eq("user_id", userId);

    if (predictionsError) {
        throw createError({
            statusCode: 500,
            statusMessage: predictionsError.message,
        });
    }

    const fixtureIds = fixtures.map((fixture) => fixture.id);
    const questionsByFixture = new Map<string, object[]>();

    if (fixtureIds.length > 0) {
        const { data: fixtureQuestions, error: questionsError } = await client
            .from("fixture_questions")
            .select(
                `
            id,
            fixture_id,
            points,
            display_order,
            question_template:question_templates (
            id,
            code,
            question,
            answer_type
            )
        `,
            )
            .in("fixture_id", fixtureIds)
            .order("display_order", { ascending: true });

        if (questionsError) {
            throw createError({
                statusCode: 500,
                statusMessage: questionsError.message,
            });
        }

        for (const question of fixtureQuestions ?? []) {
            const list = questionsByFixture.get(question.fixture_id) ?? [];
            list.push(question);
            questionsByFixture.set(question.fixture_id, list);
        }
    }

    //
    // Build lookup map
    //
    const predictionMap = new Map(
        predictions.map((prediction) => [prediction.fixture_id, prediction]),
    );

    //
    // Merge
    //
    const dashboardFixtures = fixtures.map((fixture) => {
        const prediction = predictionMap.get(fixture.id);

        return {
            fixture,
            prediction: prediction
                ? {
                      id: prediction.id,
                      predictedHomeScore: prediction.predicted_home_score,
                      predictedAwayScore: prediction.predicted_away_score,
                      answers: prediction.prediction_answers.map((answer) => ({
                          fixtureQuestionId: answer.fixture_question_id,
                          answer: answer.answer,
                      })),
                  }
                : null,
            questions: questionsByFixture.get(fixture.id) ?? [],
        };
    });

    return dashboardFixtures;
});
