import type { SupabaseClient } from '@supabase/supabase-js'

export async function getProfileAdminStatus(
    supabase: SupabaseClient,
    userId: string,
): Promise<boolean> {
    const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

    if (error) throw error

    return data?.is_admin ?? false
}
