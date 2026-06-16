import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

    const targetUserId = getRouterParam(event, "userId");
    const fixtureId = getRouterParam(event, "fixtureId");

    // 1. Fetch fixture details – now allow both 'live' and 'completed'
    const { data: fixture, error: fixtureError } = await supabase
        .from("fixtures")
        .select(
            `
            status,
            home_team:teams!fixtures_home_team_id_fkey (id, name, fifa_code, flag_url),
            away_team:teams!fixtures_away_team_id_fkey (id, name, fifa_code, flag_url)
        `,
        )
        .eq("id", fixtureId)
        .single();

    if (fixtureError || !fixture) {
        throw createError({ statusCode: 404, message: "Fixture not found" });
    }

    // Only allow access if fixture is live or completed
    if (!["live", "completed"].includes(fixture.status)) {
        throw createError({
            statusCode: 404,
            message:
                "Predictions not available for this fixture (only live or completed)",
        });
    }

    // 2. Get score prediction (may be null if user hasn't predicted)
    const { data: scorePred } = await supabase
        .from("score_prediction")
        .select("home_score, away_score, points_earned")
        .eq("user_id", targetUserId)
        .eq("fixture_id", fixtureId)
        .maybeSingle(); // .single() would throw if no row; .maybeSingle() returns null

    // 3. Get answers to questions (may be empty)
    const { data: answers } = await supabase
        .from("prediction_answer")
        .select(
            `
            answer_value,
            points_earned,
            question_template:question_template_id (code, question, answer_type)
        `,
        )
        .eq("user_id", targetUserId)
        .eq("fixture_id", fixtureId);

    // 4. Get actual result – only exists if fixture is completed
    const { data: actualResult } = await supabase
        .from("fixture_results")
        .select("home_score, away_score")
        .eq("fixture_id", fixtureId)
        .maybeSingle(); // null if no result yet (for live fixtures)

    // 5. Return combined data
    return {
        fixture_status: fixture.status,
        score_prediction: scorePred || null,
        answers: answers || [],
        actual_result: actualResult || null,
        home_team: fixture.home_team,
        away_team: fixture.away_team,
    };
});
