import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export async function requireAdmin(event: any) {
    const user = await serverSupabaseUser(event);
    if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

    const supabase = await serverSupabaseClient(event);
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.sub)
        .single();

    if (error || !profile?.is_admin) {
        throw createError({
            statusCode: 403,
            message: "Forbidden – admin access required",
        });
    }

    return { user, profile, supabase };
}
