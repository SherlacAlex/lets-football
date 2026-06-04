import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

function generateInviteCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    return Array.from({ length: 6 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
}

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const userId = user.sub;
    const body = await readBody(event);

    if (!body.name?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: "Group name is required",
        });
    }

    let group;
    let inviteCode;

    // Retry in case invite code already exists
    for (let i = 0; i < 5; i++) {
        inviteCode = generateInviteCode();

        const { data, error } = await client
            .from("groups")
            .insert({
                name: body.name.trim(),
                invite_code: inviteCode,
                created_by: userId,
            })
            .select()
            .single();

        if (!error) {
            group = data;
            break;
        }

        // Unique constraint violation
        if (error.code !== "23505") {
            throw createError({
                statusCode: 500,
                statusMessage: error.message,
            });
        }
    }

    if (!group) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to generate unique invite code",
        });
    }

    const { error: memberError } = await client.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "admin",
    });

    if (memberError) {
        throw createError({
            statusCode: 500,
            statusMessage: memberError.message,
        });
    }

    return {
        success: true,
        data: group,
    };
});
