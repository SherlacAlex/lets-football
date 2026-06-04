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

    const userId = user.sub;
    const body = await readBody(event);

    const inviteCode = body.inviteCode?.trim()?.toUpperCase();

    if (!inviteCode) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invite code is required",
        });
    }

    const { data: group, error: groupError } = await client
        .from("groups")
        .select("id, name")
        .eq("invite_code", inviteCode)
        .single();

    if (groupError || !group) {
        throw createError({
            statusCode: 404,
            statusMessage: "Invalid invite code",
        });
    }

    const { error: memberError } = await client.from("group_members").insert({
        group_id: group.id,
        user_id: userId,
        role: "member",
    });

    if (memberError) {
        // Unique constraint violation:
        // user already belongs to this group
        if (memberError.code === "23505") {
            throw createError({
                statusCode: 409,
                statusMessage: "You are already a member of this group",
            });
        }

        throw createError({
            statusCode: 500,
            statusMessage: memberError.message,
        });
    }

    return {
        success: true,
        message: "Successfully joined group",
        data: {
            groupId: group.id,
            groupName: group.name,
        },
    };
});
