export default defineEventHandler(async (event) => {
    const { supabase } = await requireAdmin(event);
    const fixtureId = getRouterParam(event, "id");

    const { error } = await supabase.rpc(
        "calculate_fixture_points",
        { fixture_id_param: fixtureId }
    );

    if (error) {
        throw createError({
            statusCode: 500,
            message: error.message
        });
    }

    return {
        success: true
    };
});