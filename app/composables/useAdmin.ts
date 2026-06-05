export const useAdmin = () => {
    const user = useSupabaseUser();
    const supabase = useSupabaseClient();
    const isAdmin = useState<boolean | null>("isAdmin", () => null);

    const fetchAdminStatus = async () => {
        if (!user.value) {
            isAdmin.value = false;
            return false;
        }
        if (isAdmin.value !== null) return isAdmin.value;

        const { data } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.value.id)
            .single();
        isAdmin.value = data?.is_admin ?? false;
        return isAdmin.value;
    };

    return { isAdmin: readonly(isAdmin), fetchAdminStatus };
};
