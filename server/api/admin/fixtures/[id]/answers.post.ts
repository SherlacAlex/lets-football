import { isPredictionLocked } from "~/utils/fixtures";

export default defineEventHandler(async (event) => {
    const { supabase } = await requireAdmin(event);
    const fixtureId = getRouterParam(event, "id");
    const { answers } = await readBody(event); // [{ question_template_id, correct_answer }]

    if (!answers || !Array.isArray(answers)) {
        throw createError({
            statusCode: 400,
            message: "answers array required",
        });
    }

    const { data: fixture, error: fixtureError } = await supabase
        .from("fixtures")
        .select("status, match_date")
        .eq("id", fixtureId)
        .single();

    if (fixtureError || !fixture) {
        throw createError({ statusCode: 404, message: "Fixture not found" });
    }

    if (fixture.status === "scheduled" && !isPredictionLocked(fixture)) {
        throw createError({
            statusCode: 400,
            message: "Official answers can only be set after predictions close",
        });
    }

    // Upsert each correct answer into fixture_answer
    const upserts = answers.map((ans) =>
        supabase.from("fixture_answer").upsert(
            {
                fixture_id: fixtureId,
                question_template_id: ans.question_template_id,
                correct_answer: ans.correct_answer,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "fixture_id, question_template_id" },
        ),
    );

    const results = await Promise.all(upserts);
    const errors = results.filter((r) => r.error);
    if (errors.length) {
        throw createError({
            statusCode: 500,
            message: "Failed to save some answers",
            data: errors,
        });
    }

    return { success: true };
});
