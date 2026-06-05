import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    // Validate authentication
    if (!user || !user.sub) {
        throw createError({
            statusCode: 401,
            message: "Unauthorized or invalid user ID",
        });
    }

    const { invite_code } = await readBody(event);
    if (!invite_code || typeof invite_code !== "string") {
        throw createError({
            statusCode: 400,
            message: "Valid invite code required",
        });
    }

    // Find group by invite code
    const { data: group, error: findError } = await supabase
        .from("groups")
        .select("id")
        .eq("invite_code", invite_code)
        .maybeSingle();

    if (findError) {
        console.error("Group lookup error:", findError);
        throw createError({
            statusCode: 500,
            message: "Database error looking up group",
        });
    }

    if (!group || !group.id) {
        throw createError({ statusCode: 404, message: "Invalid invite code" });
    }

    // Check if user is already a member
    const { data: existing, error: checkError } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", group.id)
        .eq("user_id", user.sub)
        .maybeSingle();

    if (checkError) {
        console.error("Membership check error:", checkError);
        throw createError({
            statusCode: 500,
            message: "Error checking membership",
        });
    }

    if (existing) {
        // Already a member – return success
        return { success: true, group_id: group.id, already_member: true };
    }

    // Insert new member – ensure both IDs are valid
    const { error: insertError } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.sub,
        role: "member",
    });

    if (insertError) {
        console.error("Insert error:", insertError);
        // Check if it's a duplicate key error (PostgreSQL code 23505)
        if (insertError.code === "23505") {
            return { success: true, group_id: group.id, already_member: true };
        }
        throw createError({ statusCode: 500, message: insertError.message });
    }

    return { success: true, group_id: group.id };
});
