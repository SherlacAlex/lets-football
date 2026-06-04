import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);

    const fixtureId = getRouterParam(event, "fixtureId");

    if (!fixtureId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Fixture ID is required",
        });
    }

    const { data, error } = await client
        .from("fixture_questions")
        .select(
            `
            id,
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
        .eq("fixture_id", fixtureId)
        .order("display_order", { ascending: true });

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        });
    }

    return {
        fixtureId,
        questions: data,
    };
});
