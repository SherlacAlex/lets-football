import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import { customAlphabet } from "nanoid";

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

    const { name } = await readBody(event);
    if (!name)
        throw createError({ statusCode: 400, message: "League name required" });

    const inviteCode = customAlphabet(
        "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789",
        6,
    )();

    const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({ name, invite_code: inviteCode, created_by: user.sub })
        .select()
        .single();

    if (groupError)
        throw createError({ statusCode: 500, message: groupError.message });

    const { error: memberError } = await supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: user.sub, role: "admin" });

    if (memberError)
        throw createError({ statusCode: 500, message: memberError.message });

    return group;
});
