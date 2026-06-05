export default defineEventHandler(async (event) => {
    const { supabase } = await requireAdmin(event);
    const fixtureId = getRouterParam(event, "id");
    const { home_score, away_score } = await readBody(event);

    if (home_score === undefined || away_score === undefined) {
        throw createError({
            statusCode: 400,
            message: "home_score and away_score required",
        });
    }

    // 1. Upsert match result
    const { data, error } = await supabase
        .from("fixture_results")
        .upsert(
            {
                fixture_id: fixtureId,
                home_score,
                away_score,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "fixture_id" },
        )
        .select()
        .single();

    if (error) throw createError({ statusCode: 500, message: error.message });

    return { success: true, fixture_result: data };
});
