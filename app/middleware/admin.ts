// ~/middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
    const supabase = useSupabaseClient();

    // Get authenticated user directly – this waits for a valid session
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return navigateTo("/login");
    }

    // Now user.id is guaranteed to be a valid UUID
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("[admin] Error fetching profile:", profileError);
    }

    const isAdmin = profile?.is_admin === true;

    // Prevent infinite loop: if already on /dashboard, do not redirect again
    if (!isAdmin) {
        if (to.path === "/dashboard") {
            return;
        }
        return navigateTo("/dashboard");
    }
});
