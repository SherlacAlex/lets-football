import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const groupId = getRouterParam(event, "id");

    if (!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Group ID is required",
        });
    }

    // Get group details
    const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();

    if (groupError || !group) {
        throw createError({
            statusCode: 404,
            statusMessage: "Group not found",
        });
    }

    // Optional: verify current user belongs to the group
    const { data: membership } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId)
        .eq("user_id", user.sub)
        .maybeSingle();

    if (!membership) {
        throw createError({
            statusCode: 403,
            statusMessage: "You are not a member of this group",
        });
    }

    // Get ranking directly from Postgres function
    const { data: ranking, error: rankingError } = await supabase.rpc(
        "get_group_ranking",
        {
            group_id_param: groupId,
        },
    );

    if (rankingError) {
        throw createError({
            statusCode: 500,
            statusMessage: rankingError.message,
        });
    }

    return {
        group,
        invite_code: group.invite_code,
        ranking: ranking ?? [],
    };
});
