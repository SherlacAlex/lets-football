import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);
    if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

    const supabase = await serverSupabaseClient(event);
    const fixtureId = getRouterParam(event, "id");
    if (!fixtureId)
        throw createError({ statusCode: 400, message: "Fixture ID required" });

    const { data, error } = await supabase
        .from("fixtures")
        .update({ status: "live", updated_at: new Date().toISOString() })
        .eq("id", fixtureId)
        .select();

    if (error) {
        console.error("Supabase error:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to update fixture status",
        });
    }

    if (!data || data.length === 0) {
        throw createError({ statusCode: 404, message: "Fixture not found" });
    }

    return { success: true, fixture: data[0] };
});
