export default defineEventHandler(async (event) => {
    const { supabase } = await requireAdmin(event);

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

    // 2. Fetch actual results
    const { data: results } = await supabase
        .from("fixture_results")
        .select("fixture_id, home_score, away_score")
        .in("fixture_id", fixtureIds);

    const resultsMap = new Map();
    results?.forEach((r) =>
        resultsMap.set(r.fixture_id, {
            home_score: r.home_score,
            away_score: r.away_score,
        }),
    );

    // 3. Fetch fixture_question rows
    const { data: fixtureQuestionsRaw, error: fqError } = await supabase
        .from("fixture_question")
        .select("fixture_id, points_value, display_order, question_template_id")
        .in("fixture_id", fixtureIds)
        .order("display_order", { ascending: true });

    if (fqError) {
        throw createError({ statusCode: 500, message: fqError.message });
    }

    const { data: fixtureAnswers, error: faError } = await supabase
        .from("fixture_answer")
        .select("fixture_id, question_template_id, correct_answer")
        .in("fixture_id", fixtureIds);

    if (faError) {
        throw createError({ statusCode: 500, message: faError.message });
    }

    const answersMap = new Map<string, string | null>();
    fixtureAnswers?.forEach((a) => {
        answersMap.set(`${a.fixture_id}|${a.question_template_id}`, a.correct_answer);
    });

    const templateIds = [
        ...new Set(
            fixtureQuestionsRaw?.map((fq) => fq.question_template_id) || [],
        ),
    ];
    const { data: templates, error: tError } = await supabase
        .from("question_templates")
        .select("id, code, question, answer_type")
        .in("id", templateIds);

    if (tError) throw createError({ statusCode: 500, message: tError.message });

    const templateMap = new Map(templates?.map((t) => [t.id, t]) || []);

    // 5. Group questions by fixture_id
    const questionsByFixture = new Map();
    fixtureQuestionsRaw?.forEach((fq) => {
        const fid = fq.fixture_id;
        if (!questionsByFixture.has(fid)) questionsByFixture.set(fid, []);
        const template = templateMap.get(fq.question_template_id);
        if (template) {
            questionsByFixture.get(fid).push({
                id: template.id,
                code: template.code,
                question: template.question,
                answer_type: template.answer_type,
                points_value: fq.points_value,
                correct_answer:
                    answersMap.get(`${fid}|${template.id}`) ?? null,
                display_order: fq.display_order,
            });
        }
    });

    // 6. Enrich fixtures
    const enriched = fixtures.map((f) => ({
        ...f,
        actual_result: resultsMap.get(f.id) || null,
        questions: questionsByFixture.get(f.id) || [],
        can_edit_result: true,
    }));

    return enriched;
});
