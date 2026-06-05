export default defineEventHandler(async (event) => {
    const { supabase } = await requireAdmin(event);
    const fixtureId = getRouterParam(event, "id");

    if (!fixtureId) {
        throw createError({ statusCode: 400, message: "Fixture id required" });
    }

    const { data: fixture, error } = await supabase
        .from("fixtures")
        .select(
            `
      *,
      home_team:teams!fixtures_home_team_id_fkey (id, name, fifa_code, flag_url),
      away_team:teams!fixtures_away_team_id_fkey (id, name, fifa_code, flag_url)
    `,
        )
        .eq("id", fixtureId)
        .single();

    if (error) {
        throw createError({ statusCode: 404, message: "Fixture not found" });
    }

    const { data: result } = await supabase
        .from("fixture_results")
        .select("home_score, away_score")
        .eq("fixture_id", fixtureId)
        .maybeSingle();

    const { data: fixtureQuestionsRaw, error: fqError } = await supabase
        .from("fixture_question")
        .select("points_value, display_order, question_template_id")
        .eq("fixture_id", fixtureId)
        .order("display_order", { ascending: true });

    if (fqError) {
        throw createError({ statusCode: 500, message: fqError.message });
    }

    const { data: fixtureAnswers, error: faError } = await supabase
        .from("fixture_answer")
        .select("question_template_id, correct_answer")
        .eq("fixture_id", fixtureId);

    if (faError) {
        throw createError({ statusCode: 500, message: faError.message });
    }

    const answersMap = new Map(
        fixtureAnswers?.map((a) => [a.question_template_id, a.correct_answer]) ||
            [],
    );

    const templateIds = [
        ...new Set(
            fixtureQuestionsRaw?.map((fq) => fq.question_template_id) || [],
        ),
    ];

    const { data: templates, error: tError } = await supabase
        .from("question_templates")
        .select("id, code, question, answer_type")
        .in("id", templateIds);

    if (tError) {
        throw createError({ statusCode: 500, message: tError.message });
    }

    const templateMap = new Map(templates?.map((t) => [t.id, t]) || []);

    const enrichedQuestions =
        fixtureQuestionsRaw
            ?.map((fq) => {
                const template = templateMap.get(fq.question_template_id);
                if (!template) return null;

                return {
                    id: template.id,
                    code: template.code,
                    question: template.question,
                    answer_type: template.answer_type,
                    points_value: fq.points_value,
                    correct_answer:
                        answersMap.get(fq.question_template_id) ?? null,
                    display_order: fq.display_order,
                };
            })
            .filter(Boolean) || [];

    return {
        ...fixture,
        actual_result: result || null,
        questions: enrichedQuestions,
    };
});
