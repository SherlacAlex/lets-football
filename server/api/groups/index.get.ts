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

    const { data, error } = await client
        .from("group_members")
        .select(
            `
            role,
            joined_at,
            groups (
                id,
                name,
                invite_code,
                created_at,
                created_by
            )
        `,
        )
        .eq("user_id", user.id);

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        });
    }

    return {
        success: true,
        data,
    };
});
