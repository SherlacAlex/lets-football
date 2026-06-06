import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

    // 1. Get all fixtures with teams
    const { data: fixtures, error } = await supabase
        .from("fixtures")
        .select(
            `
      *,
      home_team:teams!fixtures_home_team_id_fkey (id, name, fifa_code, flag_url),
      away_team:teams!fixtures_away_team_id_fkey (id, name, fifa_code, flag_url)
    `,
        )
        .order("match_date", { ascending: true });

    if (error) throw createError({ statusCode: 500, message: error.message });

    const fixtureIds = fixtures.map((f) => f.id);

    // 2. User's score predictions
    const { data: userPredictions } = await supabase
        .from("score_prediction")
        .select("fixture_id, home_score, away_score, points_earned")
        .in("fixture_id", fixtureIds)
        .eq("user_id", user.sub);

    const predictionMap = new Map();
    let totalScorePoints = 0;
    userPredictions?.forEach((p) => {
        const points = p.points_earned ?? 0;
        totalScorePoints += points;
        predictionMap.set(p.fixture_id, {
            home_score: p.home_score,
            away_score: p.away_score,
            points_earned: points,
        });
    });

    // 3. User's answers to fixture questions
    const { data: userAnswers } = await supabase
        .from("prediction_answer")
        .select("fixture_id, question_template_id, answer_value, points_earned")
        .in("fixture_id", fixtureIds)
        .eq("user_id", user.sub);

    const answersMap = new Map();
    let totalAnswerPoints = 0;
    userAnswers?.forEach((a) => {
        const points = a.points_earned ?? 0;
        totalAnswerPoints += points;
        if (!answersMap.has(a.fixture_id)) answersMap.set(a.fixture_id, []);
        answersMap.get(a.fixture_id).push({
            question_template_id: a.question_template_id,
            answer_value: a.answer_value,
            points_earned: points,
        });
    });

    const userTotalPoints = totalScorePoints + totalAnswerPoints;

    // 4. Question templates assigned to each fixture
    const { data: fixtureQuestions, error: qError } = await supabase
        .from("fixture_question")
        .select(
            `
      fixture_id,
      points_value,
      display_order,
      question_template:question_template_id (
        id,
        code,
        question,
        answer_type
      )
    `,
        )
        .in("fixture_id", fixtureIds)
        .order("display_order", { ascending: true });

    if (qError) throw createError({ statusCode: 500, message: qError.message });

    const questionsByFixture = new Map();
    fixtureQuestions?.forEach((fq) => {
        const fixtureId = fq.fixture_id;
        if (!questionsByFixture.has(fixtureId))
            questionsByFixture.set(fixtureId, []);
        questionsByFixture.get(fixtureId).push({
            question_template_id: fq.question_template.id,
            code: fq.question_template.code,
            question: fq.question_template.question,
            answer_type: fq.question_template.answer_type,
            points_value: fq.points_value,
            display_order: fq.display_order,
        });
    });

    // 5. Final enriched fixtures
    const enriched = fixtures.map((f) => ({
        ...f,
        user_prediction: predictionMap.get(f.id) || null,
        user_answers: answersMap.get(f.id) || [],
        can_predict: f.status === "scheduled",
        questions: questionsByFixture.get(f.id) || [],
    }));

    // Return fixtures array plus the user's total points
    return {
        fixtures: enriched,
        user_total_points: userTotalPoints,
    };
});
